use crate::database::{Database, Product, Client, CreateClient, Shipping, CreateShipping, Room, CreateRoom, StoreProduct};
use tauri::{AppHandle, State};
use std::sync::Mutex;

// Database state wrapper for Tauri
pub struct DatabaseState(pub Mutex<Option<Database>>);

// Initialize database command (blocking version for setup)
pub fn initialize_database_blocking(app_handle: AppHandle) -> Result<(), String> {
    // Use current directory + database folder to avoid Tauri's file watcher
    let db_path = std::env::current_dir()
        .map_err(|e| format!("Failed to get current directory: {}", e))?
        .join("database");

    let db = Database::new_with_path(&app_handle, Some(db_path.to_str().unwrap())).map_err(|e| e.to_string())?;
    // For now, just ensure database can be created
    // In a real app, you'd store this in a global state
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
    let db = if let Some(path) = storage_path {
        Database::new_with_path(&app_handle, Some(&path)).map_err(|e| e.to_string())?
    } else {
        // Use current directory + database folder to avoid Tauri's file watcher
        let db_path = std::env::current_dir()
            .map_err(|e| format!("Failed to get current directory: {}", e))?
            .join("database");
        Database::new_with_path(&app_handle, Some(db_path.to_str().unwrap())).map_err(|e| e.to_string())?
    };
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

    // Parse the product data
    let product: Product = serde_json::from_value(product_data)
        .map_err(|e| format!("Invalid product data: {}", e))?;

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

    // Get existing product
    let products = db.get_products().map_err(|e| e.to_string())?;
    let existing_product = products.into_iter().find(|p| p.id == id)
        .ok_or("Product not found")?;

    // Parse update data
    let updates: serde_json::Value = product_data;

    // Create updated product by merging existing with updates
    let mut updated_product = existing_product.clone();

    if let Some(name) = updates.get("product_name").and_then(|v| v.as_str()) {
        updated_product.product_name = Some(name.to_string());
    }
    if let Some(box_code) = updates.get("box_code").and_then(|v| v.as_str()) {
        updated_product.box_code = box_code.to_string();
    }
    if let Some(selling_price) = updates.get("selling_price").and_then(|v| v.as_f64()) {
        updated_product.selling_price = selling_price;
    }
    if let Some(grope_item_price) = updates.get("Grope_Item_price").and_then(|v| v.as_f64()) {
        updated_product.grope_item_price = Some(grope_item_price);
    }
    if let Some(storage) = updates.get("storage").and_then(|v| v.as_str()) {
        updated_product.storage = Some(storage.to_string());
    }
    if let Some(number_of_boxes) = updates.get("number_of_boxes").and_then(|v| v.as_f64()) {
        updated_product.number_of_boxes = number_of_boxes as i64;
    }
    if let Some(pice_per_box) = updates.get("pice_per_box").and_then(|v| v.as_i64()) {
        updated_product.pice_per_box = pice_per_box;
    }
    if let Some(extracted_pieces) = updates.get("extracted_pieces").and_then(|v| v.as_i64()) {
        updated_product.extracted_pieces = extracted_pieces;
    }
    if let Some(status) = updates.get("status").and_then(|v| v.as_str()) {
        updated_product.status = status.to_string();
    }

    // Update the product in database
    db.create_product(&updated_product).map_err(|e| {
        println!("Database error: {}", e);
        e.to_string()
    })
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

    // Get existing client
    let clients = db.get_clients().map_err(|e| e.to_string())?;
    let existing_client = clients.into_iter().find(|c| c.id == id)
        .ok_or("Client not found")?;

    // Parse update data
    let updates: serde_json::Value = client_data;

    // Create updated client by merging existing with updates
    let mut updated_client = existing_client.clone();

    if let Some(client_name) = updates.get("client_name").and_then(|v| v.as_str()) {
        updated_client.client_name = client_name.to_string();
    }
    if let Some(phone_number) = updates.get("phone_number").and_then(|v| v.as_str()) {
        updated_client.phone_number = Some(phone_number.to_string());
    }
    if let Some(shipping_id) = updates.get("shipping_id").and_then(|v| v.as_i64()) {
        updated_client.shipping_id = Some(shipping_id);
    }
    if let Some(history) = updates.get("history").and_then(|v| v.as_str()) {
        updated_client.history = Some(history.to_string());
    }

    // For client updates, we need to create a new record since we don't have a direct update method
    // This is a workaround - in a real app, you'd add an update_client method to the database
    let create_client = CreateClient {
        client_name: updated_client.client_name.clone(),
        phone_number: updated_client.phone_number.clone(),
        shipping_id: updated_client.shipping_id,
        history: updated_client.history.clone(),
        debt: updated_client.debt,
    };

    let create_data = serde_json::to_value(create_client)
        .map_err(|e| format!("Failed to serialize client data: {}", e))?;

    // Delete old client and create new one
    db.delete_client(id).map_err(|e| e.to_string())?;
    db.create_client(&Client {
        id: 0, // Will be set by database
        client_name: updated_client.client_name,
        phone_number: updated_client.phone_number,
        shipping_id: updated_client.shipping_id,
        history: updated_client.history,
        debt: updated_client.debt,
        total_debts: updated_client.total_debts,
    }).map_err(|e| e.to_string())
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

    // Get existing shipping
    let shipping_records = db.get_shipping().map_err(|e| e.to_string())?;
    let existing_shipping: Shipping = shipping_records.iter()
        .find(|s| s.get("id").and_then(|v| v.as_i64()) == Some(id))
        .and_then(|s| serde_json::from_value(s.clone()).ok())
        .ok_or("Shipping record not found")?;

    // Parse update data
    let updates: serde_json::Value = shipping_data;

    // Create updated shipping by merging existing with updates
    let mut updated_shipping = existing_shipping.clone();

    if let Some(r#type) = updates.get("type").and_then(|v| v.as_str()) {
        updated_shipping.r#type = r#type.to_string();
    }
    if let Some(shipping_date) = updates.get("shipping_date").and_then(|v| v.as_str()) {
        updated_shipping.shipping_date = shipping_date.to_string();
    }
    if let Some(receiving_date) = updates.get("receiving_date").and_then(|v| v.as_str()) {
        updated_shipping.receiving_date = receiving_date.to_string();
    }
    if let Some(receiver_client_id) = updates.get("receiver_client_id").and_then(|v| v.as_i64()) {
        updated_shipping.receiver_client_id = receiver_client_id;
    }
    if let Some(sender_client_id) = updates.get("sender_client_id").and_then(|v| v.as_i64()) {
        updated_shipping.sender_client_id = sender_client_id;
    }
    if let Some(paid) = updates.get("paid").and_then(|v| v.as_f64()) {
        updated_shipping.paid = paid as i64;
    }
    if let Some(ship_price) = updates.get("ship_price").and_then(|v| v.as_f64()) {
        updated_shipping.ship_price = ship_price;
    }
    if let Some(currency) = updates.get("currency").and_then(|v| v.as_str()) {
        updated_shipping.currency = currency.to_string();
    }
    if let Some(note) = updates.get("note").and_then(|v| v.as_str()) {
        updated_shipping.note = Some(note.to_string());
    }

    // For shipping updates, we need to delete and recreate since we don't have a direct update method
    let create_shipping = CreateShipping {
        r#type: updated_shipping.r#type.clone(),
        shipping_date: updated_shipping.shipping_date.clone(),
        receiving_date: updated_shipping.receiving_date.clone(),
        receiver_client_id: updated_shipping.receiver_client_id,
        sender_client_id: updated_shipping.sender_client_id,
        file_path: updated_shipping.file_path.clone(),
        paid: updated_shipping.paid,
        ship_price: updated_shipping.ship_price,
        currency: updated_shipping.currency.clone(),
        note: updated_shipping.note.clone(),
    };

    let create_data = serde_json::to_value(create_shipping)
        .map_err(|e| format!("Failed to serialize shipping data: {}", e))?;

    // Delete old shipping and create new one
    db.delete_shipping(id).map_err(|e| e.to_string())?;
    db.create_shipping(&Shipping {
        id: 0, // Will be set by database
        r#type: updated_shipping.r#type,
        shipping_date: updated_shipping.shipping_date,
        receiving_date: updated_shipping.receiving_date,
        receiver_client_id: updated_shipping.receiver_client_id,
        sender_client_id: updated_shipping.sender_client_id,
        file_path: updated_shipping.file_path,
        paid: updated_shipping.paid,
        ship_price: updated_shipping.ship_price,
        currency: updated_shipping.currency,
        note: updated_shipping.note,
        created_at: updated_shipping.created_at,
    }).map_err(|e| e.to_string())
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
) -> Result<serde_json::Value, String> {
    let db = state.0.lock().unwrap();
    let db = db.as_ref().ok_or("Database not initialized")?;

    // Get existing debit
    let debits = db.get_debits().map_err(|e| e.to_string())?;
    let existing_debit = debits.iter()
        .find(|d| d.get("id").and_then(|v| v.as_i64()) == Some(id))
        .cloned()
        .ok_or("Debit not found")?;

    // Parse update data
    let updates: serde_json::Value = debit_data;

    // Create updated debit by merging existing with updates
    let mut updated_debit = existing_debit.clone();

    if let Some(amount) = updates.get("amount").and_then(|v| v.as_f64()) {
        updated_debit["amount"] = serde_json::json!(amount);
    }
    if let Some(currency) = updates.get("currency").and_then(|v| v.as_str()) {
        updated_debit["currency"] = serde_json::json!(currency);
    }
    if let Some(note) = updates.get("note").and_then(|v| v.as_str()) {
        updated_debit["note"] = serde_json::json!(Some(note));
    }
    if let Some(transaction_date) = updates.get("transaction_date").and_then(|v| v.as_str()) {
        updated_debit["transaction_date"] = serde_json::json!(Some(transaction_date));
    }

    // For debit updates, we need to delete and recreate since we don't have a direct update method
    // This is a workaround - in a real app, you'd add an update_debit method to the database

    // Delete old debit
    db.delete_debit(id).map_err(|e| e.to_string())?;

    // Create new debit
    let new_debit = crate::database::Debit {
        id: 0, // Will be set by database
        sender_id: updated_debit.get("sender_id").and_then(|v| v.as_i64()),
        receiver_id: updated_debit.get("receiver_id").and_then(|v| v.as_i64()).unwrap_or(0),
        shipping_id: updated_debit.get("shipping_id").and_then(|v| v.as_i64()),
        amount: updated_debit.get("amount").and_then(|v| v.as_f64()).unwrap_or(0.0),
        currency: updated_debit.get("currency").and_then(|v| v.as_str()).unwrap_or("Dollar").to_string(),
        note: updated_debit.get("note").and_then(|v| v.as_str()).map(|s| s.to_string()),
        transaction_date: updated_debit.get("transaction_date").and_then(|v| v.as_str()).map(|s| s.to_string()),
        total_debit: updated_debit.get("total_debit").and_then(|v| v.as_f64()),
        created_at: updated_debit.get("created_at").and_then(|v| v.as_str()).unwrap_or("").to_string(),
    };

    db.create_debit(&new_debit).map_err(|e| e.to_string())?;

    // Return the updated debit data
    Ok(updated_debit)
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
