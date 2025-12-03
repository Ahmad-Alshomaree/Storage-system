import { db } from "@/lib/db"
import { debits, client, shipping } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const idNum = Number.parseInt(id)
    const debitData = await db.query.debits.findFirst({
      where: eq(debits.id, idNum),
      with: {
        sender: true,
        receiver: true,
        shipping: true,
      },
    })

    if (!debitData) {
      return Response.json({ error: "Debit not found" }, { status: 404 })
    }

    return Response.json(debitData)
  } catch (error) {
    console.error("Error fetching debit:", error)
    return Response.json({ error: "Failed to fetch debit" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const idNum = Number.parseInt(id)
    const body = await request.json()
    const { sender_id, receiver_id, shipping_id, amount, currency, note, transaction_date } = body

    // If updating a debit with shipping, recalculate amount as ship_price - paid
    let finalAmount = amount
    if (shipping_id) {
      const shippingData = await db.query.shipping.findFirst({
        where: eq(shipping.id, shipping_id),
      })
      if (shippingData) {
        finalAmount = (shippingData.ship_price || 0) - (shippingData.paid || 0)
      }
    }

    const result = await db
      .update(debits)
      .set({
        sender_id: sender_id || null,
        receiver_id,
        shipping_id: shipping_id || null,
        amount: finalAmount,
        currency: currency || "Dollar",
        note: note || null,
        transaction_date,
      })
      .where(eq(debits.id, idNum))
      .returning()

    if (result.length === 0) {
      return Response.json({ error: "Debit not found" }, { status: 404 })
    }

    const debitWithRelations = await db.query.debits.findFirst({
      where: eq(debits.id, idNum),
      with: {
        sender: true,
        receiver: true,
        shipping: true,
      },
    })

    return Response.json(debitWithRelations)
  } catch (error) {
    console.error("Error updating debit:", error)
    return Response.json({ error: "Failed to update debit" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const idNum = Number.parseInt(id)
    await db.delete(debits).where(eq(debits.id, idNum))
    return Response.json({ success: true })
  } catch (error) {
    console.error("Error deleting debit:", error)
    return Response.json({ error: "Failed to delete debit" }, { status: 500 })
  }
}
