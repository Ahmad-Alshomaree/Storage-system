import { getDatabase } from "@/lib/db"
import { products } from "@/lib/schema"

const db = getDatabase()

export async function GET() {
  try {
    const allProducts = db.query.products.findMany({
      with: {
        shipping: true,
      },
      orderBy: (products, { desc }) => desc(products.created_at),
    })

    return Response.json(allProducts)
  } catch (error) {
    console.error("Error fetching products:", error)
    return Response.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
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

    if (!product_name || !product_type || !storage || !box_code) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const now = new Date().toISOString()

    const result = db
      .insert(products)
      .values({
        product_name,
        product_type,
        original_price: original_price || 0,
        selling_price: selling_price || 0,
        storage,
        quantity: quantity || 0,
        weight: weight || 0,
        sizes: sizes || 0,
        colors: colors || "",
        image: image || null,
        box_number,
        price_per_box,
        shipping_id: shipping_id || null,
        total_original_price: total_original_price || 0,
        size_of_box_at_ship: size_of_box_at_ship || 0,
        total_box_size: total_box_size || 0,
        box_code,
        created_at: now,
        updated_at: now,
      })
      .returning()

    return Response.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return Response.json({ error: "Failed to create product" }, { status: 500 })
  }
}
