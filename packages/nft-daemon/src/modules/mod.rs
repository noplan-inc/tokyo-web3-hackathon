use sqlx::{Pool, Sqlite};

use self::db::init_pool;

mod db;

#[derive(Clone)]
pub struct Modules {
    pub pool: Pool<Sqlite>, // db:
}

impl Modules {
    pub async fn new() -> Self {
        let pool = init_pool("./tmp/test.db")
            .await
            .expect("failed to open test.db");

        Self { pool }
    }
}
