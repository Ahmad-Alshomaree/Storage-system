import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("image") as File

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid image type. Only JPEG, PNG, WebP, and GIF are allowed." },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "Image file too large. Maximum size is 5MB." },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const uploadDir = join(process.cwd(), "public/uploads/images")

    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (e) {
      // Ignore if directory exists
    }

    // Generate unique filename with original extension
    const fileExtension = file.name.split('.').pop() || 'png'
    const filename = `${uuidv4()}.${fileExtension}`
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    const imageUrl = `/uploads/images/${filename}`

    return NextResponse.json({
      success: true,
      imageUrl,
      filename
    })

  } catch (error) {
    console.error("Image upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    )
  }
}
