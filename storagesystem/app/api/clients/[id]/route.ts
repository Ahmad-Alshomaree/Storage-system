import { db } from "@/lib/db"
import { client } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const idNum = Number.parseInt(id)
    const clientData = await db.query.client.findFirst({
      where: eq(client.id, idNum),
      with: {
        shipping: true,
      },
    })

    if (!clientData) {
      return Response.json({ error: "Client not found" }, { status: 404 })
    }

    return Response.json(clientData)
  } catch (error) {
    console.error("Error fetching client:", error)
    return Response.json({ error: "Failed to fetch client" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const idNum = Number.parseInt(id)
    const body = await request.json()
    const { client_name, phone_number, shipping_id, history, debt } = body

    // For now, update total_debts to the new debt value (assuming debt is cumulative)
    // You might want to adjust this logic based on business requirements
    const newTotalDebts = debt !== undefined ? debt : 0

    const result = await db
      .update(client)
      .set({
        client_name,
        phone_number,
        shipping_id: shipping_id || null,
        history,
        debt,
        total_debts: newTotalDebts,
      })
      .where(eq(client.id, idNum))
      .returning()

    if (result.length === 0) {
      return Response.json({ error: "Client not found" }, { status: 404 })
    }

    return Response.json(result[0])
  } catch (error) {
    console.error("Error updating client:", error)
    return Response.json({ error: "Failed to update client" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const idNum = Number.parseInt(id)
    await db.delete(client).where(eq(client.id, idNum))
    return Response.json({ success: true })
  } catch (error) {
    console.error("Error deleting client:", error)
    return Response.json({ error: "Failed to delete client" }, { status: 500 })
  }
}
