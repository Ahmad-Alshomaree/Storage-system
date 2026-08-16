use crate::error::AppError;
use base64::Engine;
use rusqlite::{params, Connection};
use rusqlite_migration::{Migrations, M};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};

// Database models matching the TypeScript schema
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Product {
    pub id: i64,
    pub shipping_id: Option<i64>,
    pub item_no: Option<String>,
    pub box_code: String,
    pub product_name: Option<String>,
    pub cost: f64,
    pub selling_price: f64,
    pub storage: Option<String>,
    pub weight: Option<f64>,
    pub image: Option<String>,
    pub pice_per_box: i64,
    pub total_pices: i64,
    pub total_cost: f64,
    pub size_of_box: f64,
    pub total_box_size: f64,
    pub number_of_boxes: i64,
    pub extracted_pieces: i64,
    pub status: String,
    pub grope_item_price: Option<f64>,
    pub currency: String,
    pub note: Option<String>,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Client {
    pub id: i64,
    pub client_name: String,
    pub phone_number: Option<String>,
    pub shipping_id: Option<i64>,
    pub history: Option<String>,
    pub debt: Option<f64>,
    pub total_debts: Option<f64>,
}

// Separate struct for client creation (without id)
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateClient {
    pub client_name: String,
    pub phone_number: Option<String>,
    pub shipping_id: Option<i64>,
    pub history: Option<String>,
    pub debt: Option<f64>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Shipping {
    pub id: i64,
    pub r#type: String, // "input load" or "output load"
    pub shipping_date: String,
    pub receiving_date: String,
    pub receiver_client_id: i64,
    pub sender_client_id: i64,
    pub file_path: Option<String>,
    pub paid: i64,
    pub ship_price: f64,
    pub currency: String,
    pub note: Option<String>,
    pub created_at: String,
}

// Separate struct for shipping creation (without id and created_at)
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateShipping {
    pub r#type: String, // "input load" or "output load"
    pub shipping_date: String,
    pub receiving_date: String,
    pub receiver_client_id: i64,
    pub sender_client_id: i64,
    pub file_path: Option<String>,
    pub paid: i64,
    pub ship_price: f64,
    pub currency: String,
    pub note: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct ShippingItem {
    pub id: i64,
    pub shipping_id: i64,
    pub product_id: i64,
    pub product_name: Option<String>,
    pub box_code: Option<String>,
    pub quantity: f64,
    pub quantity_type: String,
    pub unit_price: f64,
    pub total_price: f64,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateShippingItem {
    pub product_id: i64,
    pub quantity: f64,
    pub quantity_type: String,
    pub unit_price: f64,
}

// Simplified Debit struct for database operations
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Debit {
    pub id: i64,
    pub sender_id: Option<i64>,
    pub receiver_id: i64, // Required in schema
    pub shipping_id: Option<i64>,
    pub amount: f64,
    pub currency: String,
    pub note: Option<String>,
    pub transaction_date: Option<String>,
    pub total_debit: Option<f64>,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Room {
    pub id: i64,
    pub room_name: String,
}

// Struct used when inserting a new room (id assigned by database)
#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CreateRoom {
    pub room_name: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct StoreProduct {
    pub id: i64,
    pub product_id: i64,
    pub product_name: String,
    pub individual_item_selling_price: f64,
    pub image: Option<String>,
    pub group_item_price: Option<f64>,
    pub number_of_items: i64,
    pub entered_at: String,
}

pub struct Database {
    pub(crate) conn: Connection,
}

pub fn get_migrations() -> Migrations<'static> {
    Migrations::new(vec![
        M::up(
            r#"
            -- V1: Core Tables
            CREATE TABLE IF NOT EXISTS client (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_name TEXT NOT NULL,
                phone_number TEXT,
                shipping_id INTEGER,
                history TEXT,
                debt REAL DEFAULT 0.0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS shipping (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL,
                shipping_date TEXT NOT NULL,
                receiving_date TEXT NOT NULL,
                receiver_client_id INTEGER NOT NULL REFERENCES client(id),
                sender_client_id INTEGER NOT NULL REFERENCES client(id),
                file_path TEXT,
                paid INTEGER DEFAULT 0,
                ship_price REAL DEFAULT 0.0,
                currency TEXT DEFAULT 'Dollar',
                note TEXT,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                shipping_id INTEGER REFERENCES shipping(id),
                item_no TEXT,
                box_code TEXT NOT NULL UNIQUE,
                product_name TEXT,
                cost REAL NOT NULL DEFAULT 0.0,
                selling_price REAL NOT NULL DEFAULT 0.0,
                storage TEXT,
                weight REAL,
                image TEXT,
                pice_per_box INTEGER DEFAULT 1,
                total_pices INTEGER DEFAULT 0,
                total_cost REAL DEFAULT 0.0,
                size_of_box REAL NOT NULL DEFAULT 0.0,
                total_box_size REAL NOT NULL DEFAULT 0.0,
                number_of_boxes INTEGER NOT NULL DEFAULT 1,
                extracted_pieces INTEGER DEFAULT 0,
                status TEXT DEFAULT 'available',
                grope_item_price REAL,
                currency TEXT NOT NULL DEFAULT 'Dollar',
                note TEXT,
                created_at TEXT,
                updated_at TEXT
            );

            CREATE TABLE IF NOT EXISTS debits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender_id INTEGER REFERENCES client(id),
                receiver_id INTEGER NOT NULL REFERENCES client(id),
                shipping_id INTEGER REFERENCES shipping(id),
                amount REAL NOT NULL,
                currency TEXT DEFAULT 'Dollar',
                note TEXT,
                transaction_date TEXT,
                total_debit REAL,
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS rooms (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                room_name TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS store_products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL REFERENCES products(id),
                product_name TEXT NOT NULL,
                individual_item_selling_price REAL NOT NULL,
                image TEXT,
                group_item_price REAL,
                number_of_items INTEGER NOT NULL,
                entered_at TEXT NOT NULL DEFAULT (datetime('now'))
            );
            "#
        ),
        M::up(
            r#"
            -- V2: Performance Indexes
            CREATE INDEX IF NOT EXISTS idx_shipping_type ON shipping(type);
            CREATE INDEX IF NOT EXISTS idx_product_name ON products(product_name);
            CREATE INDEX IF NOT EXISTS idx_box_code ON products(box_code);
            CREATE INDEX IF NOT EXISTS idx_shipping_id ON products(shipping_id);
            CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
            CREATE INDEX IF NOT EXISTS idx_client_name ON client(client_name);
            CREATE INDEX IF NOT EXISTS idx_client_shipping_id ON client(shipping_id);
            CREATE INDEX IF NOT EXISTS idx_debit_sender_id ON debits(sender_id);
            CREATE INDEX IF NOT EXISTS idx_debit_receiver_id ON debits(receiver_id);
            CREATE INDEX IF NOT EXISTS idx_debit_shipping_id ON debits(shipping_id);
            CREATE INDEX IF NOT EXISTS idx_room_name ON rooms(room_name);
            CREATE INDEX IF NOT EXISTS idx_store_product_id ON store_products(product_id);
            "#
        ),
        M::up(
            r#"
            -- V3: Shipping Items table for Output Load tracking
            CREATE TABLE IF NOT EXISTS shipping_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                shipping_id INTEGER NOT NULL REFERENCES shipping(id) ON DELETE CASCADE,
                product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
                quantity REAL NOT NULL,
                quantity_type TEXT NOT NULL DEFAULT 'pieces',
                unit_price REAL NOT NULL DEFAULT 0.0,
                total_price REAL NOT NULL DEFAULT 0.0,
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            );
            CREATE INDEX IF NOT EXISTS idx_shipping_items_ship ON shipping_items(shipping_id);
            CREATE INDEX IF NOT EXISTS idx_shipping_items_prod ON shipping_items(product_id);
            "#
        ),
        M::up(
            r#"
            -- V4: Financial Accounting View for Dynamic Client Balances
            CREATE VIEW IF NOT EXISTS v_client_balances AS
            SELECT 
                c.id AS client_id,
                c.client_name,
                c.phone_number,
                c.shipping_id,
                c.history,
                COALESCE((
                    SELECT SUM(d.amount) FROM debits d WHERE d.receiver_id = c.id
                ), 0.0) - 
                COALESCE((
                    SELECT SUM(d.amount) FROM debits d WHERE d.sender_id = c.id
                ), 0.0) AS calculated_balance
            FROM client c;
            "#
        ),
    ])
}

pub fn migrate_base64_images(conn: &mut Connection, app_dir: &std::path::Path) -> Result<usize, AppError> {
    let images_dir = app_dir.join("product_images");
    std::fs::create_dir_all(&images_dir)?;

    let mut migrated_count = 0;

    // 1. Migrate products table
    let mut stmt = conn.prepare("SELECT id, image FROM products WHERE image LIKE 'data:image/%'")?;
    let rows: Vec<(i64, String)> = stmt
        .query_map([], |row| Ok((row.get(0)?, row.get(1)?)))?
        .filter_map(Result::ok)
        .collect();

    for (id, data_url) in rows {
        if let Some((header, base64_str)) = data_url.split_once(";base64,") {
            let ext = if header.contains("png") {
                "png"
            } else if header.contains("webp") {
                "webp"
            } else if header.contains("gif") {
                "gif"
            } else if header.contains("svg") {
                "svg"
            } else {
                "jpg"
            };

            let clean_base64 = base64_str.trim().replace('\r', "").replace('\n', "");
            if let Ok(bytes) = base64::engine::general_purpose::STANDARD.decode(&clean_base64) {
                let file_name = format!("img_{}.{}", uuid::Uuid::new_v4(), ext);
                let target_path = images_dir.join(&file_name);
                if std::fs::write(&target_path, bytes).is_ok() {
                    let rel_path = format!("product_images/{}", file_name);
                    conn.execute("UPDATE products SET image = ?1 WHERE id = ?2", params![rel_path, id])?;
                    migrated_count += 1;
                }
            }
        }
    }

    // 2. Migrate store_products table (if any)
    let mut stmt_store = conn.prepare("SELECT id, image FROM store_products WHERE image LIKE 'data:image/%'")?;
    let rows_store: Vec<(i64, String)> = stmt_store
        .query_map([], |row| Ok((row.get(0)?, row.get(1)?)))?
        .filter_map(Result::ok)
        .collect();

    for (id, data_url) in rows_store {
        if let Some((header, base64_str)) = data_url.split_once(";base64,") {
            let ext = if header.contains("png") {
                "png"
            } else if header.contains("webp") {
                "webp"
            } else if header.contains("gif") {
                "gif"
            } else if header.contains("svg") {
                "svg"
            } else {
                "jpg"
            };

            let clean_base64 = base64_str.trim().replace('\r', "").replace('\n', "");
            if let Ok(bytes) = base64::engine::general_purpose::STANDARD.decode(&clean_base64) {
                let file_name = format!("img_{}.{}", uuid::Uuid::new_v4(), ext);
                let target_path = images_dir.join(&file_name);
                if std::fs::write(&target_path, bytes).is_ok() {
                    let rel_path = format!("product_images/{}", file_name);
                    conn.execute("UPDATE store_products SET image = ?1 WHERE id = ?2", params![rel_path, id])?;
                    migrated_count += 1;
                }
            }
        }
    }

    if migrated_count > 0 {
        log::info!("Migrated {} legacy base64 images to disk storage in {:?}", migrated_count, images_dir);
    }

    Ok(migrated_count)
}

impl Database {
    // Initialize database with custom path or app data directory
    #[allow(dead_code)]
    pub fn new(app_handle: &AppHandle) -> Result<Self, AppError> {
        Self::new_with_path(app_handle, None)
    }

    // Initialize database with custom path
    pub fn new_with_path(app_handle: &AppHandle, custom_path: Option<&str>) -> Result<Self, AppError> {
        let db_dir = if let Some(path) = custom_path {
            std::path::PathBuf::from(path)
        } else {
            app_handle
                .path()
                .app_data_dir()
                .map_err(|e| AppError::Validation(e.to_string()))?
        };

        std::fs::create_dir_all(&db_dir)?;

        let db_path = db_dir.join("storagesystem.db");
        let mut conn = Connection::open(&db_path)?;

        // Enforce robust Pragmas
        conn.pragma_update(None, "foreign_keys", "ON")?;
        conn.pragma_update(None, "journal_mode", "WAL")?;
        conn.pragma_update(None, "synchronous", "NORMAL")?;
        conn.pragma_update(None, "busy_timeout", 5000)?;

        // Apply versioned schema migrations
        let migrations = get_migrations();
        migrations.to_latest(&mut conn)?;

        // Migrate any legacy base64 image strings to physical disk files
        if let Err(e) = migrate_base64_images(&mut conn, &db_dir) {
            log::warn!("Failed to migrate legacy base64 images: {}", e);
        }

        Ok(Database { conn })
    }

    // Product operations
    pub fn get_products(&self) -> Result<Vec<Product>, AppError> {
        let mut stmt = self.conn.prepare(
            "SELECT id, shipping_id, item_no, box_code, product_name, cost, selling_price,
                    storage, weight, image, pice_per_box, total_pices, total_cost,
                    size_of_box, total_box_size, number_of_boxes, extracted_pieces,
                    status, grope_item_price, currency, note, created_at, updated_at
             FROM products ORDER BY created_at DESC"
        )?;

        let products = stmt.query_map([], |row| {
            Ok(Product {
                id: row.get(0)?,
                shipping_id: row.get(1)?,
                item_no: row.get(2)?,
                box_code: row.get(3)?,
                product_name: row.get(4)?,
                cost: row.get(5)?,
                selling_price: row.get(6)?,
                storage: row.get(7)?,
                weight: row.get(8)?,
                image: row.get(9)?,
                pice_per_box: row.get(10)?,
                total_pices: row.get(11)?,
                total_cost: row.get(12)?,
                size_of_box: row.get(13)?,
                total_box_size: row.get(14)?,
                number_of_boxes: row.get(15)?,
                extracted_pieces: row.get(16)?,
                status: row.get(17)?,
                grope_item_price: row.get(18)?,
                currency: row.get(19)?,
                note: row.get(20)?,
                created_at: row.get(21)?,
                updated_at: row.get(22)?,
            })
        })?;

        let mut list = Vec::new();
        for p in products {
            list.push(p?);
        }
        Ok(list)
    }

    pub fn get_product_by_id(&self, id: i64) -> Result<Product, AppError> {
        let mut stmt = self.conn.prepare(
            "SELECT id, shipping_id, item_no, box_code, product_name, cost, selling_price,
                    storage, weight, image, pice_per_box, total_pices, total_cost,
                    size_of_box, total_box_size, number_of_boxes, extracted_pieces,
                    status, grope_item_price, currency, note, created_at, updated_at
             FROM products WHERE id = ?"
        )?;

        stmt.query_row([id], |row| {
            Ok(Product {
                id: row.get(0)?,
                shipping_id: row.get(1)?,
                item_no: row.get(2)?,
                box_code: row.get(3)?,
                product_name: row.get(4)?,
                cost: row.get(5)?,
                selling_price: row.get(6)?,
                storage: row.get(7)?,
                weight: row.get(8)?,
                image: row.get(9)?,
                pice_per_box: row.get(10)?,
                total_pices: row.get(11)?,
                total_cost: row.get(12)?,
                size_of_box: row.get(13)?,
                total_box_size: row.get(14)?,
                number_of_boxes: row.get(15)?,
                extracted_pieces: row.get(16)?,
                status: row.get(17)?,
                grope_item_price: row.get(18)?,
                currency: row.get(19)?,
                note: row.get(20)?,
                created_at: row.get(21)?,
                updated_at: row.get(22)?,
            })
        }).map_err(AppError::from)
    }

    pub fn create_product(&mut self, product: &Product) -> Result<Product, AppError> {
        let tx = self.conn.transaction()?;

        tx.execute(
            "INSERT INTO products (shipping_id, item_no, box_code, product_name, cost, selling_price,
                                 storage, weight, image, pice_per_box, total_pices, total_cost,
                                 size_of_box, total_box_size, number_of_boxes, extracted_pieces,
                                 status, grope_item_price, currency, note, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            params![
                product.shipping_id,
                product.item_no,
                product.box_code,
                product.product_name,
                product.cost,
                product.selling_price,
                product.storage,
                product.weight,
                product.image,
                product.pice_per_box,
                product.total_pices,
                product.total_cost,
                product.size_of_box,
                product.total_box_size,
                product.number_of_boxes,
                product.extracted_pieces,
                product.status,
                product.grope_item_price,
                product.currency,
                product.note,
                product.created_at,
                product.updated_at,
            ],
        )?;

        let id = tx.last_insert_rowid();
        tx.commit()?;

        self.get_product_by_id(id)
    }

    pub fn update_product(&mut self, id: i64, product: &Product) -> Result<Product, AppError> {
        let tx = self.conn.transaction()?;

        let updated_at = chrono::Utc::now().to_rfc3339();
        tx.execute(
            "UPDATE products SET shipping_id=?, item_no=?, box_code=?, product_name=?, cost=?,
             selling_price=?, storage=?, weight=?, image=?, pice_per_box=?, total_pices=?,
             total_cost=?, size_of_box=?, total_box_size=?, number_of_boxes=?, extracted_pieces=?,
             status=?, grope_item_price=?, currency=?, note=?, updated_at=?
             WHERE id=?",
            params![
                product.shipping_id,
                product.item_no,
                product.box_code,
                product.product_name,
                product.cost,
                product.selling_price,
                product.storage,
                product.weight,
                product.image,
                product.pice_per_box,
                product.total_pices,
                product.total_cost,
                product.size_of_box,
                product.total_box_size,
                product.number_of_boxes,
                product.extracted_pieces,
                product.status,
                product.grope_item_price,
                product.currency,
                product.note,
                updated_at,
                id,
            ],
        )?;

        tx.commit()?;
        self.get_product_by_id(id)
    }

    // Client operations
    pub fn get_clients(&self) -> Result<Vec<Client>, AppError> {
        let mut stmt = self.conn.prepare(
            "SELECT client_id, client_name, phone_number, shipping_id, history, calculated_balance
             FROM v_client_balances
             ORDER BY client_id DESC"
        )?;

        let clients = stmt.query_map([], |row| {
            let total_debt = row.get::<_, f64>(5)?;
            Ok(Client {
                id: row.get(0)?,
                client_name: row.get(1)?,
                phone_number: row.get(2)?,
                shipping_id: row.get(3)?,
                history: row.get(4)?,
                debt: Some(total_debt),
                total_debts: Some(total_debt),
            })
        })?;

        let mut list = Vec::new();
        for c in clients {
            list.push(c?);
        }
        Ok(list)
    }

    pub fn get_client_by_id(&self, id: i64) -> Result<Client, AppError> {
        let mut stmt = self.conn.prepare(
            "SELECT client_id, client_name, phone_number, shipping_id, history, calculated_balance
             FROM v_client_balances
             WHERE client_id = ?"
        )?;

        stmt.query_row([id], |row| {
            let total_debt = row.get::<_, f64>(5)?;
            Ok(Client {
                id: row.get(0)?,
                client_name: row.get(1)?,
                phone_number: row.get(2)?,
                shipping_id: row.get(3)?,
                history: row.get(4)?,
                debt: Some(total_debt),
                total_debts: Some(total_debt),
            })
        }).map_err(AppError::from)
    }

    pub fn create_client(&mut self, client: &Client) -> Result<Client, AppError> {
        let tx = self.conn.transaction()?;

        tx.execute(
            "INSERT INTO client (client_name, phone_number, shipping_id, history)
             VALUES (?, ?, ?, ?)",
            params![
                client.client_name,
                client.phone_number,
                client.shipping_id,
                client.history,
            ],
        )?;

        let client_id = tx.last_insert_rowid();

        // Atomically insert debit record if opening debt exists
        if let Some(debt_amount) = client.debt {
            if debt_amount > 0.0 {
                let now = chrono::Utc::now().to_rfc3339();
                tx.execute(
                    "INSERT INTO debits (sender_id, receiver_id, shipping_id, amount, currency, note, transaction_date, created_at)
                     VALUES (NULL, ?, ?, ?, 'Dollar', ?, ?, ?)",
                    params![
                        client_id,
                        client.shipping_id,
                        debt_amount,
                        format!("Initial debt for client {}", client.client_name),
                        now,
                        now,
                    ],
                )?;
            }
        }

        tx.commit()?;
        self.get_client_by_id(client_id)
    }

    pub fn update_client(&mut self, id: i64, updates: &serde_json::Value) -> Result<Client, AppError> {
        let existing = self.get_client_by_id(id)?;

        let client_name = updates.get("client_name").and_then(|v| v.as_str())
            .unwrap_or(&existing.client_name).to_string();
        let phone_number: Option<String> = updates.get("phone_number").and_then(|v| v.as_str())
            .map(|s| s.to_string()).or(existing.phone_number);
        let shipping_id: Option<i64> = updates.get("shipping_id").and_then(|v| v.as_i64())
            .or(existing.shipping_id);
        let history: Option<String> = updates.get("history").and_then(|v| v.as_str())
            .map(|s| s.to_string()).or(existing.history);

        self.conn.execute(
            "UPDATE client SET client_name=?, phone_number=?, shipping_id=?, history=? WHERE id=?",
            params![client_name, phone_number, shipping_id, history, id],
        )?;

        self.get_client_by_id(id)
    }

    // Shipping operations
    pub fn get_shipping_items(&self, shipping_id: i64) -> Result<Vec<ShippingItem>, AppError> {
        let mut stmt = self.conn.prepare(
            "SELECT si.id, si.shipping_id, si.product_id, p.product_name, p.box_code,
                    si.quantity, si.quantity_type, si.unit_price, si.total_price, si.created_at
             FROM shipping_items si
             LEFT JOIN products p ON si.product_id = p.id
             WHERE si.shipping_id = ?
             ORDER BY si.id ASC"
        )?;

        let items = stmt.query_map([shipping_id], |row| {
            Ok(ShippingItem {
                id: row.get(0)?,
                shipping_id: row.get(1)?,
                product_id: row.get(2)?,
                product_name: row.get(3)?,
                box_code: row.get(4)?,
                quantity: row.get(5)?,
                quantity_type: row.get(6)?,
                unit_price: row.get(7)?,
                total_price: row.get(8)?,
                created_at: row.get(9)?,
            })
        })?;

        let mut result = Vec::new();
        for item in items {
            result.push(item?);
        }
        Ok(result)
    }

    pub fn get_shipping(&self) -> Result<Vec<serde_json::Value>, AppError> {
        let mut stmt = self.conn.prepare(
            "SELECT s.id, s.type, s.shipping_date, s.receiving_date, s.receiver_client_id,
                    s.sender_client_id, s.file_path, s.paid, s.ship_price, s.currency, s.note, s.created_at,
                    receiver.client_name as receiver_name, receiver.phone_number as receiver_phone,
                    sender.client_name as sender_name, sender.phone_number as sender_phone
             FROM shipping s
             LEFT JOIN client receiver ON s.receiver_client_id = receiver.id
             LEFT JOIN client sender ON s.sender_client_id = sender.id
             ORDER BY s.created_at DESC"
        )?;

        let shipping = stmt.query_map([], |row| {
            let receiver = serde_json::json!({
                "id": row.get::<_, i64>(4)?,
                "client_name": row.get::<_, String>(12)?,
                "phone_number": row.get::<_, Option<String>>(13)?
            });

            let sender = serde_json::json!({
                "id": row.get::<_, i64>(5)?,
                "client_name": row.get::<_, String>(14)?,
                "phone_number": row.get::<_, Option<String>>(15)?
            });

            Ok(serde_json::json!({
                "id": row.get::<_, i64>(0)?,
                "type": row.get::<_, String>(1)?,
                "shipping_date": row.get::<_, String>(2)?,
                "receiving_date": row.get::<_, String>(3)?,
                "receiver_client_id": row.get::<_, i64>(4)?,
                "sender_client_id": row.get::<_, i64>(5)?,
                "receiver": receiver,
                "sender": sender,
                "file_path": row.get::<_, Option<String>>(6)?,
                "paid": row.get::<_, i64>(7)?,
                "ship_price": row.get::<_, f64>(8)?,
                "currency": row.get::<_, String>(9)?,
                "note": row.get::<_, Option<String>>(10)?,
                "created_at": row.get::<_, String>(11)?
            }))
        })?;

        let mut list = Vec::new();
        for s in shipping {
            let mut val = s?;
            let shipping_id = val.get("id").and_then(|v| v.as_i64()).unwrap_or(0);
            if shipping_id > 0 {
                let items = self.get_shipping_items(shipping_id).unwrap_or_default();
                val["items"] = serde_json::to_value(&items).unwrap_or_default();

                let mut prod_stmt = self.conn.prepare(
                    "SELECT id, shipping_id, item_no, box_code, product_name, cost, selling_price,
                            storage, weight, image, pice_per_box, total_pices, total_cost,
                            size_of_box, total_box_size, number_of_boxes, extracted_pieces,
                            status, grope_item_price, currency, note, created_at, updated_at
                     FROM products WHERE shipping_id = ?"
                )?;
                let prods = prod_stmt.query_map([shipping_id], |row| {
                    Ok(Product {
                        id: row.get(0)?,
                        shipping_id: row.get(1)?,
                        item_no: row.get(2)?,
                        box_code: row.get(3)?,
                        product_name: row.get(4)?,
                        cost: row.get(5)?,
                        selling_price: row.get(6)?,
                        storage: row.get(7)?,
                        weight: row.get(8)?,
                        image: row.get(9)?,
                        pice_per_box: row.get(10)?,
                        total_pices: row.get(11)?,
                        total_cost: row.get(12)?,
                        size_of_box: row.get(13)?,
                        total_box_size: row.get(14)?,
                        number_of_boxes: row.get(15)?,
                        extracted_pieces: row.get(16)?,
                        status: row.get(17)?,
                        grope_item_price: row.get(18)?,
                        currency: row.get(19)?,
                        note: row.get(20)?,
                        created_at: row.get(21)?,
                        updated_at: row.get(22)?,
                    })
                })?;
                let mut prod_list = Vec::new();
                for p in prods {
                    if let Ok(p_ok) = p {
                        prod_list.push(p_ok);
                    }
                }
                val["products"] = serde_json::to_value(&prod_list).unwrap_or_default();
            }
            list.push(val);
        }
        Ok(list)
    }

    pub fn get_shipping_by_id(&self, id: i64) -> Result<Shipping, AppError> {
        let mut stmt = self.conn.prepare(
            "SELECT id, type, shipping_date, receiving_date, receiver_client_id,
                    sender_client_id, file_path, paid, ship_price, currency, note, created_at
             FROM shipping WHERE id = ?"
        )?;

        stmt.query_row([id], |row| {
            Ok(Shipping {
                id: row.get(0)?,
                r#type: row.get(1)?,
                shipping_date: row.get(2)?,
                receiving_date: row.get(3)?,
                receiver_client_id: row.get(4)?,
                sender_client_id: row.get(5)?,
                file_path: row.get(6)?,
                paid: row.get(7)?,
                ship_price: row.get(8)?,
                currency: row.get(9)?,
                note: row.get(10)?,
                created_at: row.get(11)?,
            })
        }).map_err(AppError::from)
    }

    pub fn create_shipping(&mut self, shipping: &Shipping) -> Result<Shipping, AppError> {
        let tx = self.conn.transaction()?;

        let created_at = chrono::Utc::now().to_rfc3339();
        tx.execute(
            "INSERT INTO shipping (type, shipping_date, receiving_date, receiver_client_id,
                                 sender_client_id, file_path, paid, ship_price, currency, note, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            params![
                shipping.r#type,
                shipping.shipping_date,
                shipping.receiving_date,
                shipping.receiver_client_id,
                shipping.sender_client_id,
                shipping.file_path,
                shipping.paid,
                shipping.ship_price,
                shipping.currency,
                shipping.note,
                created_at,
            ],
        )?;

        let shipping_id = tx.last_insert_rowid();

        // Atomically create debit record for unpaid shipping balance
        let remaining_amount = shipping.ship_price - shipping.paid as f64;
        if remaining_amount > 0.0 {
            let now = chrono::Utc::now().to_rfc3339();
            tx.execute(
                "INSERT INTO debits (sender_id, receiver_id, shipping_id, amount, currency, note, transaction_date, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                params![
                    Some(shipping.receiver_client_id),
                    shipping.sender_client_id,
                    Some(shipping_id),
                    remaining_amount,
                    shipping.currency,
                    format!("Remaining shipping cost for shipping #{} (total: {}, paid: {})", shipping_id, shipping.ship_price, shipping.paid),
                    now,
                    now,
                ],
            )?;
        }

        tx.commit()?;
        self.get_shipping_by_id(shipping_id)
    }

    pub fn create_shipping_with_items(
        &mut self,
        shipping: &Shipping,
        items: &[CreateShippingItem],
    ) -> Result<Shipping, AppError> {
        let tx = self.conn.transaction()?;

        let created_at = chrono::Utc::now().to_rfc3339();
        tx.execute(
            "INSERT INTO shipping (type, shipping_date, receiving_date, receiver_client_id,
                                 sender_client_id, file_path, paid, ship_price, currency, note, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            params![
                shipping.r#type,
                shipping.shipping_date,
                shipping.receiving_date,
                shipping.receiver_client_id,
                shipping.sender_client_id,
                shipping.file_path,
                shipping.paid,
                shipping.ship_price,
                shipping.currency,
                shipping.note,
                created_at,
            ],
        )?;

        let shipping_id = tx.last_insert_rowid();

        // Insert line items & deduct stock if output load
        for item in items {
            let total_price = item.quantity * item.unit_price;
            let item_now = chrono::Utc::now().to_rfc3339();

            tx.execute(
                "INSERT INTO shipping_items (shipping_id, product_id, quantity, quantity_type, unit_price, total_price, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?)",
                params![
                    shipping_id,
                    item.product_id,
                    item.quantity,
                    item.quantity_type,
                    item.unit_price,
                    total_price,
                    item_now,
                ],
            )?;

            // If output load, deduct stock
            if shipping.r#type == "output load" {
                let qty_pieces = if item.quantity_type == "pieces" {
                    item.quantity.round() as i64
                } else if item.quantity_type == "boxes" {
                    let piece_per_box: i64 = tx.query_row(
                        "SELECT pice_per_box FROM products WHERE id = ?",
                        [item.product_id],
                        |r| r.get(0),
                    ).unwrap_or(1);
                    (item.quantity * piece_per_box as f64).round() as i64
                } else {
                    item.quantity.ceil() as i64
                };

                tx.execute(
                    "UPDATE products
                     SET extracted_pieces = extracted_pieces + ?1,
                         status = CASE
                             WHEN (total_pices - (extracted_pieces + ?1)) <= 0 THEN 'depleted'
                             ELSE status
                         END,
                         updated_at = CURRENT_TIMESTAMP
                     WHERE id = ?2",
                    params![qty_pieces, item.product_id],
                )?;
            }
        }

        // Atomically create debit record for unpaid shipping balance
        let remaining_amount = shipping.ship_price - shipping.paid as f64;
        if remaining_amount > 0.0 {
            let now = chrono::Utc::now().to_rfc3339();
            tx.execute(
                "INSERT INTO debits (sender_id, receiver_id, shipping_id, amount, currency, note, transaction_date, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                params![
                    Some(shipping.receiver_client_id),
                    shipping.sender_client_id,
                    Some(shipping_id),
                    remaining_amount,
                    shipping.currency,
                    format!("Remaining shipping cost for shipping #{} (total: {}, paid: {})", shipping_id, shipping.ship_price, shipping.paid),
                    now,
                    now,
                ],
            )?;
        }

        tx.commit()?;
        self.get_shipping_by_id(shipping_id)
    }

    pub fn create_shipping_with_products(
        &mut self,
        shipping: &Shipping,
        products: &[serde_json::Value],
    ) -> Result<Shipping, AppError> {
        let tx = self.conn.transaction()?;

        let created_at = chrono::Utc::now().to_rfc3339();
        tx.execute(
            "INSERT INTO shipping (type, shipping_date, receiving_date, receiver_client_id,
                                 sender_client_id, file_path, paid, ship_price, currency, note, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            params![
                shipping.r#type,
                shipping.shipping_date,
                shipping.receiving_date,
                shipping.receiver_client_id,
                shipping.sender_client_id,
                shipping.file_path,
                shipping.paid,
                shipping.ship_price,
                shipping.currency,
                shipping.note,
                created_at,
            ],
        )?;

        let shipping_id = tx.last_insert_rowid();

        // Insert batch products
        let now = chrono::Utc::now().to_rfc3339();
        for p in products {
            let box_code = p.get("box_code").and_then(|v| v.as_str())
                .ok_or_else(|| AppError::Validation("Missing box_code".to_string()))?.trim();
            if box_code.is_empty() {
                return Err(AppError::Validation("box_code cannot be empty".to_string()));
            }

            let product_name = p.get("product_name").and_then(|v| v.as_str()).map(|s| s.trim().to_string());
            let item_no = p.get("item_no").and_then(|v| v.as_str()).map(|s| s.trim().to_string());
            let cost = p.get("cost").and_then(|v| v.as_f64()).unwrap_or_else(|| p.get("original_price").and_then(|v| v.as_f64()).unwrap_or(0.0));
            let selling_price = p.get("selling_price").and_then(|v| v.as_f64()).unwrap_or(0.0);
            let storage = p.get("storage").and_then(|v| v.as_str()).map(|s| s.trim().to_string());
            let weight = p.get("weight").and_then(|v| v.as_f64());
            let image = p.get("image").and_then(|v| v.as_str()).map(|s| s.to_string());
            let piece_per_box = p.get("piece_per_box").and_then(|v| v.as_i64())
                .unwrap_or_else(|| p.get("pice_per_box").and_then(|v| v.as_i64()).unwrap_or(1));
            let size_of_box = p.get("size_of_box").and_then(|v| v.as_f64()).unwrap_or(0.0);
            let number_of_boxes = p.get("number_of_boxes").and_then(|v| v.as_i64()).unwrap_or(1);
            let total_pieces = p.get("total_pieces").and_then(|v| v.as_i64())
                .unwrap_or_else(|| p.get("total_pices").and_then(|v| v.as_i64())
                .unwrap_or_else(|| p.get("Total_pices").and_then(|v| v.as_i64())
                .unwrap_or(number_of_boxes * piece_per_box)));
            let total_cost = p.get("total_cost").and_then(|v| v.as_f64())
                .unwrap_or_else(|| p.get("total_original_price").and_then(|v| v.as_f64())
                .unwrap_or(cost * total_pieces as f64));
            let total_box_size = p.get("total_box_size").and_then(|v| v.as_f64()).unwrap_or(size_of_box * number_of_boxes as f64);
            let currency = p.get("currency").and_then(|v| v.as_str()).unwrap_or("Dollar");
            let note = p.get("note").and_then(|v| v.as_str()).map(|s| s.to_string());
            let group_item_price = p.get("group_item_price").and_then(|v| v.as_f64())
                .or_else(|| p.get("grope_item_price").and_then(|v| v.as_f64()));

            tx.execute(
                "INSERT INTO products (shipping_id, item_no, box_code, product_name,
                                     cost, selling_price, storage, weight, image, pice_per_box,
                                     total_pices, total_cost, size_of_box, total_box_size,
                                     number_of_boxes, extracted_pieces, status, grope_item_price,
                                     currency, note, created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'available', ?, ?, ?, ?, ?)",
                params![
                    Some(shipping_id),
                    item_no,
                    box_code,
                    product_name,
                    cost,
                    selling_price,
                    storage,
                    weight,
                    image,
                    piece_per_box,
                    total_pieces,
                    total_cost,
                    size_of_box,
                    total_box_size,
                    number_of_boxes,
                    group_item_price,
                    currency,
                    note,
                    now,
                    now,
                ],
            )?;
        }

        // Atomically create debit record for unpaid shipping balance
        let remaining_amount = shipping.ship_price - shipping.paid as f64;
        if remaining_amount > 0.0 {
            let now = chrono::Utc::now().to_rfc3339();
            tx.execute(
                "INSERT INTO debits (sender_id, receiver_id, shipping_id, amount, currency, note, transaction_date, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                params![
                    Some(shipping.receiver_client_id),
                    shipping.sender_client_id,
                    Some(shipping_id),
                    remaining_amount,
                    shipping.currency,
                    format!("Remaining shipping cost for shipping #{} (total: {}, paid: {})", shipping_id, shipping.ship_price, shipping.paid),
                    now,
                    now,
                ],
            )?;
        }

        tx.commit()?;
        self.get_shipping_by_id(shipping_id)
    }

    pub fn update_shipping(&mut self, id: i64, updates: &serde_json::Value) -> Result<Shipping, AppError> {
        let existing = self.get_shipping_by_id(id)?;

        let r#type = updates.get("type").and_then(|v| v.as_str()).unwrap_or(&existing.r#type).to_string();
        let shipping_date = updates.get("shipping_date").and_then(|v| v.as_str()).unwrap_or(&existing.shipping_date).to_string();
        let receiving_date = updates.get("receiving_date").and_then(|v| v.as_str()).unwrap_or(&existing.receiving_date).to_string();
        let receiver_client_id = updates.get("receiver_client_id").and_then(|v| v.as_i64()).unwrap_or(existing.receiver_client_id);
        let sender_client_id = updates.get("sender_client_id").and_then(|v| v.as_i64()).unwrap_or(existing.sender_client_id);
        let paid = updates.get("paid").and_then(|v| v.as_i64()).unwrap_or(existing.paid);
        let ship_price = updates.get("ship_price").and_then(|v| v.as_f64()).unwrap_or(existing.ship_price);
        let currency = updates.get("currency").and_then(|v| v.as_str()).unwrap_or(&existing.currency).to_string();
        let note: Option<String> = updates.get("note").and_then(|v| v.as_str()).map(|s| s.to_string()).or(existing.note);
        let file_path: Option<String> = existing.file_path;

        self.conn.execute(
            "UPDATE shipping SET type=?, shipping_date=?, receiving_date=?, receiver_client_id=?,
             sender_client_id=?, file_path=?, paid=?, ship_price=?, currency=?, note=? WHERE id=?",
            params![r#type, shipping_date, receiving_date, receiver_client_id, sender_client_id,
                    file_path, paid, ship_price, currency, note, id],
        )?;

        self.get_shipping_by_id(id)
    }

    // Debit operations
    pub fn get_debits(&self) -> Result<Vec<serde_json::Value>, AppError> {
        let mut stmt = self.conn.prepare(
            "SELECT d.id, d.sender_id, d.receiver_id, d.shipping_id, d.amount, d.currency,
                    d.note, d.transaction_date, d.total_debit, d.created_at,
                    sender.client_name as sender_name, sender.phone_number as sender_phone,
                    receiver.client_name as receiver_name, receiver.phone_number as receiver_phone
             FROM debits d
             LEFT JOIN client sender ON d.sender_id = sender.id
             LEFT JOIN client receiver ON d.receiver_id = receiver.id
             ORDER BY d.created_at DESC"
        )?;

        let debits = stmt.query_map([], |row| {
            let sender = if row.get::<_, Option<String>>(10)?.is_some() {
                Some(serde_json::json!({
                    "id": row.get::<_, Option<i64>>(1)?,
                    "client_name": row.get::<_, Option<String>>(10)?,
                    "phone_number": row.get::<_, Option<String>>(11)?
                }))
            } else {
                None
            };

            let receiver = if row.get::<_, Option<String>>(12)?.is_some() {
                Some(serde_json::json!({
                    "id": row.get::<_, Option<i64>>(2)?,
                    "client_name": row.get::<_, Option<String>>(12)?,
                    "phone_number": row.get::<_, Option<String>>(13)?
                }))
            } else {
                None
            };

            Ok(serde_json::json!({
                "id": row.get::<_, i64>(0)?,
                "sender_id": row.get::<_, Option<i64>>(1)?,
                "receiver_id": row.get::<_, i64>(2)?,
                "shipping_id": row.get::<_, Option<i64>>(3)?,
                "amount": row.get::<_, f64>(4)?,
                "currency": row.get::<_, String>(5)?,
                "note": row.get::<_, Option<String>>(6)?,
                "transaction_date": row.get::<_, Option<String>>(7)?,
                "total_debit": row.get::<_, Option<f64>>(8)?,
                "created_at": row.get::<_, String>(9)?,
                "sender": sender,
                "receiver": receiver
            }))
        })?;

        let mut list = Vec::new();
        for d in debits {
            list.push(d?);
        }
        Ok(list)
    }

    pub fn get_debit_by_id(&self, id: i64) -> Result<Debit, AppError> {
        let mut stmt = self.conn.prepare(
            "SELECT id, sender_id, receiver_id, shipping_id, amount, currency,
                    note, transaction_date, total_debit, created_at FROM debits WHERE id = ?"
        )?;

        stmt.query_row([id], |row| {
            Ok(Debit {
                id: row.get(0)?,
                sender_id: row.get(1)?,
                receiver_id: row.get(2)?,
                shipping_id: row.get(3)?,
                amount: row.get(4)?,
                currency: row.get(5)?,
                note: row.get(6)?,
                transaction_date: row.get(7)?,
                total_debit: row.get(8)?,
                created_at: row.get(9)?,
            })
        }).map_err(AppError::from)
    }

    pub fn create_debit(&mut self, debit: &Debit) -> Result<Debit, AppError> {
        let tx = self.conn.transaction()?;

        tx.execute(
            "INSERT INTO debits (sender_id, receiver_id, shipping_id, amount, currency,
                                note, transaction_date, total_debit, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            params![
                debit.sender_id,
                debit.receiver_id,
                debit.shipping_id,
                debit.amount,
                debit.currency,
                debit.note,
                debit.transaction_date,
                debit.total_debit,
                debit.created_at,
            ],
        )?;

        let id = tx.last_insert_rowid();
        tx.commit()?;

        self.get_debit_by_id(id)
    }

    pub fn update_debit(&mut self, id: i64, debit: &Debit) -> Result<Debit, AppError> {
        let tx = self.conn.transaction()?;

        tx.execute(
            "UPDATE debits SET sender_id=?, receiver_id=?, shipping_id=?, amount=?, currency=?,
                                note=?, transaction_date=?, total_debit=? WHERE id=?",
            params![
                debit.sender_id,
                debit.receiver_id,
                debit.shipping_id,
                debit.amount,
                debit.currency,
                debit.note,
                debit.transaction_date,
                debit.total_debit,
                id,
            ],
        )?;

        tx.commit()?;
        self.get_debit_by_id(id)
    }

    // Delete operations
    pub fn delete_product(&mut self, id: i64) -> Result<(), AppError> {
        self.conn.execute("DELETE FROM products WHERE id = ?", [id])?;
        Ok(())
    }

    pub fn delete_client(&mut self, id: i64) -> Result<(), AppError> {
        let tx = self.conn.transaction()?;

        // Delete related debits
        tx.execute("DELETE FROM debits WHERE sender_id = ? OR receiver_id = ?", params![id, id])?;

        // Find related shippings and delete them atomically
        let mut stmt = tx.prepare("SELECT id FROM shipping WHERE receiver_client_id = ? OR sender_client_id = ?")?;
        let shipping_ids: Vec<i64> = stmt.query_map(params![id, id], |row| row.get(0))?
            .filter_map(|r| r.ok())
            .collect();
        drop(stmt);

        for ship_id in shipping_ids {
            tx.execute("DELETE FROM products WHERE shipping_id = ?", params![ship_id])?;
            tx.execute("DELETE FROM debits WHERE shipping_id = ?", params![ship_id])?;
            tx.execute("DELETE FROM shipping WHERE id = ?", params![ship_id])?;
        }

        tx.execute("DELETE FROM client WHERE id = ?", params![id])?;
        tx.commit()?;
        Ok(())
    }

    pub fn delete_shipping(&mut self, id: i64) -> Result<(), AppError> {
        let tx = self.conn.transaction()?;
        tx.execute("DELETE FROM products WHERE shipping_id = ?", params![id])?;
        tx.execute("DELETE FROM debits WHERE shipping_id = ?", params![id])?;
        tx.execute("DELETE FROM shipping WHERE id = ?", params![id])?;
        tx.commit()?;
        Ok(())
    }

    pub fn delete_debit(&mut self, id: i64) -> Result<(), AppError> {
        self.conn.execute("DELETE FROM debits WHERE id = ?", [id])?;
        Ok(())
    }

    // Room operations
    pub fn get_rooms(&self) -> Result<Vec<Room>, AppError> {
        let mut stmt = self.conn.prepare("SELECT id, room_name FROM rooms")?;

        let rooms = stmt.query_map([], |row| {
            Ok(Room {
                id: row.get(0)?,
                room_name: row.get(1)?,
            })
        })?;

        let mut list = Vec::new();
        for r in rooms {
            list.push(r?);
        }
        Ok(list)
    }

    pub fn create_room(&mut self, room: &CreateRoom) -> Result<Room, AppError> {
        self.conn.execute(
            "INSERT INTO rooms (room_name) VALUES (?)",
            params![room.room_name],
        )?;

        let room_id = self.conn.last_insert_rowid();
        let mut stmt = self.conn.prepare("SELECT id, room_name FROM rooms WHERE id = ?")?;
        stmt.query_row([room_id], |row| {
            Ok(Room {
                id: row.get(0)?,
                room_name: row.get(1)?,
            })
        }).map_err(AppError::from)
    }

    // Store product operations
    pub fn get_store_products(&self) -> Result<Vec<StoreProduct>, AppError> {
        let mut stmt = self.conn.prepare(
            "SELECT id, product_id, product_name, individual_item_selling_price, image,
                    group_item_price, number_of_items, entered_at FROM store_products"
        )?;

        let store_products = stmt.query_map([], |row| {
            Ok(StoreProduct {
                id: row.get(0)?,
                product_id: row.get(1)?,
                product_name: row.get(2)?,
                individual_item_selling_price: row.get(3)?,
                image: row.get(4)?,
                group_item_price: row.get(5)?,
                number_of_items: row.get(6)?,
                entered_at: row.get(7)?,
            })
        })?;

        let mut list = Vec::new();
        for sp in store_products {
            list.push(sp?);
        }
        Ok(list)
    }

    // Database backup operation using native SQLite VACUUM INTO
    pub fn backup_to(&self, target_path: &str) -> Result<(), AppError> {
        let target = std::path::Path::new(target_path);
        if target.exists() {
            std::fs::remove_file(target)?;
        }
        self.conn.execute("VACUUM INTO ?", [target_path])?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn setup_test_db() -> Database {
        let mut conn = Connection::open_in_memory().unwrap();
        conn.pragma_update(None, "foreign_keys", "ON").unwrap();
        conn.pragma_update(None, "journal_mode", "WAL").unwrap();
        let migrations = get_migrations();
        migrations.to_latest(&mut conn).unwrap();
        Database { conn }
    }

    #[test]
    fn test_migrations_applied_successfully() {
        let db = setup_test_db();
        let version: i64 = db.conn.query_row("PRAGMA user_version", [], |row| row.get(0)).unwrap();
        assert_eq!(version, 4);
    }

    #[test]
    fn test_create_client_with_initial_debt_transaction() {
        let mut db = setup_test_db();
        let client = db.create_client(&Client {
            id: 0,
            client_name: "Test Customer".to_string(),
            phone_number: Some("07700000000".to_string()),
            shipping_id: None,
            history: None,
            debt: Some(150.0),
            total_debts: None,
        }).unwrap();

        assert_eq!(client.client_name, "Test Customer");
        assert_eq!(client.debt, Some(150.0));

        let debits = db.get_debits().unwrap();
        assert_eq!(debits.len(), 1);
        assert_eq!(debits[0].get("amount").and_then(|v| v.as_f64()), Some(150.0));
    }

    #[test]
    fn test_unique_box_code_constraint() {
        let mut db = setup_test_db();
        let product1 = Product {
            id: 0,
            shipping_id: None,
            item_no: None,
            box_code: "BOX-UNIQUE-1".to_string(),
            product_name: Some("Item 1".to_string()),
            cost: 10.0,
            selling_price: 15.0,
            storage: None,
            weight: None,
            image: None,
            pice_per_box: 1,
            total_pices: 10,
            total_cost: 100.0,
            size_of_box: 1.0,
            total_box_size: 10.0,
            number_of_boxes: 10,
            extracted_pieces: 0,
            status: "available".to_string(),
            grope_item_price: None,
            currency: "Dollar".to_string(),
            note: None,
            created_at: None,
            updated_at: None,
        };
        db.create_product(&product1).unwrap();

        // Inserting same box code should fail with constraint error
        let mut product2 = product1.clone();
        product2.box_code = "BOX-UNIQUE-1".to_string();
        let result = db.create_product(&product2);
        assert!(result.is_err());
    }

    #[test]
    fn test_create_shipping_with_unpaid_amount_creates_debit() {
        let mut db = setup_test_db();
        let client_receiver = db.create_client(&Client {
            id: 0,
            client_name: "Receiver".to_string(),
            phone_number: None,
            shipping_id: None,
            history: None,
            debt: None,
            total_debts: None,
        }).unwrap();

        let client_sender = db.create_client(&Client {
            id: 0,
            client_name: "Sender".to_string(),
            phone_number: None,
            shipping_id: None,
            history: None,
            debt: None,
            total_debts: None,
        }).unwrap();

        let shipping = db.create_shipping(&Shipping {
            id: 0,
            r#type: "input load".to_string(),
            shipping_date: "2026-08-15".to_string(),
            receiving_date: "2026-08-16".to_string(),
            receiver_client_id: client_receiver.id,
            sender_client_id: client_sender.id,
            file_path: None,
            paid: 50,
            ship_price: 200.0,
            currency: "Dollar".to_string(),
            note: None,
            created_at: String::new(),
        }).unwrap();

        assert_eq!(shipping.ship_price, 200.0);
        let debits = db.get_debits().unwrap();
        // 1 debit created for unpaid 150.0
        assert_eq!(debits.len(), 1);
        assert_eq!(debits[0].get("amount").and_then(|v| v.as_f64()), Some(150.0));
    }

    #[test]
    fn test_create_shipping_with_items_deducts_stock_and_marks_depleted() {
        let mut db = setup_test_db();
        let receiver = db.create_client(&Client {
            id: 0,
            client_name: "Buyer Client".to_string(),
            phone_number: None,
            shipping_id: None,
            history: None,
            debt: None,
            total_debts: None,
        }).unwrap();
        let sender = db.create_client(&Client {
            id: 0,
            client_name: "Our Warehouse".to_string(),
            phone_number: None,
            shipping_id: None,
            history: None,
            debt: None,
            total_debts: None,
        }).unwrap();

        // Create product with 20 total pieces
        let product = db.create_product(&Product {
            id: 0,
            shipping_id: None,
            item_no: Some("ITM-101".to_string()),
            box_code: "BOX-TEST-OUTPUT".to_string(),
            product_name: Some("Test Widget".to_string()),
            cost: 5.0,
            selling_price: 12.0,
            storage: Some("A1".to_string()),
            weight: None,
            image: None,
            pice_per_box: 1,
            total_pices: 20,
            total_cost: 100.0,
            size_of_box: 1.0,
            total_box_size: 20.0,
            number_of_boxes: 20,
            extracted_pieces: 0,
            status: "available".to_string(),
            grope_item_price: None,
            currency: "Dollar".to_string(),
            note: None,
            created_at: None,
            updated_at: None,
        }).unwrap();

        // First shipment: extract 12 pieces
        let shipping1 = db.create_shipping_with_items(
            &Shipping {
                id: 0,
                r#type: "output load".to_string(),
                shipping_date: "2026-08-15".to_string(),
                receiving_date: "2026-08-15".to_string(),
                receiver_client_id: receiver.id,
                sender_client_id: sender.id,
                file_path: None,
                paid: 144,
                ship_price: 144.0,
                currency: "Dollar".to_string(),
                note: None,
                created_at: String::new(),
            },
            &[CreateShippingItem {
                product_id: product.id,
                quantity: 12.0,
                quantity_type: "pieces".to_string(),
                unit_price: 12.0,
            }],
        ).unwrap();

        let items1 = db.get_shipping_items(shipping1.id).unwrap();
        assert_eq!(items1.len(), 1);
        assert_eq!(items1[0].quantity, 12.0);
        assert_eq!(items1[0].total_price, 144.0);

        let prod_after1 = db.get_product_by_id(product.id).unwrap();
        assert_eq!(prod_after1.extracted_pieces, 12);
        assert_eq!(prod_after1.status, "available");

        // Second shipment: extract remaining 8 pieces -> should transition to 'depleted'
        let _shipping2 = db.create_shipping_with_items(
            &Shipping {
                id: 0,
                r#type: "output load".to_string(),
                shipping_date: "2026-08-16".to_string(),
                receiving_date: "2026-08-16".to_string(),
                receiver_client_id: receiver.id,
                sender_client_id: sender.id,
                file_path: None,
                paid: 50,
                ship_price: 96.0,
                currency: "Dollar".to_string(),
                note: None,
                created_at: String::new(),
            },
            &[CreateShippingItem {
                product_id: product.id,
                quantity: 8.0,
                quantity_type: "pieces".to_string(),
                unit_price: 12.0,
            }],
        ).unwrap();

        let prod_after2 = db.get_product_by_id(product.id).unwrap();
        assert_eq!(prod_after2.extracted_pieces, 20);
        assert_eq!(prod_after2.status, "depleted");

        // Unpaid debit for shipping2 (96 - 50 = 46.0)
        let debits = db.get_debits().unwrap();
        assert_eq!(debits.len(), 1);
        assert_eq!(debits[0].get("amount").and_then(|v| v.as_f64()), Some(46.0));
    }

    #[test]
    fn test_create_shipping_with_products_atomic_batch() {
        let mut db = setup_test_db();
        let receiver = db.create_client(&Client {
            id: 0,
            client_name: "Receiver 2".to_string(),
            phone_number: None,
            shipping_id: None,
            history: None,
            debt: None,
            total_debts: None,
        }).unwrap();
        let sender = db.create_client(&Client {
            id: 0,
            client_name: "Supplier".to_string(),
            phone_number: None,
            shipping_id: None,
            history: None,
            debt: None,
            total_debts: None,
        }).unwrap();

        let products = vec![
            serde_json::json!({
                "box_code": "BATCH-001",
                "product_name": "Batch Product 1",
                "cost": 10.0,
                "selling_price": 20.0,
                "number_of_boxes": 5,
                "piece_per_box": 2,
            }),
            serde_json::json!({
                "box_code": "BATCH-002",
                "product_name": "Batch Product 2",
                "cost": 15.0,
                "selling_price": 30.0,
                "number_of_boxes": 3,
                "piece_per_box": 4,
            }),
        ];

        let shipping = db.create_shipping_with_products(
            &Shipping {
                id: 0,
                r#type: "input load".to_string(),
                shipping_date: "2026-08-15".to_string(),
                receiving_date: "2026-08-16".to_string(),
                receiver_client_id: receiver.id,
                sender_client_id: sender.id,
                file_path: None,
                paid: 0,
                ship_price: 50.0,
                currency: "Dollar".to_string(),
                note: None,
                created_at: String::new(),
            },
            &products,
        ).unwrap();

        let all_prods = db.get_products().unwrap();
        assert_eq!(all_prods.len(), 2);
        assert_eq!(all_prods[0].shipping_id, Some(shipping.id));
        assert_eq!(all_prods[1].shipping_id, Some(shipping.id));
    }

    #[test]
    fn test_migrate_base64_images() {
        let mut conn = Connection::open_in_memory().unwrap();
        let migrations = get_migrations();
        migrations.to_latest(&mut conn).unwrap();

        // Insert product with base64 data URL
        // 1x1 transparent PNG in base64: iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==
        let base64_image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
        conn.execute(
            "INSERT INTO products (box_code, product_name, cost, selling_price, image)
             VALUES (?1, ?2, ?3, ?4, ?5)",
            params!["BASE64-BOX", "Image Product", 10.0, 20.0, base64_image],
        ).unwrap();

        let temp_dir = std::env::temp_dir().join(format!("storagesystem_test_{}", uuid::Uuid::new_v4()));
        let migrated_count = migrate_base64_images(&mut conn, &temp_dir).unwrap();
        assert_eq!(migrated_count, 1);

        let mut stmt = conn.prepare("SELECT image FROM products WHERE box_code = 'BASE64-BOX'").unwrap();
        let updated_image: String = stmt.query_row([], |row| row.get(0)).unwrap();
        assert!(updated_image.starts_with("product_images/img_"));
        assert!(updated_image.ends_with(".png"));

        // Verify physical file was written
        let physical_path = temp_dir.join(&updated_image);
        assert!(physical_path.exists());
        assert!(std::fs::metadata(&physical_path).unwrap().len() > 0);

        // Cleanup
        let _ = std::fs::remove_dir_all(&temp_dir);
    }

    #[test]
    fn test_client_balances_dynamic_view_with_multiple_debits() {
        let mut db = setup_test_db();

        // Create 2 clients: Client A and Client B
        let client_a = db.create_client(&Client {
            id: 0,
            client_name: "Alice Corporation".to_string(),
            phone_number: Some("1111111111".to_string()),
            shipping_id: None,
            history: None,
            debt: Some(100.0), // Initial debit creates 100.0 for client_a as receiver
            total_debts: None,
        }).unwrap();

        let client_b = db.create_client(&Client {
            id: 0,
            client_name: "Bob Enterprises".to_string(),
            phone_number: Some("2222222222".to_string()),
            shipping_id: None,
            history: None,
            debt: None,
            total_debts: None,
        }).unwrap();

        // Check initial state from v_client_balances
        let a_loaded = db.get_client_by_id(client_a.id).unwrap();
        assert_eq!(a_loaded.total_debts, Some(100.0));

        let b_loaded = db.get_client_by_id(client_b.id).unwrap();
        assert_eq!(b_loaded.total_debts, Some(0.0));

        // Add a transfer: Alice sends $40 to Bob (Alice = sender, Bob = receiver)
        let now = chrono::Utc::now().to_rfc3339();
        db.conn.execute(
            "INSERT INTO debits (sender_id, receiver_id, shipping_id, amount, currency, note, transaction_date, created_at)
             VALUES (?1, ?2, NULL, ?3, 'Dollar', 'Payment transfer', ?4, ?5)",
            params![client_a.id, client_b.id, 40.0, now, now],
        ).unwrap();

        // Alice: +100 (initial receiver) - 40 (sender) = +60.0
        // Bob: +40 (receiver) = +40.0
        let a_updated = db.get_client_by_id(client_a.id).unwrap();
        assert_eq!(a_updated.total_debts, Some(60.0));

        let b_updated = db.get_client_by_id(client_b.id).unwrap();
        assert_eq!(b_updated.total_debts, Some(40.0));

        // Verify full client list query
        let all_clients = db.get_clients().unwrap();
        assert_eq!(all_clients.len(), 2);
    }
}

