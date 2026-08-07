use crate::database::{Database, Product, Client, CreateClient, Shipping, CreateShipping, Room, CreateRoom, StoreProduct};
use tauri::{AppHandle, State};
use std::sync::Mutex;

// Database state wrapper for Tauri
pub struct DatabaseState(pub Mutex<Option<Database>>);

// Initialize database command (blocking version for setup)
pub fn initialize_database_blocking(app_handle: AppHandle) -> Result<(), String> {
    let db = Database::new_with_path(&app_handle, None).map_err(|e| e.to_string())?;
    drop(db); // Explicitly drop to avoid unused variable warning
    Ok(())
}

// Initialize database command (async version for IPC)
#[tauri::command]
pub async fn initialize_database(
    app_handle: AppHandle,
    state: State<'_, DatabaseState>,
    storage_path: Option<String>
) -> Result<(), String> {
    let path_ref = storage_path.as_deref().filter(|s| !s.trim().is_empty());
    let db = Database::new_with_path(&app_handle, path_ref).map_err(|e| e.to_string())?;
    *state.0.lock().unwrap() = Some(db);
    Ok(())
}

// Product commands
#[tauri::command]
pub async fn get_products(state: State<'_, DatabaseState>) -> Result<Vec<Product>, String> {
    let db = state.0.lock().unwrap();
    let db = db.as_ref().ok_or("Database not initialized")?;
    db.get_products().map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_product(
    product_data: serde_json::Value,
    state: State<'_, DatabaseState>
) -> Result<Product, String> {
    let db = state.0.lock().unwrap();
    let db = db.as_ref().ok_or("Database not initialized")?;

    println!("Received product data: {:?}", product_data);

    // Manually map JSON fields to Product struct so we can handle:
    // - missing 'id' (assigned by database)
    // - field name variants (original_price -> cost, Total_pices -> total_pices, etc.)
    let product = Product {
        id: 0, // assigned by database
        shipping_id: product_data.get("shipping_id").and_then(|v| v.as_i64()),
        item_no: product_data.get("item_no").and_then(|v| v.as_str()).map(|s| s.to_string()),
        box_code: product_data.get("box_code").and_then(|v| v.as_str())
            .ok_or("Missing required field: box_code")?.to_string(),
        product_name: product_data.get("product_name").and_then(|v| v.as_str()).map(|s| s.to_string()),
        // Accept 'cost' or 'original_price' as the cost field
        cost: product_data.get("cost").and_then(|v| v.as_f64())
            .or_else(|| product_data.get("original_price").and_then(|v| v.as_f64()))
            .unwrap_or(0.0),
        selling_price: product_data.get("selling_price").and_then(|v| v.as_f64()).unwrap_or(0.0),
        storage: product_data.get("storage").and_then(|v| v.as_str()).map(|s| s.to_string()),
        weight: product_data.get("weight").and_then(|v| v.as_f64()),
        image: product_data.get("image").and_then(|v| v.as_str()).map(|s| s.to_string()),
        pice_per_box: product_data.get("pice_per_box").and_then(|v| v.as_i64()).unwrap_or(0),
        // Accept 'total_pices' or 'Total_pices'
        total_pices: product_data.get("total_pices").and_then(|v| v.as_i64())
            .or_else(|| product_data.get("Total_pices").and_then(|v| v.as_i64()))
            .unwrap_or(0),
        // Accept 'total_cost' or 'total_original_price'
        total_cost: product_data.get("total_cost").and_then(|v| v.as_f64())
            .or_else(|| product_data.get("total_original_price").and_then(|v| v.as_f64()))
            .unwrap_or(0.0),
        size_of_box: product_data.get("size_of_box").and_then(|v| v.as_f64()).unwrap_or(0.0),
        total_box_size: product_data.get("total_box_size").and_then(|v| v.as_f64()).unwrap_or(0.0),
        number_of_boxes: product_data.get("number_of_boxes").and_then(|v| v.as_i64()).unwrap_or(0),
        extracted_pieces: product_data.get("extracted_pieces").and_then(|v| v.as_i64()).unwrap_or(0),
        status: product_data.get("status").and_then(|v| v.as_str()).unwrap_or("available").to_string(),
        grope_item_price: product_data.get("grope_item_price").and_then(|v| v.as_f64()),
        currency: product_data.get("currency").and_then(|v| v.as_str()).unwrap_or("Dollar").to_string(),
        note: product_data.get("note").and_then(|v| v.as_str()).map(|s| s.to_string()),
        created_at: product_data.get("created_at").and_then(|v| v.as_str())
            .map(|s| s.to_string())
            .or_else(|| Some(chrono::Utc::now().to_rfc3339())),
        updated_at: product_data.get("updated_at").and_then(|v| v.as_str())
            .map(|s| s.to_string())
            .or_else(|| Some(chrono::Utc::now().to_rfc3339())),
    };

    println!("Parsed product: {:?}", product);

    db.create_product(&product).map_err(|e| {
        println!("Database error: {}", e);
        e.to_string()
    })
}


#[tauri::command]
pub async fn update_product(
    id: i64,
    product_data: serde_json::Value,
    state: State<'_, DatabaseState>
) -> Result<Product, String> {
    let db = state.0.lock().unwrap();
    let db = db.as_ref().ok_or("Database not initialized")?;

    // Get existing product first
    let products = db.get_products().map_err(|e| e.to_string())?;
    let existing = products.into_iter().find(|p| p.id == id)
        .ok_or("Product not found")?;

    // Merge updates onto existing product
    let updated = Product {
        id: existing.id,
        shipping_id: product_data.get("shipping_id").and_then(|v| v.as_i64()).or(existing.shipping_id),
        item_no: product_data.get("item_no").and_then(|v| v.as_str()).map(|s| s.to_string()).or(existing.item_no),
        box_code: product_data.get("box_code").and_then(|v| v.as_str()).unwrap_or(&existing.box_code).to_string(),
        product_name: product_data.get("product_name").and_then(|v| v.as_str()).map(|s| s.to_string()).or(existing.product_name),
        cost: product_data.get("cost").and_then(|v| v.as_f64()).unwrap_or(existing.cost),
        selling_price: product_data.get("selling_price").and_then(|v| v.as_f64()).unwrap_or(existing.selling_price),
        storage: product_data.get("storage").and_then(|v| v.as_str()).map(|s| s.to_string()).or(existing.storage),
        weight: product_data.get("weight").and_then(|v| v.as_f64()).or(existing.weight),
        image: product_data.get("image").and_then(|v| v.as_str()).map(|s| s.to_string()).or(existing.image),
        pice_per_box: product_data.get("pice_per_box").and_then(|v| v.as_i64()).unwrap_or(existing.pice_per_box),
        total_pices: product_data.get("total_pices").and_then(|v| v.as_i64()).unwrap_or(existing.total_pices),
        total_cost: product_data.get("total_cost").and_then(|v| v.as_f64()).unwrap_or(existing.total_cost),
        size_of_box: product_data.get("size_of_box").and_then(|v| v.as_f64()).unwrap_or(existing.size_of_box),
        total_box_size: product_data.get("total_box_size").and_then(|v| v.as_f64()).unwrap_or(existing.total_box_size),
        number_of_boxes: product_data.get("number_of_boxes").and_then(|v| v.as_i64()).unwrap_or(existing.number_of_boxes),
        extracted_pieces: product_data.get("extracted_pieces").and_then(|v| v.as_i64()).unwrap_or(existing.extracted_pieces),
        status: product_data.get("status").and_then(|v| v.as_str()).unwrap_or(&existing.status).to_string(),
        grope_item_price: product_data.get("grope_item_price").and_then(|v| v.as_f64()).or(existing.grope_item_price),
        currency: product_data.get("currency").and_then(|v| v.as_str()).unwrap_or(&existing.currency).to_string(),
        note: product_data.get("note").and_then(|v| v.as_str()).map(|s| s.to_string()).or(existing.note),
        created_at: existing.created_at,
        updated_at: existing.updated_at,
    };

    db.update_product(id, &updated).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_product(
    id: i64,
    state: State<'_, DatabaseState>
) -> Result<(), String> {
    let db = state.0.lock().unwrap();
    let db = db.as_ref().ok_or("Database not initialized")?;
    db.delete_product(id).map_err(|e| e.to_string())
}

// Client commands
#[tauri::command]
pub async fn get_clients(state: State<'_, DatabaseState>) -> Result<Vec<Client>, String> {
    let db = state.0.lock().unwrap();
    let db = db.as_ref().ok_or("Database not initialized")?;
    db.get_clients().map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_client(
    client_data: serde_json::Value,
    state: State<'_, DatabaseState>
) -> Result<Client, String> {
    let db = state.0.lock().unwrap();
    let db = db.as_ref().ok_or("Database not initialized")?;

    let create_client: CreateClient = serde_json::from_value(client_data)
        .map_err(|e| format!("Invalid client data: {}", e))?;

    // Convert CreateClient to Client for database operation
    let client = Client {
        id: 0, // Will be set by database
        client_name: create_client.client_name,
        phone_number: create_client.phone_number,
        shipping_id: create_client.shipping_id,
        history: create_client.history,
        debt: create_client.debt,
        total_debts: None,
    };

    db.create_client(&client).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_client(
    id: i64,
    client_data: serde_json::Value,
    state: State<'_, DatabaseState>
) -> Result<Client, String> {
    let db = state.0.lock().unwrap();
    let db = db.as_ref().ok_or("Database not initialized")?;
    db.update_client(id, &client_data).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_client(
    id: i64,
    state: State<'_, DatabaseState>
) -> Result<(), String> {
    let db = state.0.lock().unwrap();
    let db = db.as_ref().ok_or("Database not initialized")?;
    db.delete_client(id).map_err(|e| e.to_string())
}

// Shipping commands
#[tauri::command]
pub async fn get_shipping(state: State<'_, DatabaseState>) -> Result<Vec<serde_json::Value>, String> {
    let db = state.0.lock().unwrap();
    let db = db.as_ref().ok_or("Database not initialized")?;
    db.get_shipping().map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_shipping(
    shipping_data: serde_json::Value,
    state: State<'_, DatabaseState>
) -> Result<Shipping, String> {
    let db = state.0.lock().unwrap();
    let db = db.as_ref().ok_or("Database not initialized")?;

    let create_shipping: CreateShipping = serde_json::from_value(shipping_data)
        .map_err(|e| format!("Invalid shipping data: {}", e))?;

    // Convert CreateShipping to Shipping for database operation
    let shipping = Shipping {
        id: 0, // Will be set by database
        r#type: create_shipping.r#type,
        shipping_date: create_shipping.shipping_date,
        receiving_date: create_shipping.receiving_date,
        receiver_client_id: create_shipping.receiver_client_id,
        sender_client_id: create_shipping.sender_client_id,
        file_path: create_shipping.file_path,
        paid: create_shipping.paid,
        ship_price: create_shipping.ship_price,
        currency: create_shipping.currency,
        note: create_shipping.note,
        created_at: String::new(), // Will be set by database
    };

    db.create_shipping(&shipping).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_shipping(
    id: i64,
    shipping_data: serde_json::Value,
    state: State<'_, DatabaseState>
) -> Result<Shipping, String> {
    let db = state.0.lock().unwrap();
    let db = db.as_ref().ok_or("Database not initialized")?;
    db.update_shipping(id, &shipping_data).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_shipping(
    id: i64,
    state: State<'_, DatabaseState>
) -> Result<(), String> {
    let db = state.0.lock().unwrap();
    let db = db.as_ref().ok_or("Database not initialized")?;
    db.delete_shipping(id).map_err(|e| e.to_string())
}

// Debit commands
#[tauri::command]
pub async fn create_debit(
    debit_data: serde_json::Value,
    state: State<'_, DatabaseState>
) -> Result<crate::database::Debit, String> {
    let db = state.0.lock().unwrap();
    let db = db.as_ref().ok_or("Database not initialized")?;

    let debit = crate::database::Debit {
        id: 0,
        sender_id: debit_data.get("sender_id").and_then(|v| v.as_i64()),
        receiver_id: debit_data.get("receiver_id").and_then(|v| v.as_i64()).ok_or("receiver_id is required")?,
        shipping_id: debit_data.get("shipping_id").and_then(|v| v.as_i64()),
        amount: debit_data.get("amount").and_then(|v| v.as_f64()).unwrap_or(0.0),
        currency: debit_data
            .get("currency")
            .and_then(|v| v.as_str())
            .unwrap_or("Dollar")
            .to_string(),
        note: debit_data.get("note").and_then(|v| v.as_str()).map(|s| s.to_string()),
        transaction_date: debit_data
            .get("transaction_date")
            .and_then(|v| v.as_str())
            .map(|s| s.to_string()),
        total_debit: debit_data.get("total_debit").and_then(|v| v.as_f64()),
        created_at: chrono::Utc::now().to_rfc3339(),
    };

    db.create_debit(&debit).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_debits(state: State<'_, DatabaseState>) -> Result<Vec<serde_json::Value>, String> {
    let db = state.0.lock().unwrap();
    let db = db.as_ref().ok_or("Database not initialized")?;
    db.get_debits().map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn update_debit(
    id: i64,
    debit_data: serde_json::Value,
    state: State<'_, DatabaseState>
) -> Result<crate::database::Debit, String> {
    let db = state.0.lock().unwrap();
    let db = db.as_ref().ok_or("Database not initialized")?;

    // Get existing debits
    let debits = db.get_debits().map_err(|e| e.to_string())?;
    let existing_debit = debits.iter()
        .find(|d| d.get("id").and_then(|v| v.as_i64()) == Some(id))
        .cloned()
        .ok_or("Debit not found")?;

    let debit = crate::database::Debit {
        id,
        sender_id: debit_data.get("sender_id").and_then(|v| v.as_i64())
            .or_else(|| existing_debit.get("sender_id").and_then(|v| v.as_i64())),
        receiver_id: debit_data.get("receiver_id").and_then(|v| v.as_i64())
            .or_else(|| existing_debit.get("receiver_id").and_then(|v| v.as_i64()))
            .unwrap_or(0),
        shipping_id: debit_data.get("shipping_id").and_then(|v| v.as_i64())
            .or_else(|| existing_debit.get("shipping_id").and_then(|v| v.as_i64())),
        amount: debit_data.get("amount").and_then(|v| v.as_f64())
            .or_else(|| existing_debit.get("amount").and_then(|v| v.as_f64()))
            .unwrap_or(0.0),
        currency: debit_data.get("currency").and_then(|v| v.as_str())
            .or_else(|| existing_debit.get("currency").and_then(|v| v.as_str()))
            .unwrap_or("Dollar")
            .to_string(),
        note: debit_data.get("note").and_then(|v| v.as_str())
            .map(|s| s.to_string())
            .or_else(|| existing_debit.get("note").and_then(|v| v.as_str()).map(|s| s.to_string())),
        transaction_date: debit_data.get("transaction_date").and_then(|v| v.as_str())
            .map(|s| s.to_string())
            .or_else(|| existing_debit.get("transaction_date").and_then(|v| v.as_str()).map(|s| s.to_string())),
        total_debit: debit_data.get("total_debit").and_then(|v| v.as_f64())
            .or_else(|| existing_debit.get("total_debit").and_then(|v| v.as_f64())),
        created_at: existing_debit.get("created_at").and_then(|v| v.as_str()).unwrap_or("").to_string(),
    };

    db.update_debit(id, &debit).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_debit(
    id: i64,
    state: State<'_, DatabaseState>
) -> Result<(), String> {
    let db = state.0.lock().unwrap();
    let db = db.as_ref().ok_or("Database not initialized")?;
    db.delete_debit(id).map_err(|e| e.to_string())
}

// Room commands
#[tauri::command]
pub async fn get_rooms(state: State<'_, DatabaseState>) -> Result<Vec<Room>, String> {
    let db = state.0.lock().unwrap();
    let db = db.as_ref().ok_or("Database not initialized")?;
    db.get_rooms().map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_room(
    room_data: serde_json::Value,
    state: State<'_, DatabaseState>
) -> Result<Room, String> {
    let db = state.0.lock().unwrap();
    let db = db.as_ref().ok_or("Database not initialized")?;

    let create_room: CreateRoom = serde_json::from_value(room_data)
        .map_err(|e| format!("Invalid room data: {}", e))?;

    db.create_room(&create_room).map_err(|e| e.to_string())
}

// Store product commands
#[tauri::command]
pub async fn get_store_products(state: State<'_, DatabaseState>) -> Result<Vec<StoreProduct>, String> {
    let db = state.0.lock().unwrap();
    let db = db.as_ref().ok_or("Database not initialized")?;
    db.get_store_products().map_err(|e| e.to_string())
}

// File upload command (placeholder for future implementation)
#[tauri::command]
pub async fn upload_file(file_path: String) -> Result<String, String> {
    // For now, just return the file path
    // In a real implementation, you'd handle file copying/uploading to app data directory
    Ok(file_path)
}

// Select storage directory command
#[tauri::command]
pub async fn select_storage_directory(app_handle: tauri::AppHandle) -> Result<String, String> {
    use tauri_plugin_dialog::DialogExt;

    let selected_path = app_handle
        .dialog()
        .file()
        .set_directory(".")
        .blocking_pick_folder();

    match selected_path {
        Some(path) => Ok(path.to_string()),
        None => Err("No directory selected".to_string()),
    }
}

#[tauri::command]
pub async fn backup_database(
    target_path: String,
    state: State<'_, DatabaseState>
) -> Result<String, String> {
    let db = state.0.lock().unwrap();
    let db = db.as_ref().ok_or("Database not initialized")?;

    db.backup_to(&target_path).map_err(|e| e.to_string())?;
    Ok("Backup created successfully".to_string())
}
