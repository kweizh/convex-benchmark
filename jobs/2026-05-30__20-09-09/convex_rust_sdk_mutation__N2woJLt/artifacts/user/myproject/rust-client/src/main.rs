use convex::ConvexClient;
use std::collections::BTreeMap;
use std::env;

#[tokio::main]
async fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        eprintln!("Usage: rust-client <text>");
        std::process::exit(1);
    }
    let text = &args[1];
    let run_id = env::var("ZEALT_RUN_ID").expect("ZEALT_RUN_ID environment variable not set");

    let convex_url = env::var("CONVEX_URL").expect("CONVEX_URL environment variable not set");

    let mut client = ConvexClient::new(&convex_url).await.expect("Failed to connect to Convex");

    let mut args_map: BTreeMap<String, convex::Value> = BTreeMap::new();
    args_map.insert("text".to_string(), convex::Value::String(text.clone()));
    args_map.insert("runId".to_string(), convex::Value::String(run_id.clone()));

    let result = client
        .mutation("tasks:create", args_map)
        .await
        .expect("Mutation failed");

    println!("Mutation result: {:?}", result);
}