use sqlx::{Pool, Sqlite};

use crate::repositories::user::UserRepositry;

use self::db::init_pool;

pub mod db;

#[derive(Clone)]
pub struct Modules {
    pub pool: Pool<Sqlite>,
    pub user_repo: UserRepositry,
}

impl Modules {
    pub async fn new() -> Self {
        let pool = init_pool("./tmp/dev.db")
            .await
            .expect("failed to open ./tmp/dev.db");

        let user_repo = UserRepositry::new(pool.clone());

        Self { pool, user_repo }
    }
}
