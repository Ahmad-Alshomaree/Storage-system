import { db } from "@/lib/db"
import { rooms } from "@/lib/schema"

export async function GET() {
  try {
    const allRooms = await db.query.rooms.findMany({
      orderBy: (rooms, { asc }) => asc(rooms.room_name),
    })

    return Response.json(allRooms)
  } catch (error) {
    console.error("Error fetching rooms:", error)
    return Response.json({ error: "Failed to fetch rooms" }, { status: 500 })
  }
}
