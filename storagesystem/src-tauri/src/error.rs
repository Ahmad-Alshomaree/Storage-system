use serde::Serialize;

#[derive(Debug, thiserror::Error)]
#[allow(dead_code)]
pub enum AppError {
    #[error("Database error: {0}")]
    Database(#[from] rusqlite::Error),

    #[error("Migration error: {0}")]
    Migration(#[from] rusqlite_migration::Error),

    #[error("I/O error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Serialization error: {0}")]
    Json(#[from] serde_json::Error),

    #[error("Entity not found: {0}")]
    NotFound(String),

    #[error("Duplicate unique key: {0}")]
    DuplicateKey(String),

    #[error("Validation failed: {0}")]
    Validation(String),

    #[error("Database is not initialized")]
    Uninitialized,

    #[error("Transaction error: {0}")]
    Transaction(String),
}

#[derive(Serialize)]
pub struct ErrorPayload {
    pub code: String,
    pub message: String,
    pub details: Option<String>,
}

impl Serialize for AppError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let (code, message) = match self {
            AppError::NotFound(msg) => ("NOT_FOUND", msg.as_str()),
            AppError::DuplicateKey(msg) => ("DUPLICATE_KEY", msg.as_str()),
            AppError::Validation(msg) => ("VALIDATION_FAILED", msg.as_str()),
            AppError::Uninitialized => ("UNINITIALIZED", "Database is not connected"),
            AppError::Transaction(msg) => ("TRANSACTION_ERROR", msg.as_str()),
            AppError::Database(err) => match err {
                rusqlite::Error::SqliteFailure(ffi_err, desc) => {
                    // SQLite error code 2067 (SQLITE_CONSTRAINT_UNIQUE) or 1555 (SQLITE_CONSTRAINT_PRIMARYKEY)
                    if ffi_err.extended_code == 2067 || ffi_err.extended_code == 1555 {
                        ("DUPLICATE_KEY", "A record with this identifier already exists")
                    } else if ffi_err.extended_code == 787 {
                        ("FOREIGN_KEY_VIOLATION", "Referenced relation or record does not exist")
                    } else {
                        ("DATABASE_ERROR", desc.as_deref().unwrap_or("A database error occurred"))
                    }
                }
                rusqlite::Error::QueryReturnedNoRows => ("NOT_FOUND", "Record not found"),
                _ => ("DATABASE_ERROR", "A database error occurred"),
            },
            AppError::Io(_) => ("IO_ERROR", "A filesystem error occurred"),
            AppError::Json(_) => ("JSON_ERROR", "Data formatting error"),
            AppError::Migration(_) => ("MIGRATION_ERROR", "Database schema migration failed"),
        };

        ErrorPayload {
            code: code.to_string(),
            message: message.to_string(),
            details: Some(self.to_string()),
        }
        .serialize(serializer)
    }
}
