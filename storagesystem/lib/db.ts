import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"
import path from "path"
import fs from "fs"
import * as schema from "./schema"
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

let db: ReturnType<typeof drizzle> | null = null

export function initializeDatabase() {
  if (db) return db

  const dbDir = path.join(process.cwd(), "data")
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  const dbPath = path.join(dbDir, "products.db")
  const sqlite = new Database(dbPath)

  // Enable foreign keys and WAL mode
  sqlite.pragma("journal_mode = WAL")
  sqlite.pragma("foreign_keys = ON")

  db = drizzle(sqlite, { schema })

  return db
}

export function getDatabase() {
  if (!db) {
    return initializeDatabase()
  }
  return db
}
const sqlite = new Database("sqlite.db");
export const db = drizzle(sqlite, { schema });
