import { db } from "@/lib/db"
import { client } from "@/lib/schema"

export async function GET() {
  try {
    const allClients = await db.query.client.findMany({
      with: {
        shipping: true,
      },
      orderBy: (client, { desc }) => desc(client.id),
    })

    return Response.json(allClients)
  } catch (error) {
    console.error("Error fetching clients:", error)
    return Response.json({ error: "Failed to fetch clients" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { client_name, phone_number, shipping_id, history, debt } = body

    if (!client_name) {
      return Response.json({ error: "Client name is required" }, { status: 400 })
    }

    const result = await db
      .insert(client)
      .values({
        client_name,
        phone_number: phone_number || null,
        shipping_id: shipping_id || null,
        history: history || null,
        debt: debt || 0,
        total_debts: debt || 0, // Initialize total_debts to the initial debt
      })
      .returning()

    return Response.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating client:", error)
    return Response.json({ error: "Failed to create client" }, { status: 500 })
  }
}
