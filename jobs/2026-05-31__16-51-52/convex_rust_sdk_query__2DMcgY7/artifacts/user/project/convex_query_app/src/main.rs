use convex::ConvexClient;
use dotenvy::dotenv;
use std::collections::BTreeMap;
use std::env;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Load environment variables from .env file if it exists
    let _ = dotenv();

    // Get the CONVEX_URL environment variable
    let url = env::var("CONVEX_URL").expect("CONVEX_URL must be set");

    // Initialize the Convex client
    let mut client = ConvexClient::new(&url).await?;

    // Query the "tasks:get" API
    let args: BTreeMap<String, convex::Value> = BTreeMap::new();
    let result = client.query("tasks:get", args).await?;

    // Print the results to stdout
    println!("{:?}", result);

    Ok(())
}
