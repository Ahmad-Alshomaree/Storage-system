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
      return NextResponse.json({ error: 'Invalid shipping ID' }, { status: 400 })
    }

    // Get the existing shipping record
    const shipping = await tauriApi.getShipping()
    const existingShipping = shipping.find(s => s.id === id)

    if (!existingShipping) {
      return NextResponse.json({ error: 'Shipping record not found' }, { status: 404 })
    }

    // Merge updates with existing data
    const updatedShipping = { ...existingShipping, ...updates, id }

    // In development mode, we'll simulate the update by returning the updated shipping
    // In production (Tauri), this would call the actual database update
    console.log('Updating shipping:', id, updates)

    return NextResponse.json(updatedShipping)
  } catch (error) {
    console.error('Error updating shipping:', error)
    return NextResponse.json(
      { error: 'Failed to update shipping record' },
      { status: 500 }
    )
  }
}
