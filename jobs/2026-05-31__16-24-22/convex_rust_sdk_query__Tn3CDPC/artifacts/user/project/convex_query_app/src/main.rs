use convex::ConvexClient;
use dotenvy::dotenv;
use std::collections::BTreeMap;
use std::env;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Load environment variables from .env file
    dotenv().ok();

    // Get CONVEX_URL from environment
    let convex_url = env::var("CONVEX_URL").expect("CONVEX_URL must be set");

    // Initialize the Convex client
    let mut client = ConvexClient::new(&convex_url).await?;

    // Query the "tasks:get" API
    let results = client.query("tasks:get", BTreeMap::new()).await?;

    // Print the results to stdout
    println!("{:?}", results);

    Ok(())
}
