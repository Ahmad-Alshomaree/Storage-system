import { db } from "@/lib/db"
import { debits, client } from "@/lib/schema"
import { eq, and, sql } from "drizzle-orm"

export async function GET() {
  try {
    const allDebits = await db.query.debits.findMany({
      with: {
        sender: true,
        receiver: true,
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
    const { sender_id, receiver_id, shipping_id, amount, currency, note, transaction_date } = body

    if (!receiver_id || !amount) {
      return Response.json({
        error: "receiver_id and amount are required"
      }, { status: 400 })
    }

    const actualSenderId = sender_id || null

    const result = await db
      .insert(debits)
      .values({
        sender_id: actualSenderId,
        receiver_id,
        shipping_id: shipping_id || null,
        amount,
        currency: currency || "Dollar",
        note: note || null,
        transaction_date,
        created_at: new Date().toISOString(),
      })
      .returning()

    const debitRecord = result[0]

    // Calculate total_debit if sender is specified
    if (actualSenderId !== null) {
      const [{ sum }] = await db
        .select({ sum: sql<number>`sum(${debits.amount})` })
        .from(debits)
        .where(and(eq(debits.sender_id, actualSenderId), eq(debits.receiver_id, receiver_id)))

      await db
        .update(debits)
        .set({ total_debit: sum })
        .where(and(eq(debits.sender_id, actualSenderId), eq(debits.receiver_id, receiver_id)))
    }

    // Note: Client debt tracking fields (debt, total_debts) are not currently in the schema
    // The debits table serves as a transaction ledger for tracking financial activities

    const debitWithRelations = await db.query.debits.findFirst({
      where: eq(debits.id, debitRecord.id),
      with: {
        sender: true,
        receiver: true,
        shipping: true,
      },
    })

    return Response.json(debitWithRelations, { status: 201 })
  } catch (error) {
    console.error("Error creating debit:", error)
    return Response.json({ error: "Failed to create debit" }, { status: 500 })
  }
}
