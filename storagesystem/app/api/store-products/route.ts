import { db } from "@/lib/db"
import { storeProducts } from "@/lib/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const allStoreProducts = await db.query.storeProducts.findMany({
      with: {
        product: true,
      },
      orderBy: (storeProducts, { desc }) => desc(storeProducts.entered_at),
    })

    return Response.json(allStoreProducts)
  } catch (error) {
    console.error("Error fetching store products:", error)
    return Response.json({ error: "Failed to fetch store products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { product_id, product_name, individual_item_selling_price, image, group_item_price, number_of_items } = body

    if (!product_id || !product_name || !individual_item_selling_price || !number_of_items) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await db
      .insert(storeProducts)
      .values({
        product_id,
        product_name,
        individual_item_selling_price,
        image: image || null,
        group_item_price: group_item_price || null,
        number_of_items,
      })
      .returning()

    return Response.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating store product record:", error)
    return Response.json({ error: "Failed to create store product record" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, number_of_items } = body

    if (!id || number_of_items === undefined) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await db
      .update(storeProducts)
      .set({ number_of_items })
      .where(eq(storeProducts.id, id))
      .returning()

    if (result.length === 0) {
      return Response.json({ error: "Store product not found" }, { status: 404 })
    }

    return Response.json(result[0])
  } catch (error) {
    console.error("Error updating store product:", error)
    return Response.json({ error: "Failed to update store product" }, { status: 500 })
  }
}
