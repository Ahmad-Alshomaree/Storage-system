import { getDatabase } from "@/lib/db"
import { shipping } from "@/lib/schema"

const db = getDatabase()

export async function GET() {
  try {
    const allShipping = await db.query.shipping.findMany({
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
    const { type, shipping_date, receiver } = body

    if (!type || !shipping_date || !receiver) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!["input load", "output load"].includes(type)) {
      return Response.json({ error: "Invalid shipping type" }, { status: 400 })
    }

    const result = await db
      .insert(shipping)
      .values({
        type,
        shipping_date,
        receiver,
        created_at: new Date().toISOString(),
      })
      .returning()

    return Response.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating shipping record:", error)
    return Response.json({ error: "Failed to create shipping record" }, { status: 500 })
  }
}
