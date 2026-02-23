// API routes are only needed for web development/deployment. When
// `output: 'export'` is used for the Next build (as required by Tauri),
// they must be marked static so the static exporter will succeed. The
// routes themselves are not invoked inside the desktop app because the
// tauriApi helper bypasses them.
export const dynamic = 'force-static';

import { NextResponse } from 'next/server'
import { tauriApi } from '@/lib/tauri-api'

export async function GET() {
  try {
    const products = await tauriApi.getProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const product = await request.json()
    const createdProduct = await tauriApi.createProduct(product)
    return NextResponse.json(createdProduct, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
