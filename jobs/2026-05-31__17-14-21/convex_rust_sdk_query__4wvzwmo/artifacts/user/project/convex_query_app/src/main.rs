use convex::ConvexClient;
use std::collections::BTreeMap;

#[tokio::main]
async fn main() {
    // Load environment variables from .env file if present
    dotenvy::dotenv().ok();

    // Read the Convex deployment URL from environment
    let convex_url = std::env::var("CONVEX_URL").expect("CONVEX_URL environment variable must be set");

    // Connect to the Convex backend
    let mut client = ConvexClient::new(&convex_url).await.expect("Failed to connect to Convex");

    // Query the tasks:get API
    let result = client.query("tasks:get", BTreeMap::new()).await.expect("Failed to query tasks:get");

    // Print the results
    println!("{:#?}", result);
}