import { db } from "@/lib/db"
import { debits, client } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const allDebits = await db.query.debits.findMany({
      with: {
        client: true,
        shipping: true,
      },
      orderBy: (debits, { desc }) => desc(debits.transaction_date),
    })

    return Response.json(allDebits)
  } catch (error) {
    console.error("Error fetching debits:", error)
    return Response.json({ error: "Failed to fetch debits" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { client_id, shipping_id, amount, type, description, transaction_date } = body

    if (!client_id || !amount || !type || !transaction_date) {
      return Response.json({
        error: "client_id, amount, type, and transaction_date are required"
      }, { status: 400 })
    }

    if (type !== "debit" && type !== "credit") {
      return Response.json({ error: "Type must be 'debit' or 'credit'" }, { status: 400 })
    }

    const result = await db
      .insert(debits)
      .values({
        client_id,
        shipping_id: shipping_id || null,
        amount,
        type,
        description: description || null,
        transaction_date,
        created_at: new Date().toISOString(),
      })
      .returning()

    // Update client's debt totals
    const debitRecord = result[0]
    const clientData = await db.query.client.findFirst({
      where: eq(client.id, client_id),
    })

    if (clientData) {
      if (debitRecord.type === "debit") {
        await db
          .update(client)
          .set({
            debt: clientData.debt + debitRecord.amount,
            total_debts: clientData.total_debts + debitRecord.amount,
          })
          .where(eq(client.id, client_id))
      } else if (debitRecord.type === "credit") {
        await db
          .update(client)
          .set({
            debt: Math.max(0, clientData.debt - debitRecord.amount),
          })
          .where(eq(client.id, client_id))
      }
    }

    const debitWithClient = await db.query.debits.findFirst({
      where: eq(debits.id, debitRecord.id),
      with: {
        client: true,
        shipping: true,
      },
    })

    return Response.json(debitWithClient, { status: 201 })
  } catch (error) {
    console.error("Error creating debit:", error)
    return Response.json({ error: "Failed to create debit" }, { status: 500 })
  }
}
