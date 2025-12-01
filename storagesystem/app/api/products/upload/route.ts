import { NextRequest, NextResponse } from "next/server"
import { products } from "@/lib/schema"
import { db } from "@/lib/db"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import * as XLSX from "xlsx"

export async function POST(req: NextRequest) {
  console.log("Products preview called")
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File
    console.log("File received:", file ? file.name : 'No file')

    if (!file) {
      return NextResponse.json(
        { error: "Missing file" },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Parse Excel
    const workbook = XLSX.read(buffer, { type: "buffer" })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][]

    console.log("Raw data:", rawData)

    // Find column indices by header names
    const headerRow = rawData[0]
    const columnMap: Record<string, number> = {}
    headerRow.forEach((header, index) => {
      columnMap[header.toLowerCase().trim()] = index
    })

    // Get positions (same as upload API)
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

    // Fallback to hard positions if not found
    const itemCol = itemNoColIndex !== -1 ? itemNoColIndex : (columnMap['item no'] ? columnMap['item no'] : 2) || 2 // column D in 0-based
    const priceCol = priceColIndex !== -1 ? priceColIndex : (columnMap['price'] ? columnMap['price'] : 7) || 7 // column H
    const qtyCol = qtyColIndex !== -1 ? qtyColIndex : (columnMap['qty'] ? columnMap['qty'] : 6) || 6 // column G
    const ctnCol = ctnColIndex !== -1 ? ctnColIndex : (columnMap['ctn'] ? columnMap['ctn'] : 4) || 4 // column E
    const pcsCtnCol = pcsCtnColIndex !== -1 ? pcsCtnColIndex : (columnMap['pcs/ctn'] ? columnMap['pcs/ctn'] : 5) || 5 // column F
    const tPriceCol = tPriceColIndex !== -1 ? tPriceColIndex : (columnMap['t/price'] ? columnMap['t/price'] : 8) || 8
    const cbmCntCol = cbmCntColIndex !== -1 ? cbmCntColIndex : (columnMap['cbm/cnt'] ? columnMap['cbm/cnt'] : 9) || 9
    const tCbmCol = tCbmColIndex !== -1 ? tCbmColIndex : (columnMap['t/cbm'] ? columnMap['t/cbm'] : 10) || 10

    // Prepare preview data
    const previewRows = rawData.slice(1).map((row: string[]) => {
        // Skip empty rows - check if item column exists and has value
        const itemValue = row[itemCol] || ''
        if (!itemValue || itemValue.trim() === '') return null

        return {
            itemNo: itemValue,
            boxCode: '', // Empty, user will fill manually
            productName: '', // Empty, user will fill manually
            storage: 'Default', // Default
            originalPrice: row[priceCol] || '',
            sellingPrice: row[secondColIndex] || '', // Same as upload API - column B
            quantity: row[qtyCol] || '',
            piecesPerBox: row[pcsCtnCol] || '',
            boxSize: row[cbmCntCol] || '',
            totalBoxSize: row[tCbmCol] || '',
            numberOfBoxes: row[ctnCol] || '',
            totalPrice: row[tPriceCol] || '',
            gropeItemPrice: row[firstColIndex] || '', // First column
        }
    }).filter(Boolean)

    return NextResponse.json({ success: true, previewRows, headers: headerRow })

  } catch (error) {
    console.error("Preview error:", error)
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    )
  }
}
