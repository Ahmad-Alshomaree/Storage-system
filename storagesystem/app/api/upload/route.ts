
import { NextRequest, NextResponse } from "next/server"
import { shipping, products, client } from "@/lib/schema"
import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import * as XLSX from "xlsx"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)
    let formData: FormData | null = null
    let editedProducts: any[] | null = null

    if (body) {
      // Handle JSON request with edited data
      const { editedProducts: products, sender_id, receiver_id, shipping_date, type, cost, paid } = body
      editedProducts = products || []
      formData = new FormData()
    } else {
      // Handle FormData request (legacy)
      formData = await req.formData()
    }

    const file = formData?.get("file") as File
    const senderId = formData?.get("sender_id") as string || body?.sender_id
    const receiverId = formData?.get("receiver_id") as string || body?.receiver_id
    const shippingDate = formData?.get("shipping_date") as string || body?.shipping_date
    const type = formData?.get("type") as string || body?.type
    const cost = formData?.get("cost") as string || body?.cost
    const paid = formData?.get("paid") as string || body?.paid

    if ((!file && !editedProducts) || !senderId || !receiverId || !shippingDate || !type || !cost || !paid) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Handle file upload if provided (for shipping record)
    let filePath = ""
    if (file) {
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
      filePath = `/uploads/${filename}`
    }

    // Verify sender and receiver clients exist
    const [senderClient] = await db.select().from(client).where(eq(client.id, parseInt(senderId))).limit(1)
    const [receiverClient] = await db.select().from(client).where(eq(client.id, parseInt(receiverId))).limit(1)

    if (!senderClient) {
      throw new Error(`Sender client with ID "${senderId}" not found`)
    }

    if (!receiverClient) {
      throw new Error(`Receiver client with ID "${receiverId}" not found`)
    }

    // Create Shipping Record
    const newShippingRecords = await db.insert(shipping).values({
      type,
      shipping_date: shippingDate,
      receiving_date: new Date().toISOString(),
      receiver_client_id: receiverClient.id,
      sender_client_id: senderClient.id,
      file_path: filePath,
      paid: parseFloat(paid),
      ship_price: parseFloat(cost),
      created_at: new Date().toISOString(),
    }).returning() as any[]

    if (!newShippingRecords || newShippingRecords.length === 0) {
      throw new Error("Failed to create shipping record")
    }

    const shippingId = newShippingRecords[0].id

    // Process products - use edited data if provided, otherwise process from Excel
    let productPromises: any[] = []
    if (editedProducts && editedProducts.length > 0) {
      // Use edited data from preview table
      productPromises = editedProducts.map((product: any) => {
        const safeFloat = (val: any) => {
          const parsed = parseFloat(val)
          return isNaN(parsed) ? 0 : parsed
        }

        const safeInt = (val: any) => {
          const parsed = parseInt(val)
          return isNaN(parsed) ? 0 : parsed
        }

        // Use itemNo from the preview data, convert to ID
        const itemNoString = String(product.itemNo || '')
        let itemId = parseInt(itemNoString.replace(/\D/g, ''))
        if (isNaN(itemId) || itemId <= 0) {
          itemId = Date.now() + Math.random() * 1000 // Fallback ID
        }

        return db.insert(products).values({
          id: itemId,
          shipping_id: shippingId,
          box_code: product.boxCode || '',
          product_name: product.productName || '',
          storage: product.storage || '',
          original_price: safeFloat(product.originalPrice),
          selling_price: safeFloat(product.sellingPrice),
          weight: 0,
          image: "",
          pice_per_box: safeInt(product.piecesPerBox),
          Total_pices: safeInt(product.quantity),
          total_original_price: safeFloat(product.totalPrice),
          size_of_box: safeFloat(product.boxSize),
          total_box_size: safeFloat(product.totalBoxSize),
          number_of_boxes: safeFloat(product.numberOfBoxes),
          Grope_Item_price: 0,
          currency: "Dollar",
          note: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      })
    } else if (file) {
      // Process from Excel file (legacy behavior)
      const buffer = Buffer.from(await file.arrayBuffer())
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
      const secondColIndex = 1 // B column
      const itemNoColIndex = columnMap['item no'] ?? columnMap['item'] ?? -1
      const ctnColIndex = columnMap['ctn'] ?? -1
      const pcsCtnColIndex = columnMap['pcs/ctn'] ?? columnMap['pcs ct'] ?? -1
      const qtyColIndex = columnMap['qty'] ?? -1
      const priceColIndex = columnMap['price'] ?? -1
      const tPriceColIndex = columnMap['t/price'] ?? columnMap['t price'] ?? -1
      const cbmCntColIndex = columnMap['cbm/cnt'] ?? columnMap['cbm cnt'] ?? -1
      const tCbmColIndex = columnMap['t/cbm'] ?? columnMap['t cbm'] ?? -1

      // Counter for fallback ids
      let fallbackId = Date.now() * 1000

      // Process rows starting from index 1 (skip header)
      productPromises = rawData.slice(1).map((row: string[]) => {
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

          // Convert Item No to number by removing non-digit characters
          const itemNoString = String(row[itemNoColIndex] || '')
          let itemId = parseInt(itemNoString.replace(/\D/g, ''))
          if (isNaN(itemId) || itemId <= 0) {
            itemId = fallbackId++
          }

          return db.insert(products).values({
              id: itemId,
              shipping_id: shippingId,
              box_code: itemId ? String(itemId) : 'No Code',
              product_name: itemId ? `Product ${itemId}` : 'Unknown Product',
              storage: "Default",
              original_price: safeFloat(row[priceColIndex !== -1 ? priceColIndex : 0]),
              selling_price: safeFloat(row[secondColIndex]),
              weight: 0,
              image: "",
              pice_per_box: safeInt(row[pcsCtnColIndex !== -1 ? pcsCtnColIndex : 0]),
              Total_pices: safeInt(row[qtyColIndex !== -1 ? qtyColIndex : 0]),
              total_original_price: safeFloat(row[tPriceColIndex !== -1 ? tPriceColIndex : 0]),
              size_of_box: safeFloat(row[cbmCntColIndex !== -1 ? cbmCntColIndex : 0]),
              total_box_size: safeFloat(row[tCbmColIndex !== -1 ? tCbmColIndex : 0]),
              number_of_boxes: safeFloat(row[ctnColIndex !== -1 ? ctnColIndex : 0]),
              Grope_Item_price: 0,
              currency: "Dollar",
              note: "",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
          })
      }).filter(Boolean)
    }

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
