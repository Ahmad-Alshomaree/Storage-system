use crate::database::{Database, Product, Client, Shipping, Debit, Room, StoreProduct};
use tauri::{AppHandle, State};
use std::sync::Mutex;

// Database state wrapper for Tauri
pub struct DatabaseState(pub Mutex<Option<Database>>);

// Initialize database command (blocking version for setup)
pub fn initialize_database_blocking(app_handle: AppHandle) -> Result<(), String> {
    let db = Database::new(&app_handle).map_err(|e| e.to_string())?;
    // For now, just ensure database can be created
    // In a real app, you'd store this in a global state
    drop(db); // Explicitly drop to avoid unused variable warning
    Ok(())
}

// Initialize database command (async version for IPC)
#[tauri::command]
pub async fn initialize_database(app_handle: AppHandle, state: State<'_, DatabaseState>) -> Result<(), String> {
    let db = Database::new(&app_handle).map_err(|e| e.to_string())?;
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

    // Parse the product data
    let product: Product = serde_json::from_value(product_data)
        .map_err(|e| format!("Invalid product data: {}", e))?;

    db.create_product(&product).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn delete_product(
    _id: i64,
    state: State<'_, DatabaseState>
) -> Result<(), String> {
    let db = state.0.lock().unwrap();
    let _db = db.as_ref().ok_or("Database not initialized")?;

    // For now, this is a placeholder - we'd need to implement delete logic in database.rs
    // This would require updating the database.rs file with delete methods
    Err("Delete product not implemented yet".to_string())
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

    let client: Client = serde_json::from_value(client_data)
        .map_err(|e| format!("Invalid client data: {}", e))?;

    db.create_client(&client).map_err(|e| e.to_string())
}

// Shipping commands
#[tauri::command]
pub async fn get_shipping(state: State<'_, DatabaseState>) -> Result<Vec<Shipping>, String> {
    let db = state.0.lock().unwrap();
    let db = db.as_ref().ok_or("Database not initialized")?;
    db.get_shipping().map_err(|e| e.to_string())
}

// Debit commands
#[tauri::command]
pub async fn get_debits(state: State<'_, DatabaseState>) -> Result<Vec<Debit>, String> {
    let db = state.0.lock().unwrap();
    let db = db.as_ref().ok_or("Database not initialized")?;
    db.get_debits().map_err(|e| e.to_string())
}

// Room commands
#[tauri::command]
pub async fn get_rooms(state: State<'_, DatabaseState>) -> Result<Vec<Room>, String> {
    let db = state.0.lock().unwrap();
    let db = db.as_ref().ok_or("Database not initialized")?;
    db.get_rooms().map_err(|e| e.to_string())
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
