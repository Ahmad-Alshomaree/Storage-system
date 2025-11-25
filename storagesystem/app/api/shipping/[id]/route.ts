import { getDatabase } from "@/lib/db"
import { shipping } from "@/lib/schema"
import { eq } from "drizzle-orm"

const db = getDatabase()

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const record = db.query.shipping.findFirst({
      where: eq(shipping.id, id),
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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()
    const { type, shipping_date, receiver } = body

    if (!["input load", "output load"].includes(type)) {
      return Response.json({ error: "Invalid shipping type" }, { status: 400 })
    }

    const result = db
      .update(shipping)
      .set({
        type,
        shipping_date,
        receiver,
      })
      .where(eq(shipping.id, id))
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    db.delete(shipping).where(eq(shipping.id, id)).run()
    return Response.json({ success: true })
  } catch (error) {
    console.error("Error deleting shipping record:", error)
    return Response.json({ error: "Failed to delete shipping record" }, { status: 500 })
  }
}
