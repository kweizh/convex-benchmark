use std::collections::BTreeMap;

use convex::ConvexClient;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().ok();

    let convex_url = std::env::var("CONVEX_URL")?;
    let client = ConvexClient::new(convex_url)?;
    let tasks = client.query("tasks:get", BTreeMap::new()).await?;

    println!("{tasks:?}");

    Ok(())
}
