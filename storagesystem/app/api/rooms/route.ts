// Static export compatibility; not actually used by the desktop app.
export const dynamic = 'force-static';

import { NextResponse } from 'next/server'
import { tauriApi } from '@/lib/tauri-api'

export async function GET() {
  try {
    const rooms = await tauriApi.getRooms()
    return NextResponse.json(rooms)
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const room = await request.json()
    const createdRoom = await tauriApi.createRoom(room)
    return NextResponse.json(createdRoom, { status: 201 })
  } catch (error) {
    console.error('Error creating room:', error)
    return NextResponse.json(
      { error: 'Failed to create room' },
      { status: 500 }
    )
  }
}
