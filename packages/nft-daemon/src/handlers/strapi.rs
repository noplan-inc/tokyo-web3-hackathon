use axum::response::IntoResponse;
use axum::routing::post;
use axum::Json;
use axum::{http::StatusCode, Router};
use serde::{Deserialize, Serialize};

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

pub async fn article_published(Json(payload): Json<PublishedEvent>) -> impl IntoResponse {
    let id = payload.entry.author.id;
    println!("{:?}", id);
    // TODO
    // 初めてのauthorの場合は、next templateをcloneしてbuild
    // ただのアップデート or 新規記事作成の場合はnext build

    (StatusCode::CREATED, Json(""))
}
