use crate::database::{
    Client, CreateClient, CreateRoom, CreateShipping, CreateShippingItem, Database, Product, Room,
    Shipping, ShippingItem, StoreProduct, Debit,
};
use crate::error::AppError;
use std::sync::Mutex;
use tauri::{AppHandle, State};

// Database state wrapper for Tauri
pub struct DatabaseState(pub Mutex<Option<Database>>);

// Initialize database command (blocking version for setup)
pub fn initialize_database_blocking(app_handle: &AppHandle, state: &DatabaseState) -> Result<(), AppError> {
    let db = Database::new_with_path(app_handle, None)?;
    if let Ok(mut guard) = state.0.lock() {
        *guard = Some(db);
    }
    Ok(())
}

// Check if database is initialized and ready
#[tauri::command]
pub async fn check_setup_status(state: State<'_, DatabaseState>) -> Result<bool, AppError> {
    let db_guard = state.0.lock().map_err(|_| AppError::Uninitialized)?;
    Ok(db_guard.is_some())
}

// Initialize database command (async version for IPC)
#[tauri::command]
pub async fn initialize_database(
    app_handle: AppHandle,
    state: State<'_, DatabaseState>,
    storage_path: Option<String>,
) -> Result<(), AppError> {
    let path_ref = storage_path.as_deref().filter(|s| !s.trim().is_empty());
    let db = Database::new_with_path(&app_handle, path_ref)?;
    *state.0.lock().map_err(|_| AppError::Uninitialized)? = Some(db);
    Ok(())
}

// Product commands
#[tauri::command]
pub async fn get_products(state: State<'_, DatabaseState>) -> Result<Vec<Product>, AppError> {
    let db_guard = state.0.lock().map_err(|_| AppError::Uninitialized)?;
    let db = db_guard.as_ref().ok_or(AppError::Uninitialized)?;
    db.get_products()
}

#[tauri::command]
pub async fn create_product(
    product_data: serde_json::Value,
    state: State<'_, DatabaseState>,
) -> Result<Product, AppError> {
    let mut db_guard = state.0.lock().map_err(|_| AppError::Uninitialized)?;
    let db = db_guard.as_mut().ok_or(AppError::Uninitialized)?;

    let box_code = product_data
        .get("box_code")
        .and_then(|v| v.as_str())
        .ok_or_else(|| AppError::Validation("Missing required field: box_code".to_string()))?
        .trim()
        .to_string();

    if box_code.is_empty() {
        return Err(AppError::Validation("box_code cannot be empty".to_string()));
    }

    let product = Product {
        id: 0,
        shipping_id: product_data.get("shipping_id").and_then(|v| v.as_i64()),
        item_no: product_data.get("item_no").and_then(|v| v.as_str()).map(|s| s.to_string()),
        box_code,
        product_name: product_data.get("product_name").and_then(|v| v.as_str()).map(|s| s.to_string()),
        cost: product_data
            .get("cost")
            .and_then(|v| v.as_f64())
            .or_else(|| product_data.get("original_price").and_then(|v| v.as_f64()))
            .unwrap_or(0.0),
        selling_price: product_data.get("selling_price").and_then(|v| v.as_f64()).unwrap_or(0.0),
        storage: product_data.get("storage").and_then(|v| v.as_str()).map(|s| s.to_string()),
        weight: product_data.get("weight").and_then(|v| v.as_f64()),
        image: product_data.get("image").and_then(|v| v.as_str()).map(|s| s.to_string()),
        pice_per_box: product_data.get("pice_per_box").and_then(|v| v.as_i64()).unwrap_or(1),
        total_pices: product_data
            .get("total_pices")
            .and_then(|v| v.as_i64())
            .or_else(|| product_data.get("Total_pices").and_then(|v| v.as_i64()))
            .unwrap_or(0),
        total_cost: product_data
            .get("total_cost")
            .and_then(|v| v.as_f64())
            .or_else(|| product_data.get("total_original_price").and_then(|v| v.as_f64()))
            .unwrap_or(0.0),
        size_of_box: product_data.get("size_of_box").and_then(|v| v.as_f64()).unwrap_or(0.0),
        total_box_size: product_data.get("total_box_size").and_then(|v| v.as_f64()).unwrap_or(0.0),
        number_of_boxes: product_data.get("number_of_boxes").and_then(|v| v.as_i64()).unwrap_or(1),
        extracted_pieces: product_data.get("extracted_pieces").and_then(|v| v.as_i64()).unwrap_or(0),
        status: product_data.get("status").and_then(|v| v.as_str()).unwrap_or("available").to_string(),
        grope_item_price: product_data.get("grope_item_price").and_then(|v| v.as_f64()),
        currency: product_data.get("currency").and_then(|v| v.as_str()).unwrap_or("Dollar").to_string(),
        note: product_data.get("note").and_then(|v| v.as_str()).map(|s| s.to_string()),
        created_at: product_data
            .get("created_at")
            .and_then(|v| v.as_str())
            .map(|s| s.to_string())
            .or_else(|| Some(chrono::Utc::now().to_rfc3339())),
        updated_at: product_data
            .get("updated_at")
            .and_then(|v| v.as_str())
            .map(|s| s.to_string())
            .or_else(|| Some(chrono::Utc::now().to_rfc3339())),
    };

    db.create_product(&product)
}

#[tauri::command]
pub async fn update_product(
    id: i64,
    product_data: serde_json::Value,
    state: State<'_, DatabaseState>,
) -> Result<Product, AppError> {
    let mut db_guard = state.0.lock().map_err(|_| AppError::Uninitialized)?;
    let db = db_guard.as_mut().ok_or(AppError::Uninitialized)?;

    let existing = db.get_product_by_id(id)?;

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
        updated_at: Some(chrono::Utc::now().to_rfc3339()),
    };

    db.update_product(id, &updated)
}

#[tauri::command]
pub async fn delete_product(
    id: i64,
    state: State<'_, DatabaseState>,
) -> Result<(), AppError> {
    let mut db_guard = state.0.lock().map_err(|_| AppError::Uninitialized)?;
    let db = db_guard.as_mut().ok_or(AppError::Uninitialized)?;
    db.delete_product(id)
}

// Client commands
#[tauri::command]
pub async fn get_clients(state: State<'_, DatabaseState>) -> Result<Vec<Client>, AppError> {
    let db_guard = state.0.lock().map_err(|_| AppError::Uninitialized)?;
    let db = db_guard.as_ref().ok_or(AppError::Uninitialized)?;
    db.get_clients()
}

#[tauri::command]
pub async fn create_client(
    client_data: serde_json::Value,
    state: State<'_, DatabaseState>,
) -> Result<Client, AppError> {
    let mut db_guard = state.0.lock().map_err(|_| AppError::Uninitialized)?;
    let db = db_guard.as_mut().ok_or(AppError::Uninitialized)?;

    let create_client: CreateClient = serde_json::from_value(client_data)
        .map_err(|e| AppError::Validation(format!("Invalid client data: {}", e)))?;

    let client = Client {
        id: 0,
        client_name: create_client.client_name,
        phone_number: create_client.phone_number,
        shipping_id: create_client.shipping_id,
        history: create_client.history,
        debt: create_client.debt,
        total_debts: None,
    };

    db.create_client(&client)
}

#[tauri::command]
pub async fn update_client(
    id: i64,
    client_data: serde_json::Value,
    state: State<'_, DatabaseState>,
) -> Result<Client, AppError> {
    let mut db_guard = state.0.lock().map_err(|_| AppError::Uninitialized)?;
    let db = db_guard.as_mut().ok_or(AppError::Uninitialized)?;
    db.update_client(id, &client_data)
}

#[tauri::command]
pub async fn delete_client(
    id: i64,
    state: State<'_, DatabaseState>,
) -> Result<(), AppError> {
    let mut db_guard = state.0.lock().map_err(|_| AppError::Uninitialized)?;
    let db = db_guard.as_mut().ok_or(AppError::Uninitialized)?;
    db.delete_client(id)
}

// Shipping commands
#[tauri::command]
pub async fn get_shipping(state: State<'_, DatabaseState>) -> Result<Vec<serde_json::Value>, AppError> {
    let db_guard = state.0.lock().map_err(|_| AppError::Uninitialized)?;
    let db = db_guard.as_ref().ok_or(AppError::Uninitialized)?;
    db.get_shipping()
}

#[tauri::command]
pub async fn create_shipping(
    shipping_data: serde_json::Value,
    state: State<'_, DatabaseState>,
) -> Result<Shipping, AppError> {
    let mut db_guard = state.0.lock().map_err(|_| AppError::Uninitialized)?;
    let db = db_guard.as_mut().ok_or(AppError::Uninitialized)?;

    let create_shipping: CreateShipping = serde_json::from_value(shipping_data)
        .map_err(|e| AppError::Validation(format!("Invalid shipping data: {}", e)))?;

    let shipping = Shipping {
        id: 0,
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
        created_at: String::new(),
    };

    db.create_shipping(&shipping)
}

#[tauri::command]
pub async fn update_shipping(
    id: i64,
    shipping_data: serde_json::Value,
    state: State<'_, DatabaseState>,
) -> Result<Shipping, AppError> {
    let mut db_guard = state.0.lock().map_err(|_| AppError::Uninitialized)?;
    let db = db_guard.as_mut().ok_or(AppError::Uninitialized)?;
    db.update_shipping(id, &shipping_data)
}

#[tauri::command]
pub async fn get_shipping_items(
    shipping_id: i64,
    state: State<'_, DatabaseState>,
) -> Result<Vec<ShippingItem>, AppError> {
    let db_guard = state.0.lock().map_err(|_| AppError::Uninitialized)?;
    let db = db_guard.as_ref().ok_or(AppError::Uninitialized)?;
    db.get_shipping_items(shipping_id)
}

#[tauri::command]
pub async fn create_shipping_with_items(
    shipping_data: serde_json::Value,
    items: Vec<CreateShippingItem>,
    state: State<'_, DatabaseState>,
) -> Result<Shipping, AppError> {
    let mut db_guard = state.0.lock().map_err(|_| AppError::Uninitialized)?;
    let db = db_guard.as_mut().ok_or(AppError::Uninitialized)?;

    let create_shipping: CreateShipping = serde_json::from_value(shipping_data)
        .map_err(|e| AppError::Validation(format!("Invalid shipping data: {}", e)))?;

    let shipping = Shipping {
        id: 0,
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
        created_at: String::new(),
    };

    db.create_shipping_with_items(&shipping, &items)
}

#[tauri::command]
pub async fn create_shipping_with_products(
    shipping_data: serde_json::Value,
    products: Vec<serde_json::Value>,
    state: State<'_, DatabaseState>,
) -> Result<Shipping, AppError> {
    let mut db_guard = state.0.lock().map_err(|_| AppError::Uninitialized)?;
    let db = db_guard.as_mut().ok_or(AppError::Uninitialized)?;

    let create_shipping: CreateShipping = serde_json::from_value(shipping_data)
        .map_err(|e| AppError::Validation(format!("Invalid shipping data: {}", e)))?;

    let shipping = Shipping {
        id: 0,
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
        created_at: String::new(),
    };

    db.create_shipping_with_products(&shipping, &products)
}

#[tauri::command]
pub async fn delete_shipping(
    id: i64,
    state: State<'_, DatabaseState>,
) -> Result<(), AppError> {
    let mut db_guard = state.0.lock().map_err(|_| AppError::Uninitialized)?;
    let db = db_guard.as_mut().ok_or(AppError::Uninitialized)?;
    db.delete_shipping(id)
}

// Debit commands
#[tauri::command]
pub async fn create_debit(
    debit_data: serde_json::Value,
    state: State<'_, DatabaseState>,
) -> Result<Debit, AppError> {
    let mut db_guard = state.0.lock().map_err(|_| AppError::Uninitialized)?;
    let db = db_guard.as_mut().ok_or(AppError::Uninitialized)?;

    let receiver_id = debit_data
        .get("receiver_id")
        .and_then(|v| v.as_i64())
        .ok_or_else(|| AppError::Validation("receiver_id is required".to_string()))?;

    let debit = Debit {
        id: 0,
        sender_id: debit_data.get("sender_id").and_then(|v| v.as_i64()),
        receiver_id,
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

    db.create_debit(&debit)
}

#[tauri::command]
pub async fn get_debits(state: State<'_, DatabaseState>) -> Result<Vec<serde_json::Value>, AppError> {
    let db_guard = state.0.lock().map_err(|_| AppError::Uninitialized)?;
    let db = db_guard.as_ref().ok_or(AppError::Uninitialized)?;
    db.get_debits()
}

#[tauri::command]
pub async fn update_debit(
    id: i64,
    debit_data: serde_json::Value,
    state: State<'_, DatabaseState>,
) -> Result<Debit, AppError> {
    let mut db_guard = state.0.lock().map_err(|_| AppError::Uninitialized)?;
    let db = db_guard.as_mut().ok_or(AppError::Uninitialized)?;

    let existing = db.get_debit_by_id(id)?;

    let debit = Debit {
        id,
        sender_id: debit_data.get("sender_id").and_then(|v| v.as_i64()).or(existing.sender_id),
        receiver_id: debit_data.get("receiver_id").and_then(|v| v.as_i64()).unwrap_or(existing.receiver_id),
        shipping_id: debit_data.get("shipping_id").and_then(|v| v.as_i64()).or(existing.shipping_id),
        amount: debit_data.get("amount").and_then(|v| v.as_f64()).unwrap_or(existing.amount),
        currency: debit_data.get("currency").and_then(|v| v.as_str()).unwrap_or(&existing.currency).to_string(),
        note: debit_data.get("note").and_then(|v| v.as_str()).map(|s| s.to_string()).or(existing.note),
        transaction_date: debit_data.get("transaction_date").and_then(|v| v.as_str()).map(|s| s.to_string()).or(existing.transaction_date),
        total_debit: debit_data.get("total_debit").and_then(|v| v.as_f64()).or(existing.total_debit),
        created_at: existing.created_at,
    };

    db.update_debit(id, &debit)
}

#[tauri::command]
pub async fn delete_debit(
    id: i64,
    state: State<'_, DatabaseState>,
) -> Result<(), AppError> {
    let mut db_guard = state.0.lock().map_err(|_| AppError::Uninitialized)?;
    let db = db_guard.as_mut().ok_or(AppError::Uninitialized)?;
    db.delete_debit(id)
}

// Room commands
#[tauri::command]
pub async fn get_rooms(state: State<'_, DatabaseState>) -> Result<Vec<Room>, AppError> {
    let db_guard = state.0.lock().map_err(|_| AppError::Uninitialized)?;
    let db = db_guard.as_ref().ok_or(AppError::Uninitialized)?;
    db.get_rooms()
}

#[tauri::command]
pub async fn create_room(
    room_data: serde_json::Value,
    state: State<'_, DatabaseState>,
) -> Result<Room, AppError> {
    let mut db_guard = state.0.lock().map_err(|_| AppError::Uninitialized)?;
    let db = db_guard.as_mut().ok_or(AppError::Uninitialized)?;

    let create_room: CreateRoom = serde_json::from_value(room_data)
        .map_err(|e| AppError::Validation(format!("Invalid room data: {}", e)))?;

    db.create_room(&create_room)
}

// Store product commands
#[tauri::command]
pub async fn get_store_products(state: State<'_, DatabaseState>) -> Result<Vec<StoreProduct>, AppError> {
    let db_guard = state.0.lock().map_err(|_| AppError::Uninitialized)?;
    let db = db_guard.as_ref().ok_or(AppError::Uninitialized)?;
    db.get_store_products()
}

// File upload command (placeholder for future implementation)
#[tauri::command]
pub async fn upload_file(file_path: String) -> Result<String, AppError> {
    Ok(file_path)
}

// Select storage directory command
#[tauri::command]
pub async fn select_storage_directory(app_handle: tauri::AppHandle) -> Result<String, AppError> {
    use tauri_plugin_dialog::DialogExt;

    let selected_path = app_handle
        .dialog()
        .file()
        .set_directory(".")
        .blocking_pick_folder();

    match selected_path {
        Some(path) => Ok(path.to_string()),
        None => Err(AppError::Validation("No directory selected".to_string())),
    }
}

#[tauri::command]
pub async fn backup_database(
    target_path: String,
    state: State<'_, DatabaseState>,
) -> Result<String, AppError> {
    let db_guard = state.0.lock().map_err(|_| AppError::Uninitialized)?;
    let db = db_guard.as_ref().ok_or(AppError::Uninitialized)?;

    db.backup_to(&target_path)?;
    Ok("Backup created successfully".to_string())
}

// Media storage subsystem commands
#[tauri::command]
pub async fn save_image_file(
    app_handle: AppHandle,
    file_bytes: Vec<u8>,
    extension: String,
) -> Result<String, AppError> {
    use tauri::Manager;
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| AppError::Validation(e.to_string()))?;

    let images_dir = app_dir.join("product_images");
    std::fs::create_dir_all(&images_dir)?;

    let clean_ext = extension.trim_start_matches('.');
    let file_name = format!("img_{}.{}", uuid::Uuid::new_v4(), clean_ext);
    let file_path = images_dir.join(&file_name);

    std::fs::write(&file_path, &file_bytes)?;

    Ok(format!("product_images/{}", file_name))
}

fn validate_safe_relative_path(image_path: &str) -> Result<&std::path::Path, AppError> {
    let path = std::path::Path::new(image_path);
    for component in path.components() {
        match component {
            std::path::Component::ParentDir | std::path::Component::RootDir | std::path::Component::Prefix(_) => {
                return Err(AppError::Validation("Path traversal or absolute path not allowed".to_string()));
            }
            _ => {}
        }
    }
    Ok(path)
}

#[tauri::command]
pub async fn resolve_image_path(
    app_handle: AppHandle,
    image_path: String,
) -> Result<String, AppError> {
    use tauri::Manager;
    if image_path.starts_with("http://")
        || image_path.starts_with("https://")
        || image_path.starts_with("data:")
        || image_path.starts_with("blob:")
    {
        return Ok(image_path);
    }

    validate_safe_relative_path(&image_path)?;

    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| AppError::Validation(e.to_string()))?;

    let full_path = app_dir.join(&image_path);
    if full_path.exists() {
        Ok(full_path.to_string_lossy().to_string())
    } else {
        Err(AppError::Validation(format!("Image not found at {:?}", full_path)))
    }
}

#[tauri::command]
pub async fn get_image_data_url(
    app_handle: AppHandle,
    image_path: String,
) -> Result<String, AppError> {
    use tauri::Manager;
    use base64::Engine;

    if image_path.starts_with("http://")
        || image_path.starts_with("https://")
        || image_path.starts_with("data:")
        || image_path.starts_with("blob:")
    {
        return Ok(image_path);
    }

    validate_safe_relative_path(&image_path)?;

    let app_dir = app_handle
        .path()
        .app_data_dir()
        .map_err(|e| AppError::Validation(e.to_string()))?;

    let full_path = app_dir.join(&image_path);
    if !full_path.exists() {
        return Err(AppError::Validation(format!("Image file not found: {:?}", full_path)));
    }

    let bytes = std::fs::read(&full_path)?;
    let ext = full_path.extension().and_then(|s| s.to_str()).unwrap_or("png").to_lowercase();
    let mime = match ext.as_str() {
        "png" => "image/png",
        "webp" => "image/webp",
        "gif" => "image/gif",
        "svg" => "image/svg+xml",
        _ => "image/jpeg",
    };

    let encoded = base64::engine::general_purpose::STANDARD.encode(&bytes);
    Ok(format!("data:{};base64,{}", mime, encoded))
}

