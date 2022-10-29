use sqlx::{Pool, Sqlite};

use crate::repositories::{user::UserRepositry, website::WebsiteRepositry};

use self::db::init_pool;

pub mod db;

#[derive(Clone)]
pub struct Modules {
    pub pool: Pool<Sqlite>,
    pub user_repo: UserRepositry,
    pub web_repo: WebsiteRepositry,
}

impl Modules {
    pub async fn new() -> Self {
        let pool = init_pool("./tmp/dev.db")
            .await
            .expect("failed to open ./tmp/dev.db");

        let user_repo = UserRepositry::new(pool.clone());
        let web_repo = WebsiteRepositry::new(pool.clone());

        Self {
            pool,
            user_repo,
            web_repo,
        }
    }
}
