mod database;
mod commands;
mod error;

use commands::DatabaseState;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .plugin(tauri_plugin_log::Builder::default().build())
    .plugin(tauri_plugin_dialog::init())
    .manage(DatabaseState(Default::default()))
    .invoke_handler(tauri::generate_handler![
      commands::check_setup_status,
      commands::initialize_database,
      commands::get_products,
      commands::create_product,
      commands::update_product,
      commands::delete_product,
      commands::get_clients,
      commands::create_client,
      commands::update_client,
      commands::delete_client,
      commands::get_shipping,
      commands::get_shipping_items,
      commands::create_shipping,
      commands::create_shipping_with_items,
      commands::create_shipping_with_products,
      commands::update_shipping,
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
      commands::backup_database,
      commands::save_image_file,
      commands::resolve_image_path,
      commands::get_image_data_url,
    ])
    .setup(|app| {
      let app_handle = app.handle();
      let state = app_handle.state::<DatabaseState>();
      if let Err(e) = commands::initialize_database_blocking(app_handle, &state) {
        log::error!("Failed to initialize database: {}", e);
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
