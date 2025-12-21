use rusqlite::{params, Connection, Result};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};

// Database models matching the TypeScript schema
#[derive(Debug, Serialize, Deserialize)]
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

#[derive(Debug, Serialize, Deserialize)]
pub struct Client {
    pub id: i64,
    pub client_name: String,
    pub phone_number: Option<String>,
    pub shipping_id: Option<i64>,
    pub history: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
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

#[derive(Debug, Serialize, Deserialize)]
pub struct Debit {
    pub id: i64,
    pub sender_id: Option<i64>,
    pub receiver_id: Option<i64>,
    pub shipping_id: Option<i64>,
    pub amount: f64,
    pub currency: String,
    pub note: Option<String>,
    pub transaction_date: Option<String>,
    pub total_debit: Option<f64>,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Room {
    pub id: i64,
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
    // Initialize database with proper app data directory
    pub fn new(app_handle: &AppHandle) -> Result<Self> {
        let app_data_dir = app_handle
            .path()
            .app_data_dir()
            .expect("Failed to get app data directory");

        std::fs::create_dir_all(&app_data_dir).expect("Failed to create app data directory");

        let db_path = app_data_dir.join("storagesystem.db");
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

        rows.next().unwrap()
    }

    // Client operations
    pub fn get_clients(&self) -> Result<Vec<Client>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, client_name, phone_number, shipping_id, history FROM client"
        )?;

        let clients = stmt.query_map([], |row| {
            Ok(Client {
                id: row.get(0)?,
                client_name: row.get(1)?,
                phone_number: row.get(2)?,
                shipping_id: row.get(3)?,
                history: row.get(4)?,
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

        let id = self.conn.last_insert_rowid();
        let mut stmt = self.conn.prepare("SELECT * FROM client WHERE id = ?")?;
        let mut rows = stmt.query_map([id], |row| {
            Ok(Client {
                id: row.get(0)?,
                client_name: row.get(1)?,
                phone_number: row.get(2)?,
                shipping_id: row.get(3)?,
                history: row.get(4)?,
            })
        })?;

        rows.next().unwrap()
    }

    // Shipping operations
    pub fn get_shipping(&self) -> Result<Vec<Shipping>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, type, shipping_date, receiving_date, receiver_client_id,
                    sender_client_id, file_path, paid, ship_price, currency, note, created_at
             FROM shipping"
        )?;

        let shipping = stmt.query_map([], |row| {
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

        shipping.collect()
    }

    // Debit operations
    pub fn get_debits(&self) -> Result<Vec<Debit>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, sender_id, receiver_id, shipping_id, amount, currency,
                    note, transaction_date, total_debit, created_at FROM debits"
        )?;

        let debits = stmt.query_map([], |row| {
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

        debits.collect()
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
}
