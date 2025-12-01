import { db } from "@/lib/db"
import { shipping, storeProducts, products, debits } from "@/lib/schema"
import { eq, and, sql } from "drizzle-orm"

export async function GET() {
  try {
    const allShipping = await db.query.shipping.findMany({
      with: {
        products: true,
        receiver: true,
        sender: true,
      },
      orderBy: (shipping, { desc }) => desc(shipping.created_at),
    })

    return Response.json(allShipping)
  } catch (error) {
    console.error("Error fetching shipping records:", error)
    return Response.json({ error: "Failed to fetch shipping records" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Shipping API received:", body)
    const { type, shipping_date, receiving_date, receiver_client_id, sender_client_id, paid, ship_price, currency, note } = body

    console.log("Parsed data:", { type, shipping_date, receiving_date, receiver_client_id, sender_client_id })

    if (!type || !shipping_date || !receiving_date || !receiver_client_id || !sender_client_id) {
      console.log("Missing fields:", { type: !!type, shipping_date: !!shipping_date, receiving_date: !!receiving_date, receiver_client_id: !!receiver_client_id, sender_client_id: !!sender_client_id })
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!["input load", "output load", "comming", "coming", "going"].includes(type)) {
      return Response.json({ error: "Invalid shipping type" }, { status: 400 })
    }

    const result = await db
      .insert(shipping)
      .values({
        type,
        shipping_date,
        receiving_date,
        receiver_client_id,
        sender_client_id,
        paid: paid || 0,
        ship_price: ship_price || 0,
        currency: currency || "Dollar",
        note: note || null,
        created_at: new Date().toISOString(),
      })
      .returning()

    const newShipping = Array.isArray(result) ? result[0] : result
    console.log("Created shipping:", newShipping)

    // Automatically create debit record if shipping costs are not fully paid
    let createdShortage = false
    let createdOverpaid = false
    if (ship_price && ship_price > 0 && paid < ship_price) {
      const outstandingAmount = ship_price - (paid || 0)
      await db.insert(debits).values({
        sender_id: sender_client_id,
        receiver_id: receiver_client_id,
        shipping_id: newShipping.id,
        amount: outstandingAmount,
        currency: currency || "Dollar",
        note: `Shipping cost - ${type}`,
        transaction_date: receiving_date,
        created_at: new Date().toISOString(),
      })
      createdShortage = true
      console.log(`Created debit record for outstanding shipping cost: ${outstandingAmount}`)
    }

    // Automatically create credit record if overpaid
    if (paid > ship_price) {
      const overpaidAmount = paid - ship_price
      await db.insert(debits).values({
        sender_id: receiver_client_id,
        receiver_id: sender_client_id,
        shipping_id: newShipping.id,
        amount: overpaidAmount,
        currency: currency || "Dollar",
        note: `Overpayment - ${type}`,
        transaction_date: receiving_date,
        created_at: new Date().toISOString(),
      })
      createdOverpaid = true
      console.log(`Created credit record for overpayment: ${overpaidAmount}`)
    }

    // Update total_debit for affected pairs
    if (createdShortage) {
      const [{ sum }] = await db
        .select({ sum: sql<number>`sum(${debits.amount})` })
        .from(debits)
        .where(and(eq(debits.sender_id, sender_client_id), eq(debits.receiver_id, receiver_client_id)))
      await db
        .update(debits)
        .set({ total_debit: sum })
        .where(and(eq(debits.sender_id, sender_client_id), eq(debits.receiver_id, receiver_client_id)))
    }
    if (createdOverpaid) {
      const [{ sum }] = await db
        .select({ sum: sql<number>`sum(${debits.amount})` })
        .from(debits)
        .where(and(eq(debits.sender_id, receiver_client_id), eq(debits.receiver_id, sender_client_id)))
      await db
        .update(debits)
        .set({ total_debit: sum })
        .where(and(eq(debits.sender_id, receiver_client_id), eq(debits.receiver_id, sender_client_id)))
    }

    return Response.json(newShipping, { status: 201 })
  } catch (error) {
    console.error("Error creating shipping record:", error)
    return Response.json({ error: "Failed to create shipping record" }, { status: 500 })
  }
}
