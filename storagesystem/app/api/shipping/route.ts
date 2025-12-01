import { db } from "@/lib/db"
import { shipping, storeProducts, products } from "@/lib/schema"
import { eq } from "drizzle-orm"

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
    return Response.json(newShipping, { status: 201 })
  } catch (error) {
    console.error("Error creating shipping record:", error)
    return Response.json({ error: "Failed to create shipping record" }, { status: 500 })
  }
}
