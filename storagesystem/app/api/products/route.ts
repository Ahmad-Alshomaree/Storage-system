import { db } from "@/lib/db"
import { products } from "@/lib/schema"

export async function GET() {
  try {
    const allProducts = await db.query.products.findMany({
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
      original_price,
      selling_price,
      group_item_price,
      storage,
      quantity,
      weight,
      sizes,
      colors,
      image,
      number_of_boxes,
      pice_per_box,
      shipping_id,
      size_of_box,
      total_box_size,
      box_code,
      extracted_pieces,
      currency,
      note,
    } = body

    if (!box_code || original_price === undefined || original_price === null || selling_price === undefined || selling_price === null) {
      return Response.json({ error: "Missing required fields: box_code, original_price, and selling_price are required" }, { status: 400 })
    }

    const now = new Date().toISOString()

    // Calculate totals manually
    const piecesPerBox = Math.max(1, pice_per_box || 1);
    const numBoxes = Math.max(1, number_of_boxes || 1);
    const totalPieces = Math.round(piecesPerBox * numBoxes);
    const totalOriginalPriceValue = totalPieces * (original_price || 0);

    const result = await db
      .insert(products)
      .values({
        product_name,
        original_price: original_price || 0,
        selling_price: selling_price || 0,
        Grope_Item_price: group_item_price || 0,
        storage,
        weight: weight || 0,
        image: image || null,
        pice_per_box: piecesPerBox,
        size_of_box: size_of_box || 0,
        total_box_size: total_box_size || 0,
        number_of_boxes: numBoxes,
        extracted_pieces: extracted_pieces || 0,
        Total_pices: totalPieces,
        total_original_price: totalOriginalPriceValue,
        box_code,
        shipping_id: shipping_id || null,
        status: "available",
        currency,
        note: note || null,
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
