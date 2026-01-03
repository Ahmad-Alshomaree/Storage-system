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
      return NextResponse.json({ error: 'Invalid product ID' }, { status: 400 })
    }

    // Get the existing product
    const products = await tauriApi.getProducts()
    const existingProduct = products.find(p => p.id === id)

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Merge updates with existing data
    const updatedProduct = { ...existingProduct, ...updates, id }

    // In development mode, we'll simulate the update by returning the updated product
    // In production (Tauri), this would call the actual database update
    console.log('Updating product:', id, updates)

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}
