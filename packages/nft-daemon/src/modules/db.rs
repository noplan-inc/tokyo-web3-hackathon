use sqlx::sqlite::{SqliteConnectOptions, SqlitePool, SqlitePoolOptions};

pub async fn init_pool(database_url: &str) -> Result<SqlitePool, sqlx::Error> {
    let options = SqliteConnectOptions::new()
        .filename(database_url)
        .create_if_missing(true);

    SqlitePoolOptions::new()
        .acquire_timeout(std::time::Duration::from_secs(1))
        .connect_with(options)
        .await
}
