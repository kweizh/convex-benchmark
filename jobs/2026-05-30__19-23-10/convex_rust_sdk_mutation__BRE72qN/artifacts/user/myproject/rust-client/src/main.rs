use convex::ConvexClient;
use convex::Value;
use std::collections::BTreeMap;
use std::env;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().ok();
    
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        eprintln!("Usage: {} <text>", args[0]);
        std::process::exit(1);
    }
    
    let text = args[1].clone();
    let run_id = env::var("ZEALT_RUN_ID").unwrap_or_else(|_| "unknown".to_string());
    let convex_url = env::var("CONVEX_URL").expect("CONVEX_URL must be set");
    
    let mut client = ConvexClient::new(convex_url.as_str()).await?;
    
    let mut kwargs = BTreeMap::new();
    kwargs.insert("text".to_string(), Value::String(text));
    kwargs.insert("runId".to_string(), Value::String(run_id));
    
    client.mutation("tasks:create", kwargs).await?;
    
    Ok(())
}
