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

    // Fetch current product data
    const existingProduct = await db.query.products.findFirst({
      where: eq(products.id, idNum),
    })

    if (!existingProduct) {
      return Response.json({ error: "Product not found" }, { status: 404 })
    }

    // Handle extracted_pieces separately as it affects status
    const extractedPieces = body.extracted_pieces !== undefined ? body.extracted_pieces : existingProduct.extracted_pieces
    const temporaryUpdateData = {
      box_code: body.box_code ?? existingProduct.box_code,
      product_name: body.product_name ?? existingProduct.product_name,
      original_price: body.original_price ?? existingProduct.original_price,
      selling_price: body.selling_price ?? existingProduct.selling_price,
      Grope_Item_price: body.group_item_price ?? existingProduct.Grope_Item_price,
      storage: body.storage ?? existingProduct.storage,
      weight: body.weight ?? existingProduct.weight,
      image: body.image ?? existingProduct.image,
      pice_per_box: body.pice_per_box ?? existingProduct.pice_per_box,
      size_of_box: body.size_of_box ?? existingProduct.size_of_box,
      total_box_size: body.total_box_size ?? existingProduct.total_box_size,
      number_of_boxes: body.number_of_boxes ?? existingProduct.number_of_boxes,
      shipping_id: body.shipping_id ?? existingProduct.shipping_id,
      updated_at: new Date().toISOString(),
    }

    // Calculate total pieces from current/update data
    const picePerBox = temporaryUpdateData.pice_per_box ?? existingProduct.pice_per_box
    const numberOfBoxes = temporaryUpdateData.number_of_boxes ?? existingProduct.number_of_boxes
    const totalPieces = Math.round(picePerBox * numberOfBoxes)

    // Automatically set status based on extracted_pieces vs total pieces
    const automaticStatus = extractedPieces >= totalPieces ? "out_of_stock" : "available"

    // Final update data including extracted_pieces and status
    const updateData = {
      ...temporaryUpdateData,
      extracted_pieces: extractedPieces,
      status: automaticStatus,
    }

    const result = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, idNum))
      .returning()

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
