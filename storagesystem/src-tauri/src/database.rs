use rusqlite::{params, Connection, Result};
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
#[derive(Debug, Serialize, Deserialize)]
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
#[derive(Debug, Serialize, Deserialize)]
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

// Simplified Debit struct for database operations
#[derive(Debug, Serialize, Deserialize)]
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
#[derive(Debug, Serialize, Deserialize)]
pub struct CreateRoom {
    pub room_name: String,
}

#[derive(Debug, Serialize, Deserialize)]
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
    conn: Connection,
}

impl Database {
    // Initialize database with custom path or app data directory
    #[allow(dead_code)]
    pub fn new(app_handle: &AppHandle) -> Result<Self> {
        Self::new_with_path(app_handle, None)
    }

    // Initialize database with custom path
    pub fn new_with_path(app_handle: &AppHandle, custom_path: Option<&str>) -> Result<Self> {
        let db_dir = if let Some(path) = custom_path {
            std::path::PathBuf::from(path)
        } else {
            app_handle
                .path()
                .app_data_dir()
                .map_err(|_| rusqlite::Error::QueryReturnedNoRows)?
        };

        std::fs::create_dir_all(&db_dir).map_err(|_| rusqlite::Error::QueryReturnedNoRows)?;

        let db_path = db_dir.join("storagesystem.db");
        let conn = Connection::open(db_path)?;

        // Enable foreign keys and WAL mode
        conn.pragma_update(None, "foreign_keys", "ON")?;
        conn.pragma_update(None, "journal_mode", "WAL")?;

        let db = Database { conn };
        db.create_tables()?;
        Ok(db)
    }

    fn create_tables(&self) -> Result<()> {
        // Create client table first (referenced by shipping)
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS client (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                client_name TEXT NOT NULL,
                phone_number TEXT,
                shipping_id INTEGER,
                history TEXT
            )",
            [],
        )?;

        // Create shipping table (references client)
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS shipping (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                type TEXT NOT NULL,
                shipping_date TEXT NOT NULL,
                receiving_date TEXT NOT NULL,
                receiver_client_id INTEGER NOT NULL REFERENCES client(id),
                sender_client_id INTEGER NOT NULL REFERENCES client(id),
                file_path TEXT,
                paid INTEGER DEFAULT 0,
                ship_price REAL DEFAULT 0,
                currency TEXT DEFAULT 'Dollar',
                note TEXT,
                created_at TEXT NOT NULL
            )",
            [],
        )?;



        // Create products table
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                shipping_id INTEGER REFERENCES shipping(id),
                item_no TEXT,
                box_code TEXT NOT NULL,
                product_name TEXT,
                cost REAL NOT NULL,
                selling_price REAL NOT NULL,
                storage TEXT,
                weight REAL,
                image TEXT,
                pice_per_box INTEGER,
                total_pices INTEGER DEFAULT 0,
                total_cost REAL DEFAULT 0,
                size_of_box REAL NOT NULL,
                total_box_size REAL NOT NULL,
                number_of_boxes INTEGER NOT NULL,
                extracted_pieces INTEGER DEFAULT 0,
                status TEXT DEFAULT 'available',
                grope_item_price REAL,
                currency TEXT NOT NULL,
                note TEXT,
                created_at TEXT,
                updated_at TEXT
            )",
            [],
        )?;

        // Create debits table
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS debits (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender_id INTEGER REFERENCES client(id),
                receiver_id INTEGER REFERENCES client(id),
                shipping_id INTEGER REFERENCES shipping(id),
                amount REAL NOT NULL,
                currency TEXT DEFAULT 'Dollar',
                note TEXT,
                transaction_date TEXT,
                total_debit REAL,
                created_at TEXT NOT NULL
            )",
            [],
        )?;

        // Create rooms table
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS rooms (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                room_name TEXT NOT NULL
            )",
            [],
        )?;

        // Create store_products table
        self.conn.execute(
            "CREATE TABLE IF NOT EXISTS store_products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id INTEGER NOT NULL REFERENCES products(id),
                product_name TEXT NOT NULL,
                individual_item_selling_price REAL NOT NULL,
                image TEXT,
                group_item_price REAL,
                number_of_items INTEGER NOT NULL,
                entered_at TEXT NOT NULL DEFAULT (datetime('now'))
            )",
            [],
        )?;

        // Create indexes for better performance
        self.conn.execute("CREATE INDEX IF NOT EXISTS idx_shipping_type ON shipping(type)", [])?;
        self.conn.execute("CREATE INDEX IF NOT EXISTS idx_product_name ON products(product_name)", [])?;
        self.conn.execute("CREATE INDEX IF NOT EXISTS idx_box_code ON products(box_code)", [])?;
        self.conn.execute("CREATE INDEX IF NOT EXISTS idx_shipping_id ON products(shipping_id)", [])?;
        self.conn.execute("CREATE INDEX IF NOT EXISTS idx_client_name ON client(client_name)", [])?;
        self.conn.execute("CREATE INDEX IF NOT EXISTS idx_client_shipping_id ON client(shipping_id)", [])?;
        self.conn.execute("CREATE INDEX IF NOT EXISTS idx_debit_sender_id ON debits(sender_id)", [])?;
        self.conn.execute("CREATE INDEX IF NOT EXISTS idx_debit_receiver_id ON debits(receiver_id)", [])?;
        self.conn.execute("CREATE INDEX IF NOT EXISTS idx_debit_shipping_id ON debits(shipping_id)", [])?;
        self.conn.execute("CREATE INDEX IF NOT EXISTS idx_room_name ON rooms(room_name)", [])?;
        self.conn.execute("CREATE INDEX IF NOT EXISTS idx_store_product_id ON store_products(product_id)", [])?;

        Ok(())
    }

    // Product operations
    pub fn get_products(&self) -> Result<Vec<Product>> {
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

        products.collect()
    }

    pub fn create_product(&self, product: &Product) -> Result<Product> {
        self.conn.execute(
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

        let id = self.conn.last_insert_rowid();
        let mut stmt = self.conn.prepare("SELECT * FROM products WHERE id = ?")?;
        let mut rows = stmt.query_map([id], |row| {
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

        rows.next().ok_or(rusqlite::Error::QueryReturnedNoRows)?
    }

    pub fn update_product(&self, id: i64, product: &Product) -> Result<Product> {
        self.conn.execute(
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
                chrono::Utc::now().to_rfc3339(),
                id,
            ],
        )?;
        let mut stmt = self.conn.prepare(
            "SELECT id, shipping_id, item_no, box_code, product_name, cost, selling_price,
                    storage, weight, image, pice_per_box, total_pices, total_cost,
                    size_of_box, total_box_size, number_of_boxes, extracted_pieces,
                    status, grope_item_price, currency, note, created_at, updated_at
             FROM products WHERE id = ?"
        )?;
        let mut rows = stmt.query_map([id], |row| {
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
        rows.next().ok_or(rusqlite::Error::QueryReturnedNoRows)?
    }

    // Client operations
    pub fn get_clients(&self) -> Result<Vec<Client>> {
        let mut stmt = self.conn.prepare(
            "SELECT c.id, c.client_name, c.phone_number, c.shipping_id, c.history,
                    COALESCE(SUM(d.amount), 0) as total_debt
             FROM client c
             LEFT JOIN debits d ON c.id = d.receiver_id
             GROUP BY c.id, c.client_name, c.phone_number, c.shipping_id, c.history"
        )?;

        let clients = stmt.query_map([], |row| {
            Ok(Client {
                id: row.get(0)?,
                client_name: row.get(1)?,
                phone_number: row.get(2)?,
                shipping_id: row.get(3)?,
                history: row.get(4)?,
                debt: Some(row.get::<_, f64>(5)?), // Total debt from debits
                total_debts: Some(row.get::<_, f64>(5)?), // Same as debt for now
            })
        })?;

        clients.collect()
    }

    pub fn create_client(&self, client: &Client) -> Result<Client> {
        self.conn.execute(
            "INSERT INTO client (client_name, phone_number, shipping_id, history)
             VALUES (?, ?, ?, ?)",
            params![
                client.client_name,
                client.phone_number,
                client.shipping_id,
                client.history,
            ],
        )?;

        let client_id = self.conn.last_insert_rowid();

        // If debt is provided and > 0, create a debit record
        if let Some(debt_amount) = client.debt {
            if debt_amount > 0.0 {
                let debit = Debit {
                    id: 0, // Will be set by database
                    sender_id: None, // No sender for initial debt
                    receiver_id: client_id, // The client owes this amount
                    shipping_id: None, // Not related to shipping
                    amount: debt_amount,
                    currency: "Dollar".to_string(), // Default currency
                    note: Some(format!("Initial debt for client {}", client.client_name)),
                    transaction_date: Some(chrono::Utc::now().to_rfc3339()),
                    total_debit: None, // Will be calculated
                    created_at: chrono::Utc::now().to_rfc3339(),
                };
                self.create_debit(&debit)?;
            }
        }

        let mut stmt = self.conn.prepare("SELECT id, client_name, phone_number, shipping_id, history FROM client WHERE id = ?")?;
        let mut rows = stmt.query_map([client_id], |row| {
            Ok(Client {
                id: row.get(0)?,
                client_name: row.get(1)?,
                phone_number: row.get(2)?,
                shipping_id: row.get(3)?,
                history: row.get(4)?,
                debt: None, // Calculated field, not stored in database
                total_debts: None, // Calculated field, not stored in database
            })
        })?;

        rows.next().ok_or(rusqlite::Error::QueryReturnedNoRows)?
    }

    pub fn update_client(&self, id: i64, updates: &serde_json::Value) -> Result<Client> {
        // Fetch existing client
        let clients = self.get_clients()?;
        let existing = clients.into_iter().find(|c| c.id == id)
            .ok_or_else(|| rusqlite::Error::QueryReturnedNoRows)?;

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

        let mut stmt = self.conn.prepare(
            "SELECT id, client_name, phone_number, shipping_id, history FROM client WHERE id = ?"
        )?;
        let mut rows = stmt.query_map([id], |row| {
            Ok(Client {
                id: row.get(0)?,
                client_name: row.get(1)?,
                phone_number: row.get(2)?,
                shipping_id: row.get(3)?,
                history: row.get(4)?,
                debt: None,
                total_debts: None,
            })
        })?;
        rows.next().ok_or(rusqlite::Error::QueryReturnedNoRows)?
    }
    pub fn get_shipping(&self) -> Result<Vec<serde_json::Value>> {
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

        shipping.collect()
    }

    pub fn create_shipping(&self, shipping: &Shipping) -> Result<Shipping> {
        let created_at = chrono::Utc::now().to_rfc3339();
        self.conn.execute(
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

        let shipping_id = self.conn.last_insert_rowid();

        // Create debit record for the shipping transaction between the two clients
        let remaining_amount = shipping.ship_price - shipping.paid as f64;
        if remaining_amount > 0.0 {
            let transaction_date = Some(chrono::Utc::now().to_rfc3339());

            // The receiver (customer) owes the sender (supplier) the remaining shipping cost
            let shipping_debit = Debit {
                id: 0,
                sender_id: Some(shipping.receiver_client_id), // debtor: who owes money (receiver/customer)
                receiver_id: shipping.sender_client_id,       // creditor: who is owed money (sender/supplier)
                shipping_id: Some(shipping_id),
                amount: remaining_amount,
                currency: shipping.currency.clone(),
                note: Some(format!("Remaining shipping cost for shipping #{} (total: {}, paid: {})",
                    shipping_id, shipping.ship_price, shipping.paid)),
                transaction_date: transaction_date,
                total_debit: None,
                created_at: chrono::Utc::now().to_rfc3339(),
            };
            self.create_debit(&shipping_debit)?;
        }

        let mut stmt = self.conn.prepare("SELECT id, type, shipping_date, receiving_date, receiver_client_id,
                                                sender_client_id, file_path, paid, ship_price, currency, note, created_at
                                         FROM shipping WHERE id = ?")?;
        let mut rows = stmt.query_map([shipping_id], |row| {
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
        })?;

        rows.next().ok_or(rusqlite::Error::QueryReturnedNoRows)?
    }

    pub fn update_shipping(&self, id: i64, updates: &serde_json::Value) -> Result<Shipping> {
        // Fetch existing via raw query since get_shipping returns Value
        let mut stmt = self.conn.prepare(
            "SELECT id, type, shipping_date, receiving_date, receiver_client_id, sender_client_id,
                    file_path, paid, ship_price, currency, note, created_at FROM shipping WHERE id = ?"
        )?;
        let existing = stmt.query_map([id], |row| {
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
        })?.next().ok_or(rusqlite::Error::QueryReturnedNoRows)??;

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

        let mut stmt2 = self.conn.prepare(
            "SELECT id, type, shipping_date, receiving_date, receiver_client_id, sender_client_id,
                    file_path, paid, ship_price, currency, note, created_at FROM shipping WHERE id = ?"
        )?;
        let mut rows = stmt2.query_map([id], |row| {
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
        })?;
        rows.next().ok_or(rusqlite::Error::QueryReturnedNoRows)?
    }
    pub fn get_debits(&self) -> Result<Vec<serde_json::Value>> {
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

        debits.collect()
    }

    pub fn create_debit(&self, debit: &Debit) -> Result<Debit> {
        self.conn.execute(
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

        let id = self.conn.last_insert_rowid();
        let mut stmt = self.conn.prepare("SELECT * FROM debits WHERE id = ?")?;
        let mut rows = stmt.query_map([id], |row| {
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
        })?;

        rows.next().ok_or(rusqlite::Error::QueryReturnedNoRows)?
    }

    pub fn update_debit(&self, id: i64, debit: &Debit) -> Result<Debit> {
        self.conn.execute(
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

        let mut stmt = self.conn.prepare("SELECT * FROM debits WHERE id = ?")?;
        let mut rows = stmt.query_map([id], |row| {
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
        })?;

        rows.next().ok_or(rusqlite::Error::QueryReturnedNoRows)?
    }

    // Delete operations
    pub fn delete_product(&self, id: i64) -> Result<()> {
        self.conn.execute("DELETE FROM products WHERE id = ?", [id])?;
        Ok(())
    }

    pub fn delete_client(&self, id: i64) -> Result<()> {
        // First delete related debits
        self.conn.execute("DELETE FROM debits WHERE sender_id = ? OR receiver_id = ?", [id, id])?;

        // Delete related shipping records (which also removes their products and debits)
        let mut stmt = self.conn.prepare("SELECT id FROM shipping WHERE receiver_client_id = ? OR sender_client_id = ?")?;
        let shipping_ids: Vec<i64> = stmt.query_map([id, id], |row| row.get(0))?
            .filter_map(|r| r.ok())
            .collect();
        for ship_id in shipping_ids {
            self.delete_shipping(ship_id)?;
        }

        // Then delete the client
        self.conn.execute("DELETE FROM client WHERE id = ?", [id])?;
        Ok(())
    }

    pub fn delete_shipping(&self, id: i64) -> Result<()> {
        // First delete related products and debits
        self.conn.execute("DELETE FROM products WHERE shipping_id = ?", [id])?;
        self.conn.execute("DELETE FROM debits WHERE shipping_id = ?", [id])?;
        // Then delete the shipping record
        self.conn.execute("DELETE FROM shipping WHERE id = ?", [id])?;
        Ok(())
    }

    pub fn delete_debit(&self, id: i64) -> Result<()> {
        self.conn.execute("DELETE FROM debits WHERE id = ?", [id])?;
        Ok(())
    }

    // Room operations
    pub fn get_rooms(&self) -> Result<Vec<Room>> {
        let mut stmt = self.conn.prepare("SELECT id, room_name FROM rooms")?;

        let rooms = stmt.query_map([], |row| {
            Ok(Room {
                id: row.get(0)?,
                room_name: row.get(1)?,
            })
        })?;

        rooms.collect()
    }

    pub fn create_room(&self, room: &CreateRoom) -> Result<Room> {
        self.conn.execute(
            "INSERT INTO rooms (room_name) VALUES (?)",
            params![room.room_name],
        )?;

        let room_id = self.conn.last_insert_rowid();
        let mut stmt = self.conn.prepare("SELECT id, room_name FROM rooms WHERE id = ?")?;
        let mut rows = stmt.query_map([room_id], |row| {
            Ok(Room {
                id: row.get(0)?,
                room_name: row.get(1)?,
            })
        })?;

        rows.next().ok_or(rusqlite::Error::QueryReturnedNoRows)?
    }

    // Store product operations
    pub fn get_store_products(&self) -> Result<Vec<StoreProduct>> {
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

        store_products.collect()
    }

    // Database backup operation
    pub fn backup_to(&self, target_path: &str) -> Result<()> {
        self.conn.execute("VACUUM INTO ?", [target_path])?;
        Ok(())
    }
}
