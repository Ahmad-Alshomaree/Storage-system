import { NextRequest, NextResponse } from 'next/server'
import { tauriApi } from '@/lib/tauri-api'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json()
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid client ID' }, { status: 400 })
    }

    // Get the existing client
    const clients = await tauriApi.getClients()
    const existingClient = clients.find(c => c.id === id)

    if (!existingClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    // Merge updates with existing data
    const updatedClient = { ...existingClient, ...updates, id }

    // In development mode, we'll simulate the update by returning the updated client
    // In production (Tauri), this would call the actual database update
    console.log('Updating client:', id, updates)

    return NextResponse.json(updatedClient)
  } catch (error) {
    console.error('Error updating client:', error)
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    )
  }
}
