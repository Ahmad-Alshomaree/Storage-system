import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"
import path from "path"
import fs from "fs"
import * as schema from "./schema"

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

  // Create tables using raw SQL for foreign key constraints
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS shipping (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL CHECK(type IN ('input load', 'output load')),
      shipping_date TEXT NOT NULL,
      receiver TEXT NOT NULL,
      created_at TEXT NOT NULL
    )
  `)

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_name TEXT NOT NULL,
      product_type TEXT NOT NULL,
      original_price REAL NOT NULL,
      selling_price REAL NOT NULL,
      storage TEXT NOT NULL,
      quantity INTEGER,
      weight REAL,
      sizes REAL,
      colors TEXT,
      image TEXT,
      box_number REAL NOT NULL,
      price_per_box INTEGER NOT NULL,
      shipping_id INTEGER,
      total_original_price REAL NOT NULL,
      size_of_box_at_ship REAL NOT NULL,
      total_box_size REAL NOT NULL,
      box_code TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (shipping_id) REFERENCES shipping(id) ON DELETE SET NULL
    )
  `)

  // Create indexes
  sqlite.exec(`
    CREATE INDEX IF NOT EXISTS idx_product_name ON products(product_name);
    CREATE INDEX IF NOT EXISTS idx_product_type ON products(product_type);
    CREATE INDEX IF NOT EXISTS idx_box_code ON products(box_code);
    CREATE INDEX IF NOT EXISTS idx_shipping_id ON products(shipping_id);
    CREATE INDEX IF NOT EXISTS idx_shipping_type ON shipping(type);
  `)

  return db
}

export function getDatabase() {
  if (!db) {
    return initializeDatabase()
  }
  return db
}
