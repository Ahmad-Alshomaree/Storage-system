import { db } from "@/lib/db"
import { shipping, products, debits, storeProducts, client } from "@/lib/schema"
import { eq, inArray, sql } from "drizzle-orm"

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

    if (!["input load", "output load", "comming"].includes(type)) {
      return Response.json({ error: "Invalid shipping type" }, { status: 400 })
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

    if (result.length === 0) {
      return Response.json({ error: "Shipping record not found" }, { status: 404 })
    }

    return Response.json(result[0])
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
