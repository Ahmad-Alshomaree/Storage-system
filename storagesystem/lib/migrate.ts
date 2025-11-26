import { drizzle } from "drizzle-orm/better-sqlite3"
import { migrate } from "drizzle-orm/better-sqlite3/migrator"
import Database from "better-sqlite3"
import path from "path"
import fs from "fs"

const dbDir = path.join(process.cwd(), "data")
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}
const dbPath = path.join(dbDir, "products.db")
const sqlite = new Database(dbPath)
const db = drizzle(sqlite)

async function runMigrations() {
  try {
    await migrate(db, { migrationsFolder: "drizzle" })
    console.log("Migrations complete!")
    sqlite.close()
  } catch (err: any) {
    console.error("Migrations failed:", err)
    sqlite.close()
    process.exit(1)
  }
}

runMigrations()
