use std::{
    collections::BTreeMap,
    env,
};

use convex::{
    ConvexClient,
    Value,
};

#[tokio::main]
async fn main() {
    dotenvy::from_filename(".env.local").ok();
    dotenvy::dotenv().ok();

    let mut args = env::args().skip(1);
    let text = args.next().unwrap_or_else(|| {
        eprintln!("Usage: cargo run --manifest-path rust-client/Cargo.toml -- <text>");
        std::process::exit(1);
    });

    let run_id = env::var("ZEALT_RUN_ID").expect("ZEALT_RUN_ID must be set");
    let deployment_url = env::var("CONVEX_URL").expect("CONVEX_URL must be set");

    let mut client = ConvexClient::new(&deployment_url)
        .await
        .expect("Failed to create Convex client");

    let mut args_map: BTreeMap<String, Value> = BTreeMap::new();
    args_map.insert("text".to_string(), text.into());
    args_map.insert("runId".to_string(), run_id.into());

    client
        .mutation("tasks:create", args_map)
        .await
        .expect("Failed to call tasks:create mutation");
}
