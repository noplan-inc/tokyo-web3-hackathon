use anyhow::{Ok, Result};
use sqlx::{Pool, Sqlite};

#[derive(sqlx::FromRow, Debug, PartialEq, Eq)]
pub struct Website {
    id: i64,
    name: String,
    domain: String,
    token_id: String,
}

#[derive(Debug, Clone)]
pub struct WebsiteRepositry {
    pub db: Pool<Sqlite>,
}

impl WebsiteRepositry {
    pub fn new(db: Pool<Sqlite>) -> Self {
        Self { db }
    }

    pub async fn find_by_id(&self, id: i64) -> Result<Option<Website>> {
        let mut pool = self.db.acquire().await?;

        let website: Option<Website> =
            sqlx::query_as("select * from websites where id = ? limit 1")
                .bind(id)
                .fetch_optional(&mut pool)
                .await?;

        Ok(website)
    }

    pub async fn find_by_user_id(&self, user_id: i64) -> Result<Option<Website>> {
        let mut pool = self.db.acquire().await?;

        let website: Option<Website> =
            sqlx::query_as("select * from websites where id = ? limit 1")
                .bind(user_id)
                .fetch_optional(&mut pool)
                .await?;

        Ok(website)
    }

    pub async fn count(&self) -> Result<i64> {
        let mut pool = self.db.acquire().await?;

        let website_count: i64 = sqlx::query_scalar("select count(*) from websites")
            .fetch_one(&mut pool)
            .await?;

        Ok(website_count)
    }

    pub async fn create<T>(
        &self,
        name: &String,
        domain: &String,
        token_id: &String,
        id: T,
    ) -> Result<Website>
    where
        T: Into<Option<i64>>,
    {
        let mut pool = self.db.acquire().await?;

        let _id = id.into();

        let generated_id = if _id.is_none() {
            sqlx::query("INSERT INTO Websites(name, domain, token_id) VALUES(?, ?, ?)")
                .bind(name)
                .bind(domain)
                .bind(token_id)
                .execute(&mut pool)
                .await?
                .last_insert_rowid()
        } else {
            sqlx::query("INSERT INTO Websites(id, name, domain, token_id) VALUES(?, ?, ?, ?)")
                .bind(_id)
                .bind(name)
                .bind(domain)
                .bind(token_id)
                .execute(&mut pool)
                .await?
                .last_insert_rowid()
        };

        Ok(Website {
            id: generated_id,
            name: name.to_string(),
            domain: domain.to_string(),
            token_id: token_id.to_string(),
        })
    }
}

#[cfg(test)]
mod tests {
    use rand::Rng;
    use sqlx::{Pool, Sqlite};

    use super::{Website, WebsiteRepositry};
    use crate::modules::db::init_pool;

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

    fn fixture_website1() -> Website {
        Website {
            id: 1,
            name: "alice".to_string(),
            domain: "alice.example.com".to_string(),
            token_id: "100".to_string(),
        }
    }

    async fn init_db() -> (Pool<Sqlite>, u16) {
        let mut r = rand::thread_rng();
        let rand: u16 = r.gen_range(0..10000);

        let pool = init_pool(format!("./tmp/test/{}.db", rand).as_str())
            .await
            .unwrap();

        let _ = sqlx::migrate!("./migrations/").run(&pool).await;

        let web_repo = WebsiteRepositry::new(pool.clone());

        let _ = web_repo
            .create(
                &String::from("alice"),
                &String::from("alice.example.com"),
                &String::from("100"),
                None,
            )
            .await;

        (pool, rand)
    }

    #[tokio::test]
    async fn test_find_by_id() {
        let (db, db_id) = init_db().await;
        let _setupper = setup(db_id);
        let web_repo = WebsiteRepositry::new(db);

        assert_eq!(web_repo.count().await.unwrap(), 1);

        let web = web_repo.find_by_id(1).await.unwrap().unwrap();
        assert_eq!(web, fixture_website1());
    }

    #[tokio::test]
    async fn test_find_by_id2() {
        let (db, db_id) = init_db().await;
        let _setupper = setup(db_id);
        let web_repo = WebsiteRepositry::new(db);

        assert_eq!(web_repo.count().await.unwrap(), 1);

        let web = web_repo.find_by_id(2).await.unwrap();
        assert!(web.is_none());
    }

    #[tokio::test]
    async fn test_count() {
        let (db, db_id) = init_db().await;
        let _setupper = setup(db_id);
        let web_repo = WebsiteRepositry::new(db);

        assert_eq!(web_repo.count().await.unwrap(), 1);
    }

    #[tokio::test]
    async fn test_create() {
        let (db, db_id) = init_db().await;
        let _setupper = setup(db_id);
        let web_repo = WebsiteRepositry::new(db);

        assert_eq!(web_repo.count().await.unwrap(), 1);

        let name = &"alice".to_string();
        let domain = &"alice2.example.com".to_string();
        let token_id = &"200".to_string();

        web_repo
            .create(&name.clone(), &domain.clone(), &token_id.clone(), None)
            .await
            .unwrap();

        assert_eq!(web_repo.count().await.unwrap(), 2);

        let w = web_repo.find_by_id(2).await.unwrap().unwrap();
        assert_eq!(
            w,
            Website {
                id: 2,
                name: name.to_string(),
                domain: domain.to_string(),
                token_id: token_id.to_string()
            }
        )
    }
}
