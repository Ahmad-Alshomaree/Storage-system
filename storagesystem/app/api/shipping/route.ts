// Static export compatibility; not actually used by the desktop app.
export const dynamic = 'force-static';

import { NextResponse } from 'next/server'
import { tauriApi } from '@/lib/tauri-api'

export async function GET() {
  try {
    const shipping = await tauriApi.getShipping()
    return NextResponse.json(shipping)
  } catch (error) {
    console.error('Error fetching shipping:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shipping records' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const shipping = await request.json()
    const createdShipping = await tauriApi.createShipping(shipping)
    return NextResponse.json(createdShipping, { status: 201 })
  } catch (error) {
    console.error('Error creating shipping:', error)
    return NextResponse.json(
      { error: 'Failed to create shipping record' },
      { status: 500 }
    )
  }
}
