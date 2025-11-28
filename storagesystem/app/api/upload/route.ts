
import { NextRequest, NextResponse } from "next/server"
import { shipping, products } from "@/lib/schema"
import { db } from "@/lib/db"
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
    const data = XLSX.utils.sheet_to_json(sheet, { header: "A" })

    // Create Shipping Record
    const newShipping = await db.insert(shipping).values({
      type,
      shipping_date: shippingDate,
      receiving_date: new Date().toISOString(),
      receiver,
      file_path: `/uploads/${filename}`,
      paid: parseFloat(paid),
      ship_price: parseFloat(cost),
      created_at: new Date().toISOString(),
    }).returning()

    const shippingId = newShipping[0].id

    // Process rows
    // Starting from row 2 (index 1) because row 1 is likely header
    // The user provided structure:
    // A: List No
    // B: Shop No
    // C: Item No (box_code/product_name)
    // D: Picture
    // E: Ctn -> number_of_boxes
    // F: Pcs/Ctn -> pice_per_box
    // G: QTY -> Total_pices
    // H: Price -> original_price
    // I: T/Price -> total_original_price
    // J: CBM/Cnt -> size_of_box
    // K: T/CBM -> total_box_size
    // L: Deposit

    const productPromises = data.slice(1).map((row: any) => {
        // Skip empty rows
        if (!row.C) return null;

        const box_code = String(row.C || "")
        const product_name = String(row.C || "")
        const number_of_boxes = parseFloat(row.E) || 0
        const pice_per_box = parseInt(row.F) || 0
        const Total_pices = parseInt(row.G) || 0
        const original_price = parseFloat(row.H) || 0
        const total_original_price = parseFloat(row.I) || 0
        const size_of_box = parseFloat(row.J) || 0
        const total_box_size = parseFloat(row.K) || 0
        
        // Ensure values are not NaN if possible, schema says not null for some
        // If #REF! is in excel, it might come as string or something.
        // We should sanitize.

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
            box_code,
            product_name,
            original_price: safeFloat(row.H),
            selling_price: 0, // Default
            storage: "Default",
            weight: 0,
            image: "", // Manually entered later
            pice_per_box: safeInt(row.F),
            size_of_box: safeFloat(row.J),
            total_box_size: safeFloat(row.K),
            number_of_boxes: safeFloat(row.E),
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
