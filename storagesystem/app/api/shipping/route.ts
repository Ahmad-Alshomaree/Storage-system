import { db } from "@/lib/db"
import { shipping } from "@/lib/schema"

export async function GET() {
  try {
    const allShipping = await db.query.shipping.findMany({
      with: {
        products: true,
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
    const { type, shipping_date, receiver, paid, ship_price } = body

    if (!type || !shipping_date || !receiver) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!["Going", "Comming"].includes(type)) {
      return Response.json({ error: "Invalid shipping type" }, { status: 400 })
    }

    // Set receiving_date to the same as shipping_date if not provided
    const receiving_date = shipping_date

    const result = await db
      .insert(shipping)
      .values({
        type,
        shipping_date,
        receiving_date,
        receiver,
        paid: paid || 0,
        ship_price: ship_price || 0,
        created_at: new Date().toISOString(),
      })
      .returning()

    return Response.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating shipping record:", error)
    return Response.json({ error: "Failed to create shipping record" }, { status: 500 })
  }
}
