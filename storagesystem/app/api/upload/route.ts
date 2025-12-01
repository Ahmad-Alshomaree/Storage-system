
import { NextRequest, NextResponse } from "next/server"
import { shipping, products, client } from "@/lib/schema"
import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import * as XLSX from "xlsx"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    const receiver = formData.get("receiver") as string
    const shippingDate = formData.get("shipping_date") as string
    const type = formData.get("type") as string
    const cost = formData.get("cost") as string
    const paid = formData.get("paid") as string

    if (!file || !receiver || !shippingDate || !type || !cost || !paid) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const uploadDir = join(process.cwd(), "public/uploads")
    
    try {
        await mkdir(uploadDir, { recursive: true })
    } catch (e) {
        // Ignore if exists
    }

    const filename = `${Date.now()}-${file.name}`
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Parse Excel
    const workbook = XLSX.read(buffer, { type: "buffer" })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][]

    // Find column indices by header names
    const headerRow = rawData[0]
    const columnMap: Record<string, number> = {}
    headerRow.forEach((header, index) => {
      columnMap[header.toLowerCase().trim()] = index
    })

    // Get positions
    const firstColIndex = 0 // A column
    const secondColIndex = 1 // B column
    const itemNoColIndex = columnMap['item no'] ?? columnMap['item'] ?? -1
    const ctnColIndex = columnMap['ctn'] ?? -1
    const pcsCtnColIndex = columnMap['pcs/ctn'] ?? columnMap['pcs ct'] ?? -1
    const qtyColIndex = columnMap['qty'] ?? -1
    const priceColIndex = columnMap['price'] ?? -1
    const tPriceColIndex = columnMap['t/price'] ?? columnMap['t price'] ?? -1
    const cbmCntColIndex = columnMap['cbm/cnt'] ?? columnMap['cbm cnt'] ?? -1
    const tCbmColIndex = columnMap['t/cbm'] ?? columnMap['t cbm'] ?? -1

    // Find client id by name
    const [clientRecord] = await db.select().from(client).where(eq(client.client_name, receiver)).limit(1)

    if (!clientRecord) {
      throw new Error(`Client with name "${receiver}" not found`)
    }

    // Create Shipping Record
    const newShipping = await db.insert(shipping).values({
      type,
      shipping_date: shippingDate,
      receiving_date: new Date().toISOString(),
      receiver_client_id: clientRecord.id,
      sender_client_id: clientRecord.id, // Use same for now, can be updated later
      file_path: `/uploads/${filename}`,
      paid: parseFloat(paid),
      ship_price: parseFloat(cost),
      created_at: new Date().toISOString(),
    }).returning()

    if (!newShipping || newShipping.length === 0) {
      throw new Error("Failed to create shipping record")
    }

    const shippingId = newShipping[0].id

    // Process rows starting from index 1 (skip header)
    const productPromises = rawData.slice(1).map((row: string[]) => {
        // Skip empty rows - check if item column exists and has value
        const itemValue = itemNoColIndex !== -1 ? row[itemNoColIndex] : ''
        if (!itemValue || itemValue.trim() === '') return null

        const safeFloat = (val: any) => {
          const parsed = parseFloat(val)
          return isNaN(parsed) ? 0 : parsed
        }

        const safeInt = (val: any) => {
          const parsed = parseInt(val)
          return isNaN(parsed) ? 0 : parsed
        }

        return db.insert(products).values({
            shipping_id: shippingId,
            box_code: String(row[itemNoColIndex] || ''), // Item No column -> box_code
            product_name: String(row[itemNoColIndex] || ''),
            original_price: safeFloat(row[priceColIndex !== -1 ? priceColIndex : 0]),
            selling_price: safeFloat(row[secondColIndex]), // Second column -> selling_price
            storage: "Default",
            weight: 0,
            image: "", // Manually entered later
            pice_per_box: safeInt(row[pcsCtnColIndex !== -1 ? pcsCtnColIndex : 0]),
            Total_pices: safeInt(row[qtyColIndex !== -1 ? qtyColIndex : 0]),
            total_original_price: safeFloat(row[tPriceColIndex !== -1 ? tPriceColIndex : 0]),
            size_of_box: safeFloat(row[cbmCntColIndex !== -1 ? cbmCntColIndex : 0]),
            total_box_size: safeFloat(row[tCbmColIndex !== -1 ? tCbmColIndex : 0]),
            number_of_boxes: safeFloat(row[ctnColIndex !== -1 ? ctnColIndex : 0]),
            Grope_Item_price: safeFloat(row[firstColIndex]), // First column -> Grope_Item_price
            currency: "Dollar",
            note: "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
    }).filter(Boolean)

    await Promise.all(productPromises)

    return NextResponse.json({ success: true, shippingId })

  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
