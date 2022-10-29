use crate::{handlers::strapi::create_strapi_router, modules::Modules};
use axum::{routing::get, Extension, Router};
use dotenv::dotenv;
use std::{net::SocketAddr, sync::Arc};

mod errors;
mod handlers;
mod modules;
mod repositories;

#[tokio::main]
async fn main() {
    dotenv().ok();

    // initialize tracing
    tracing_subscriber::fmt::init();

    let api_router = Router::new()
        .nest("/strapi", create_strapi_router())
        .route("/healthcheck", get(root));

    let module = Modules::new(None).await;

    // build our application with a route
    let app = Router::new()
        .nest("/api", api_router)
        .layer(Extension(Arc::new(module)));

    // run our app with hyper
    // `axum::Server` is a re-export of `hyper::Server`
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    tracing::debug!("listening on {}", addr);
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

#[derive(sqlx::FromRow, Debug)]
struct TableRow {
    name: String,
}

// basic handler that responds with a static string
async fn root(Extension(modules): Extension<Arc<Modules>>) -> String {
    let mut pool = modules.pool.acquire().await.unwrap();
    let table: Vec<TableRow> =
        sqlx::query_as("select name from sqlite_master where type = 'table'")
            .fetch_all(&mut pool)
            .await
            .unwrap();

    dbg!(format!(
        "{:?}",
        table
            .iter()
            .map(|t| t.name.clone())
            .collect::<Vec<String>>()
    ))
}
