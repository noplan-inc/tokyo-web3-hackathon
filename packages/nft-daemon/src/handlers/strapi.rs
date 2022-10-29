use std::sync::Arc;

use crate::errors::ApiError;
use anyhow::{anyhow, bail};
use axum::response::IntoResponse;
use axum::routing::post;
use axum::{http::StatusCode, Router};
use axum::{Extension, Json};
use serde::{Deserialize, Serialize};
use tokio::process::Command;

use crate::modules::Modules;

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PublishedEvent {
    pub event: String,
    pub created_at: String,
    pub model: String,
    pub entry: Entry,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Entry {
    pub id: i64,
    pub title: String,
    pub description: String,
    pub content: String,
    pub slug: String,
    pub created_at: String,
    pub updated_at: String,
    pub published_at: Option<String>,
    pub category: Option<String>,
    pub image: Option<String>,
    pub author: Author,
}

#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Author {
    pub id: i64,
    pub name: String,
    pub email: String,
    pub created_at: String,
    pub updated_at: String,
}

pub fn create_strapi_router() -> Router {
    Router::new().route("/articles", post(article_published))
}

async fn get_subdomain_from_nft(owner_address: String) -> anyhow::Result<String> {
    // TODO ちゃんとコントラクトからゲットする。一旦モックする
    Ok(String::from("value"))
}

async fn exec_next_clone(domain: &str) -> anyhow::Result<()> {
    let mut child = Command::new("bash")
        .arg("next_clone.sh")
        .arg(domain)
        .spawn()
        .map_err(|e| anyhow!("failed to next_clone.sh. err: {:?}", e))?;

    let status = child.wait().await?;
    if !status.success() {
        bail!("failed to next_clone.sh.");
    }
    Ok(())
}

async fn exec_next_build(domain: &str) -> anyhow::Result<()> {
    let mut child = Command::new("bash")
        .arg("next_build.sh")
        .arg(domain)
        .spawn()
        .map_err(|e| anyhow!("failed to next_build.sh. err: {:?}", e))?;

    let status = child.wait().await?;
    if !status.success() {
        bail!("failed to next_build.sh.");
    }
    Ok(())
}

pub async fn article_published(
    Extension(modules): Extension<Arc<Modules>>,
    Json(payload): Json<PublishedEvent>,
) -> Result<impl IntoResponse, ApiError> {
    let id = payload.entry.author.id;

    let user = if let Some(user) = modules.user_repo.find_by_id(id).await? {
        user
    } else {
        return Err(ApiError::NotFound);
    };

    let website = if let Some(website) = modules.web_repo.find_by_user_id(user.id).await? {
        website
    } else {
        return Err(ApiError::NotFound);
    };

    exec_next_build(&website.domain)
        .await
        .map_err(|e| anyhow!("failed to next_build.sh. err: {:?}", e))?;

    Ok((StatusCode::CREATED, Json("OK")))
}

#[cfg(test)]
mod test {

    use std::sync::Arc;

    use axum::{
        http::StatusCode,
        routing::{post, Route},
        Extension, Router,
    };
    use axum_test_helper::TestClient;
    use rand::Rng;
    use sqlx::{Pool, Sqlite};

    use crate::{
        handlers::strapi::exec_next_clone,
        modules::{db::init_pool, Modules},
        repositories::{
            user::UserRepositry,
            website::{Website, WebsiteRepositry},
        },
    };

    use super::{article_published, PublishedEvent};

    struct SetUpper {
        db_id: u16,
        domain: String,
    }
    impl Drop for SetUpper {
        fn drop(&mut self) {
            std::fs::remove_file(format!("./tmp/test/{}.db", self.db_id)).unwrap();
            std::fs::remove_dir_all(format!("./tmp/site/{}", self.domain)).unwrap();
        }
    }

    fn setup(db_id: u16, domain: &str) -> SetUpper {
        SetUpper {
            db_id,
            domain: domain.to_string(),
        }
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

        let user_repo = UserRepositry::new(pool.clone());
        let _ = user_repo.create("alice", "0xdead...beaf", 1).await;

        let web_repo = WebsiteRepositry::new(pool.clone());

        let _ = web_repo
            .create("alice", "alice.example.com", "100", None)
            .await;

        (pool, rand)
    }

    #[test]
    fn deserialize_published_evnet_json() {
        let event_json = r##"{
            "event": "entry.publish",
            "createdAt": "2022-10-23T04:41:03.480Z",
            "model": "article",
            "entry": {
                "id": 7,
                "title": "hogehoge",
                "description": "super hogehoge",
                "content": "# hogehoge\n\n\n## super hogehoge",
                "slug": "article",
                "createdAt": "2022-10-23T04:40:35.635Z",
                "updatedAt": "2022-10-23T04:40:58.718Z",
                "publishedAt": null,
                "category": null,
                "image": null,
                "author": {
                    "id": 1,
                    "name": "Sarah Baker",
                    "email": "sarahbaker@strapi.io",
                    "createdAt": "2022-10-23T04:07:47.694Z",
                    "updatedAt": "2022-10-23T04:07:47.694Z"
                }
            }
        }"##;

        let event: PublishedEvent = serde_json::from_str(event_json).unwrap();
        assert_eq!(event.entry.author.id, 1);
    }

    #[tokio::test]
    async fn test_article_published() {
        let domain = "alice.example.com";
        exec_next_clone(domain).await.unwrap();

        let (pool, db_id) = init_db().await;
        let _setupper = setup(db_id, domain);

        let module = Modules::new(pool).await;

        let app = Router::new()
            .route("/article_published", post(article_published))
            .layer(Extension(Arc::new(module)));

        let client = TestClient::new(app);
        let event_json = r##"{
            "event": "entry.publish",
            "createdAt": "2022-10-23T04:41:03.480Z",
            "model": "article",
            "entry": {
                "id": 7,
                "title": "hogehoge",
                "description": "super hogehoge",
                "content": "# hogehoge\n\n\n## super hogehoge",
                "slug": "article",
                "createdAt": "2022-10-23T04:40:35.635Z",
                "updatedAt": "2022-10-23T04:40:58.718Z",
                "publishedAt": null,
                "category": null,
                "image": null,
                "author": {
                    "id": 1,
                    "name": "Sarah Baker",
                    "email": "sarahbaker@strapi.io",
                    "createdAt": "2022-10-23T04:07:47.694Z",
                    "updatedAt": "2022-10-23T04:07:47.694Z"
                }
            }
        }"##;

        let resp = client
            .post("/article_published")
            .body(event_json)
            .header("Content-Type", "application/json")
            .send()
            .await;
        // assert_eq!(resp.status(), StatusCode::CREATED);
        assert_eq!(resp.text().await, String::from("\"OK\""));
    }
}
