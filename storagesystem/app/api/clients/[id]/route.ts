import { db } from "@/lib/db"
import { client, shipping, debits } from "@/lib/schema"
import { eq, sql } from "drizzle-orm"

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

    // Check for existing relations that prevent deletion
    const [shippingAsSenderCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(shipping)
      .where(eq(shipping.sender_client_id, idNum))

    const [shippingAsReceiverCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(shipping)
      .where(eq(shipping.receiver_client_id, idNum))

    const [clientDebitsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(debits)
      .where(eq(debits.client_id, idNum))

    const hasShippingRelation = (shippingAsSenderCount?.count ?? 0) > 0 || (shippingAsReceiverCount?.count ?? 0) > 0
    const hasDebitRelation = (clientDebitsCount?.count ?? 0) > 0

    if (hasShippingRelation || hasDebitRelation) {
      let errorMessage = "Cannot delete client because they have associated records:\n\n"
      if (hasShippingRelation) {
        errorMessage += "• There are shipping records related to this client\n"
      }
      if (hasDebitRelation) {
        errorMessage += "• There are debit transactions related to this client\n"
      }
      errorMessage += "\nPlease remove these related records first before deleting the client."

      return Response.json({
        error: errorMessage
      }, { status: 400 })
    }

    await db.delete(client).where(eq(client.id, idNum))

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error deleting client:", error)
    return Response.json({ error: "Failed to delete client" }, { status: 500 })
  }
}
