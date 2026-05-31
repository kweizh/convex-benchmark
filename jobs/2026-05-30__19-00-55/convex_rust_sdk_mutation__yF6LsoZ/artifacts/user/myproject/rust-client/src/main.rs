use convex::{ConvexClient, Value};
use std::collections::BTreeMap;
use std::env;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().ok();
    
    let convex_url = env::var("CONVEX_URL").expect("CONVEX_URL must be set");
    let run_id = env::var("ZEALT_RUN_ID").expect("ZEALT_RUN_ID must be set");
    
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        eprintln!("Usage: {} <text>", args[0]);
        std::process::exit(1);
    }
    let text = &args[1];

    let mut client = ConvexClient::new(&convex_url).await?;
    
    let mut map = BTreeMap::new();
    map.insert("text".to_string(), Value::String(text.clone()));
    map.insert("runId".to_string(), Value::String(run_id));

    client.mutation("tasks:create", map).await?;
    
    println!("Mutation called successfully");
    
    Ok(())
}
