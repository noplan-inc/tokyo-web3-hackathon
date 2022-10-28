use anyhow::{Ok, Result};
use sqlx::{Pool, Sqlite};

#[derive(sqlx::FromRow, Debug, Default, Clone, PartialEq, Eq)]
pub struct User {
    id: u32,
    name: String,
    address: String,
}

#[derive(Debug, Clone)]
pub struct UserRepositry {
    pub db: Pool<Sqlite>,
}

impl UserRepositry {
    pub fn new(db: Pool<Sqlite>) -> Self {
        Self { db }
    }

    pub async fn find_by_id(&self, id: u32) -> Result<User> {
        let mut pool = self.db.acquire().await?;

        let user: User = sqlx::query_as("select * from users where id = ?")
            .bind(id)
            .fetch_one(&mut pool)
            .await?;

        Ok(user)
    }

    pub async fn find_all(&self) -> Result<Vec<User>> {
        let mut pool = self.db.acquire().await?;

        let users: Vec<User> = sqlx::query_as("select * from users")
            .fetch_all(&mut pool)
            .await?;

        Ok(users)
    }

    pub async fn count(&self) -> Result<u32> {
        let mut pool = self.db.acquire().await?;

        let user_count: u32 = sqlx::query_scalar("select count(*) from users")
            .fetch_one(&mut pool)
            .await?;

        Ok(user_count)
    }

    pub async fn create(&self, name: &String, address: &String) -> Result<()> {
        let mut pool = self.db.acquire().await?;

        sqlx::query("INSERT INTO Users(name, address) VALUES(?, ?)")
            .bind(name)
            .bind(address)
            .execute(&mut pool)
            .await?;
        Ok(())
    }

    pub async fn create2(&self, name: String, address: String) -> Result<()> {
        let mut pool = self.db.acquire().await?;

        sqlx::query("INSERT INTO Users(name, address) VALUES(?, ?)")
            .bind(name)
            .bind(address)
            .execute(&mut pool)
            .await?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use rand::Rng;
    use sqlx::{Pool, Sqlite};

    use super::UserRepositry;
    use crate::{modules::db::init_pool, repositories::user::User};

    struct SetUpper {
        db_id: u16,
    }
    impl Drop for SetUpper {
        fn drop(&mut self) {
            std::fs::remove_file(format!("./tmp/{}.db", self.db_id)).unwrap();
        }
    }

    fn setup(db_id: u16) -> SetUpper {
        SetUpper { db_id }
    }

    fn fixture_user1() -> User {
        User {
            id: 1,
            name: "alice".to_string(),
            address: "0x6e923D9c7dDe163265cB7a2B1D9639F74D1529B8".to_string(),
        }
    }

    async fn init_db() -> (Pool<Sqlite>, u16) {
        let mut r = rand::thread_rng();
        let rand: u16 = r.gen_range(0..10000);

        let pool = init_pool(format!("./tmp/{}.db", rand).as_str())
            .await
            .unwrap();

        #[warn(unused_must_use)]
        sqlx::migrate!("./migrations/").run(&pool).await;

        let mut conn = pool.acquire().await.unwrap();

        sqlx::query("INSERT INTO Users(name, address) VALUES('alice', '0x6e923D9c7dDe163265cB7a2B1D9639F74D1529B8')").execute(&mut conn).await.unwrap();

        (pool, rand)
    }

    #[tokio::test]
    async fn test_find_by_id() {
        let (db, db_id) = init_db().await;
        let setupper = setup(db_id);
        let user_repo = UserRepositry::new(db);

        assert_eq!(user_repo.count().await.unwrap(), 1);

        let user = user_repo.find_by_id(1).await.unwrap();
        assert_eq!(user, fixture_user1());
    }

    #[tokio::test]
    async fn test_find_all() {
        let (db, db_id) = init_db().await;
        let setupper = setup(db_id);
        let user_repo = UserRepositry::new(db);

        assert_eq!(user_repo.count().await.unwrap(), 1);
    }

    #[tokio::test]
    async fn test_count() {
        let (db, db_id) = init_db().await;
        let setupper = setup(db_id);
        let user_repo = UserRepositry::new(db);

        assert_eq!(user_repo.count().await.unwrap(), 1);
    }

    #[tokio::test]
    async fn test_create() {
        let (db, db_id) = init_db().await;
        let setupper = setup(db_id);
        let user_repo = UserRepositry::new(db);

        assert_eq!(user_repo.count().await.unwrap(), 1);
    }
}
