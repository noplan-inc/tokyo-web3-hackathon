use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    BoxError, Json,
};
use serde_json::json;

pub enum ApiError {
    NotFound,
    Anyhow(anyhow::Error),
    Other(BoxError),
}

impl ApiError {
    fn other<E: std::error::Error + Send + Sync + 'static>(err: E) -> Self {
        ApiError::Other(Box::new(err))
    }
}

impl From<anyhow::Error> for ApiError {
    fn from(inner: anyhow::Error) -> Self {
        ApiError::Anyhow(inner)
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let body = Json(json!({
            "error": match self {
                ApiError::Anyhow(e) => e.to_string(),
                ApiError::NotFound => "Not found".to_string(),
                ApiError::Other(e) => e.to_string(),
            },
        }));

        (StatusCode::INTERNAL_SERVER_ERROR, body).into_response()
    }
}
