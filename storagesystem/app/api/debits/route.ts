// Static export compatibility; not actually used by the desktop app.
export const dynamic = 'force-static';

import { NextResponse } from 'next/server'
import { tauriApi } from '@/lib/tauri-api'

export async function GET() {
  try {
    const debits = await tauriApi.getDebits()
    return NextResponse.json(debits)
  } catch (error) {
    console.error('Error fetching debits:', error)
    return NextResponse.json(
      { error: 'Failed to fetch debits' },
      { status: 500 }
    )
  }
}
