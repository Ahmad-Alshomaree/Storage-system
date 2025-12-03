import { NextResponse } from "next/server"
import { products } from "@/lib/schema"
import { db } from "@/lib/db"

export async function POST(request: Request) {
  try {
    const { productsData } = await request.json()

    if (!productsData || !Array.isArray(productsData)) {
      return NextResponse.json({ error: "Invalid products data" }, { status: 400 })
    }

    const insertPromises = productsData.map((product: any) => {
      const insertValue: any = {
        shipping_id: null, // No shipping association
        item_no: product.itemNo || '',
        box_code: product.boxCode || '',
        product_name: product.productName || '',
        cost: parseFloat(product.cost) || 0,
        selling_price: parseFloat(product.sellingPrice) || 0,
        storage: product.storage || "Default",
        weight: 0,
        image: product.image || "",
        pice_per_box: parseInt(product.piecesPerBox) || 0,
        Total_pices: parseInt(product.quantity) || 0,
        total_cost: parseFloat(product.totalCost) || 0,
        size_of_box: parseFloat(product.boxSize) || 0,
        total_box_size: parseFloat(product.totalBoxSize) || 0,
        number_of_boxes: parseFloat(product.numberOfBoxes) || 0,
        Grope_Item_price: parseFloat(product.gropeItemPrice) || 0,
        currency: "Dollar",
        note: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      return db.insert(products).values(insertValue)
    })

    const results = await Promise.all(insertPromises)

    return NextResponse.json({ success: true, productsInserted: results.length })

  } catch (error) {
    console.error("Save error:", error)
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    )
  }
}
