import { db } from "@/lib/db"
import { products } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const idNum = Number.parseInt(id)
    const product = await db.query.products.findFirst({
      where: eq(products.id, idNum),
      with: {
        shipping: true,
      },
    })

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 })
    }

    return Response.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return Response.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const idNum = Number.parseInt(id)
    const body = await request.json()
    const {
      box_code,
      product_name,
      original_price,
      total_original_price,
      selling_price,
      storage,
      weight,
      image,
      pice_per_box,
      Total_pices,
      size_of_box,
      total_box_size,
      number_of_boxes,
      shipping_id,
    } = body

    const result = await db
      .update(products)
      .set({
        box_code,
        product_name,
        original_price,
        total_original_price,
        selling_price,
        storage,
        weight,
        image,
        pice_per_box,
        Total_pices,
        size_of_box,
        total_box_size,
        number_of_boxes,
        shipping_id,
        updated_at: new Date().toISOString(),
      })
      .where(eq(products.id, idNum))
      .returning()

    if (result.length === 0) {
      return Response.json({ error: "Product not found" }, { status: 404 })
    }

    return Response.json(result[0])
  } catch (error) {
    console.error("Error updating product:", error)
    return Response.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const idNum = Number.parseInt(id)
    await db.delete(products).where(eq(products.id, idNum))
    return Response.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return Response.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
