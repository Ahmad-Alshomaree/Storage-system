import { getDatabase } from "@/lib/db"
import { products } from "@/lib/schema"
import { eq } from "drizzle-orm"

const db = getDatabase()

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const body = await request.json()
    const {
      product_name,
      product_type,
      original_price,
      selling_price,
      storage,
      quantity,
      weight,
      sizes,
      colors,
      image,
      box_number,
      price_per_box,
      shipping_id,
      total_original_price,
      size_of_box_at_ship,
      total_box_size,
      box_code,
    } = body

    const result = await db
      .update(products)
      .set({
        product_name,
        product_type,
        original_price,
        selling_price,
        storage,
        quantity,
        weight,
        sizes,
        colors,
        image,
        box_number,
        price_per_box,
        shipping_id,
        total_original_price,
        size_of_box_at_ship,
        total_box_size,
        box_code,
        updated_at: new Date().toISOString(),
      })
      .where(eq(products.id, id))
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

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    await db.delete(products).where(eq(products.id, id))
    return Response.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return Response.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
