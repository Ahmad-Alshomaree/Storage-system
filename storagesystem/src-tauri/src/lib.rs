mod database;
mod commands;

use commands::DatabaseState;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_log::Builder::default().build())
    .plugin(tauri_plugin_dialog::init())
    .manage(DatabaseState(Default::default()))
    .invoke_handler(tauri::generate_handler![
      commands::initialize_database,
      commands::get_products,
      commands::create_product,
      commands::delete_product,
      commands::get_clients,
      commands::create_client,
      commands::delete_client,
      commands::get_shipping,
      commands::create_shipping,
      commands::delete_shipping,
      commands::get_debits,
      commands::create_debit,
      commands::update_debit,
      commands::delete_debit,
      commands::get_rooms,
      commands::create_room,
      commands::get_store_products,
      commands::upload_file,
      commands::select_storage_directory,
    ])
    .setup(|app| {
      // Initialize database on app startup
      let app_handle = app.handle().clone();
      if let Err(e) = commands::initialize_database_blocking(app_handle) {
        log::error!("Failed to initialize database: {}", e);
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
