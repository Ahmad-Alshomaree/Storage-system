const Database = require("better-sqlite3");
const path = require("path");

// Create data directory if it doesn't exist
const fs = require("fs");
const dbDir = path.join(__dirname, "data");
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Create database
const dbPath = path.join(dbDir, "products.db");
const db = new Database(dbPath);

// Enable foreign keys and WAL mode
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Create tables based on the schema
const tables = [
  `CREATE TABLE IF NOT EXISTS shipping (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    shipping_date TEXT NOT NULL,
    receiving_date TEXT NOT NULL,
    receiver TEXT NOT NULL,
    file_path TEXT,
    paid INTEGER DEFAULT 0,
    ship_price REAL DEFAULT 0,
    created_at TEXT NOT NULL
  )`,

  `CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shipping_id INTEGER REFERENCES shipping(id),
    box_code TEXT NOT NULL,
    product_name TEXT,
    original_price REAL NOT NULL,
    selling_price REAL NOT NULL,
    storage TEXT,
    weight REAL,
    image TEXT,
    pice_per_box INTEGER,
    Total_pices INTEGER DEFAULT 0,
    total_original_price REAL DEFAULT 0,
    size_of_box REAL NOT NULL,
    total_box_size REAL NOT NULL,
    number_of_boxes REAL NOT NULL,
    extracted_pieces INTEGER DEFAULT 0,
    status TEXT DEFAULT 'available',
    Grope_Item_price REAL,
    created_at TEXT,
    updated_at TEXT
  )`,

  `CREATE TABLE IF NOT EXISTS client (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_name TEXT NOT NULL,
    phone_number TEXT,
    shipping_id INTEGER REFERENCES shipping(id),
    history TEXT,
    debt REAL NOT NULL DEFAULT 0,
    total_debts REAL NOT NULL DEFAULT 0
  )`,

  `CREATE TABLE IF NOT EXISTS debits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER REFERENCES client(id),
    shipping_id INTEGER REFERENCES shipping(id),
    amount REAL NOT NULL,
    type TEXT NOT NULL,
    description TEXT,
    transaction_date TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,

  // Create indexes
  `CREATE INDEX IF NOT EXISTS idx_shipping_type ON shipping (type)`,
  `CREATE INDEX IF NOT EXISTS idx_product_name ON products (product_name)`,
  `CREATE INDEX IF NOT EXISTS idx_box_code ON products (box_code)`,
  `CREATE INDEX IF NOT EXISTS idx_shipping_id ON products (shipping_id)`,
  `CREATE INDEX IF NOT EXISTS idx_client_name ON client (client_name)`,
  `CREATE INDEX IF NOT EXISTS idx_client_shipping_id ON client (shipping_id)`,
  `CREATE INDEX IF NOT EXISTS idx_debit_client_id ON debits (client_id)`,
  `CREATE INDEX IF NOT EXISTS idx_debit_shipping_id ON debits (shipping_id)`,
  `CREATE INDEX IF NOT EXISTS idx_debit_type ON debits (type)`
];

try {
  // Execute each CREATE statement
  for (const sql of tables) {
    db.exec(sql);
  }

  console.log("Database created successfully!");
  console.log("Tables created:");
  const result = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  result.forEach(row => console.log(`- ${row.name}`));

} catch (error) {
  console.error("Error creating database:", error);
} finally {
  db.close();
}
