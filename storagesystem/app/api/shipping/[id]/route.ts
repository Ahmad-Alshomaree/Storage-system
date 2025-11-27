import { db } from "@/lib/db"
import { shipping } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const record = await db.query.shipping.findFirst({
      where: eq(shipping.id, Number.parseInt(id)),
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
    const { type, shipping_date, receiving_date, receiver } = body

    if (!["Going","Comming"].includes(type)) {
      return Response.json({ error: "Invalid shipping type" }, { status: 400 })
    }

    const result = await db
      .update(shipping)
      .set({
        type,
        shipping_date,
        receiving_date,
        receiver,
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
    await db.delete(shipping).where(eq(shipping.id, Number.parseInt(id)))
    return Response.json({ success: true })
  } catch (error) {
    console.error("Error deleting shipping record:", error)
    return Response.json({ error: "Failed to delete shipping record" }, { status: 500 })
  }
}
