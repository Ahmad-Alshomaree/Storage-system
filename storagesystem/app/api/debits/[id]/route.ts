import { NextRequest, NextResponse } from 'next/server'
import { tauriApi } from '@/lib/tauri-api'

export const dynamic = 'force-static';

export function generateStaticParams() {
  return []
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json()
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid debit ID' }, { status: 400 })
    }

    // Get the existing debit
    const debits = await tauriApi.getDebits()
    const existingDebit = debits.find(d => d.id === id)

    if (!existingDebit) {
      return NextResponse.json({ error: 'Debit not found' }, { status: 404 })
    }

    // Merge updates with existing data
    const updatedDebit = { ...existingDebit, ...updates, id }

    // In development mode, we'll simulate the update by returning the updated debit
    // In production (Tauri), this would call the actual database update
    console.log('Updating debit:', id, updates)

    return NextResponse.json(updatedDebit)
  } catch (error) {
    console.error('Error updating debit:', error)
    return NextResponse.json(
      { error: 'Failed to update debit' },
      { status: 500 }
    )
  }
}
