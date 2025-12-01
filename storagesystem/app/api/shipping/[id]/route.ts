import { db } from "@/lib/db"
import { shipping, products, debits, storeProducts, client } from "@/lib/schema"
import { eq, inArray, sql, and } from "drizzle-orm"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const record = await db.query.shipping.findFirst({
      where: eq(shipping.id, Number.parseInt(id)),
      with: {
        products: true,
        receiver: true,
        sender: true,
      },
    })

    if (!record) {
      return Response.json({ error: "Shipping record not found" }, { status: 404 })
    }

    return Response.json(record)
  } catch (error) {
    console.error("Error fetching shipping record:", error)
    return Response.json({ error: "Failed to fetch shipping record" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { type, shipping_date, receiving_date, receiver_client_id, sender_client_id, paid, ship_price, currency, note } = body

    if (!["input load", "output load", "comming", "coming", "going"].includes(type)) {
      return Response.json({ error: "Invalid shipping type" }, { status: 400 })
    }

    // Get current shipping record to check for changes
    const currentShipping = await db.query.shipping.findFirst({
      where: eq(shipping.id, Number.parseInt(id)),
    })

    if (!currentShipping) {
      return Response.json({ error: "Shipping record not found" }, { status: 404 })
    }

    const result = await db
      .update(shipping)
      .set({
        type,
        shipping_date,
        receiving_date,
        receiver_client_id,
        sender_client_id,
        paid,
        ship_price,
        currency,
        note,
      })
      .where(eq(shipping.id, Number.parseInt(id)))
      .returning()

    if (Array.isArray(result) && result.length === 0 || !result) {
      return Response.json({ error: "Shipping record not found" }, { status: 404 })
    }

    const updatedShipping = Array.isArray(result) ? result[0] : result

    // Update debits automatically
    let updatedShortage = false
    let updatedOverpaid = false
    await db.transaction(async (tx) => {
      // Delete existing debits for this shipping
      await tx.delete(debits).where(eq(debits.shipping_id, updatedShipping.id))

      // Create new debit if shipping costs are not fully paid
      if (updatedShipping.ship_price && updatedShipping.ship_price > 0 && updatedShipping.paid < updatedShipping.ship_price) {
        const outstandingAmount = updatedShipping.ship_price - updatedShipping.paid
        await tx.insert(debits).values({
          sender_id: updatedShipping.sender_client_id,
          receiver_id: updatedShipping.receiver_client_id,
          shipping_id: updatedShipping.id,
          amount: outstandingAmount,
          currency: updatedShipping.currency || "Dollar",
          note: `Shipping cost - ${updatedShipping.type}`,
          transaction_date: updatedShipping.receiving_date,
          created_at: new Date().toISOString(),
        })
        updatedShortage = true
      }

      // Create credit if overpaid
      if (updatedShipping.paid > updatedShipping.ship_price) {
        const overpaidAmount = updatedShipping.paid - updatedShipping.ship_price
        await tx.insert(debits).values({
          sender_id: updatedShipping.receiver_client_id,
          receiver_id: updatedShipping.sender_client_id,
          shipping_id: updatedShipping.id,
          amount: overpaidAmount,
          currency: updatedShipping.currency || "Dollar",
          note: `Overpayment - ${updatedShipping.type}`,
          transaction_date: updatedShipping.receiving_date,
          created_at: new Date().toISOString(),
        })
        updatedOverpaid = true
      }
    })

    // Update total_debit for affected pairs
    if (updatedShortage) {
      const [{ sum }] = await db
        .select({ sum: sql<number>`sum(${debits.amount})` })
        .from(debits)
        .where(and(eq(debits.sender_id, updatedShipping.sender_client_id), eq(debits.receiver_id, updatedShipping.receiver_client_id)))
      await db
        .update(debits)
        .set({ total_debit: sum })
        .where(and(eq(debits.sender_id, updatedShipping.sender_client_id), eq(debits.receiver_id, updatedShipping.receiver_client_id)))
    }
    if (updatedOverpaid) {
      const [{ sum }] = await db
        .select({ sum: sql<number>`sum(${debits.amount})` })
        .from(debits)
        .where(and(eq(debits.sender_id, updatedShipping.receiver_client_id), eq(debits.receiver_id, updatedShipping.sender_client_id)))
      await db
        .update(debits)
        .set({ total_debit: sum })
        .where(and(eq(debits.sender_id, updatedShipping.receiver_client_id), eq(debits.receiver_id, updatedShipping.sender_client_id)))
    }

    return Response.json(updatedShipping)
  } catch (error) {
    console.error("Error updating shipping record:", error)
    return Response.json({ error: "Failed to update shipping record" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const shippingId = Number.parseInt(id)

    // Use transaction to handle cascading deletes
    await db.transaction(async (tx) => {
      // First, set clients' shipping_id to null where it references this shipping
      await tx.update(client).set({ shipping_id: null }).where(eq(client.shipping_id, shippingId))

      // Get all products in this shipping
      const shippingProducts = await tx.select({ id: products.id }).from(products).where(eq(products.shipping_id, shippingId))
      const productIds = shippingProducts.map(p => p.id)

      if (productIds.length > 0) {
        // Delete store_products related to these products
        await tx.delete(storeProducts).where(inArray(storeProducts.product_id, productIds))

        // Delete products
        await tx.delete(products).where(eq(products.shipping_id, shippingId))
      }

      // Delete debits related to this shipping
      await tx.delete(debits).where(eq(debits.shipping_id, shippingId))

      // Finally, delete the shipping record
      await tx.delete(shipping).where(eq(shipping.id, shippingId))
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error deleting shipping record:", error)
    return Response.json({ error: "Failed to delete shipping record" }, { status: 500 })
  }
}
