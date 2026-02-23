// Mark as static so Next's exporter doesn't complain. These endpoints
// are unused inside the desktop build (tauriApi talks directly to Tauri),
// but they are kept for the web version.
export const dynamic = 'force-static';

import { NextResponse } from 'next/server'
import { tauriApi } from '@/lib/tauri-api'

export async function GET() {
  try {
    const clients = await tauriApi.getClients()
    return NextResponse.json(clients)
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const client = await request.json()
    const createdClient = await tauriApi.createClient(client)
    return NextResponse.json(createdClient, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    )
  }
}
