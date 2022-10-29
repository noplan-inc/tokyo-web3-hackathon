use anyhow::{Ok, Result};
use sqlx::{Pool, Sqlite};

#[derive(sqlx::FromRow, Debug, Default, Clone, PartialEq, Eq)]
pub struct User {
    pub id: i64,
    pub name: String,
    pub address: String,
}

impl User {
    fn new(name: String, address: String) -> User {
        Self {
            name,
            address,
            ..Default::default()
        }
    }
}

#[derive(Debug, Clone)]
pub struct UserRepositry {
    pub db: Pool<Sqlite>,
}

impl UserRepositry {
    pub fn new(db: Pool<Sqlite>) -> Self {
        Self { db }
    }

    pub async fn find_by_id(&self, id: i64) -> Result<Option<User>> {
        let mut pool = self.db.acquire().await?;

        let user: Option<User> = sqlx::query_as("select * from users where id = ?")
            .bind(id)
            .fetch_optional(&mut pool)
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

    pub async fn count(&self) -> Result<i64> {
        let mut pool = self.db.acquire().await?;

        let user_count: i64 = sqlx::query_scalar("select count(*) from users")
            .fetch_one(&mut pool)
            .await?;

        Ok(user_count)
    }

    pub async fn create<T>(&self, name: &str, address: &str, id: T) -> Result<User>
    where
        T: Into<Option<i64>>,
    {
        let mut pool = self.db.acquire().await?;

        let _id = id.into();

        let generated_id = if _id.is_none() {
            sqlx::query("INSERT INTO Users(name, address) VALUES(?, ?)")
                .bind(name)
                .bind(address)
                .execute(&mut pool)
                .await?
                .last_insert_rowid()
        } else {
            sqlx::query("INSERT INTO Users(id, name, address) VALUES(?, ?, ?)")
                .bind(_id)
                .bind(name)
                .bind(address)
                .execute(&mut pool)
                .await?
                .last_insert_rowid()
        };

        Ok(User {
            id: generated_id,
            name: name.to_string(),
            address: address.to_string(),
        })
    }

    pub async fn update(&self, id: u32, name: &str, address: &str) -> Result<()> {
        let mut pool = self.db.acquire().await?;

        sqlx::query("UPDATE Users SET name = ?, address = ? WHERE id = ?")
            .bind(name)
            .bind(address)
            .bind(id)
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
            std::fs::remove_file(format!("./tmp/test/{}.db", self.db_id)).unwrap();
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

        let pool = init_pool(format!("./tmp/test/{}.db", rand).as_str())
            .await
            .unwrap();

        let _ = sqlx::migrate!("./migrations/").run(&pool).await;

        let mut conn = pool.acquire().await.unwrap();

        sqlx::query("INSERT INTO Users(name, address) VALUES('alice', '0x6e923D9c7dDe163265cB7a2B1D9639F74D1529B8')").execute(&mut conn).await.unwrap();

        (pool, rand)
    }

    #[tokio::test]
    async fn test_find_by_id() {
        let (db, db_id) = init_db().await;
        let _setupper = setup(db_id);
        let user_repo = UserRepositry::new(db);

        assert_eq!(user_repo.count().await.unwrap(), 1);

        let user = user_repo.find_by_id(1).await.unwrap().unwrap();
        assert_eq!(user, fixture_user1());
    }

    #[tokio::test]
    async fn test_find_by_id2() {
        let (db, db_id) = init_db().await;
        let _setupper = setup(db_id);
        let user_repo = UserRepositry::new(db);

        assert_eq!(user_repo.count().await.unwrap(), 1);

        let user = user_repo.find_by_id(2).await.unwrap();
        assert!(user.is_none());
    }

    #[tokio::test]
    async fn test_find_all() {
        let (db, db_id) = init_db().await;
        let _setupper = setup(db_id);
        let user_repo = UserRepositry::new(db);

        let alice = user_repo.find_by_id(1).await.unwrap().unwrap();

        assert_eq!(user_repo.count().await.unwrap(), 1);

        let name = &"bob".to_string();
        let address = &"0xdeafbeaf...deadbeaf".to_string();

        user_repo
            .create(&name.clone(), &address.clone(), None)
            .await
            .unwrap();

        let users = user_repo.find_all().await.unwrap();

        assert_eq!(users[0], alice);
        assert_eq!(
            users[1],
            User {
                id: 2,
                name: name.to_string(),
                address: address.to_string()
            }
        );
    }

    #[tokio::test]
    async fn test_count() {
        let (db, db_id) = init_db().await;
        let _setupper = setup(db_id);
        let user_repo = UserRepositry::new(db);

        assert_eq!(user_repo.count().await.unwrap(), 1);
    }

    #[tokio::test]
    async fn test_create() {
        let (db, db_id) = init_db().await;
        let _setupper = setup(db_id);
        let user_repo = UserRepositry::new(db);

        assert_eq!(user_repo.count().await.unwrap(), 1);

        let name = &"alice".to_string();
        let address = &"0xdeafbeaf...deadbeaf".to_string();

        user_repo
            .create(&name.clone(), &address.clone(), None)
            .await
            .unwrap();

        assert_eq!(user_repo.count().await.unwrap(), 2);

        let u = user_repo.find_by_id(2).await.unwrap().unwrap();
        assert_eq!(
            u,
            User {
                id: 2,
                name: name.to_string(),
                address: address.to_string()
            }
        )
    }

    #[tokio::test]
    async fn test_update() {
        let (db, db_id) = init_db().await;
        let _setupper = setup(db_id);
        let user_repo = UserRepositry::new(db);

        assert_eq!(user_repo.count().await.unwrap(), 1);

        let name = &"alice2".to_string();
        let address = &"0xdeafbeaf...deadbeaf".to_string();

        user_repo
            .update(1, &name.clone(), &address.clone())
            .await
            .unwrap();

        assert_eq!(user_repo.count().await.unwrap(), 1);

        let u = user_repo.find_by_id(1).await.unwrap().unwrap();
        assert_eq!(
            u,
            User {
                id: 1,
                name: name.to_string(),
                address: address.to_string()
            }
        )
    }
}
