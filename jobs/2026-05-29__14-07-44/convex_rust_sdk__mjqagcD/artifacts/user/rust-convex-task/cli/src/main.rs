use convex::{ConvexClient, FunctionResult, Value};
use std::collections::BTreeMap;
use std::env;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let url = env::var("CONVEX_URL").expect("CONVEX_URL must be set");
    let run_id = env::var("ZEALT_RUN_ID").expect("ZEALT_RUN_ID must be set");

    let mut client = ConvexClient::new(&url).await?;

    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        eprintln!("Usage: create <text> | get");
        std::process::exit(1);
    }

    match args[1].as_str() {
        "create" => {
            if args.len() < 3 {
                eprintln!("Usage: create <text>");
                std::process::exit(1);
            }
            let text = &args[2];
            let mut mutation_args = BTreeMap::new();
            mutation_args.insert("text".to_string(), Value::from(text.clone()));
            mutation_args.insert("run_id".to_string(), Value::from(run_id.clone()));
            let result = client.mutation("tasks:create", mutation_args).await?;
            match result {
                FunctionResult::Value(_) => {}
                FunctionResult::ErrorMessage(e) => {
                    eprintln!("Error: {}", e);
                    std::process::exit(1);
                }
                FunctionResult::ConvexError(e) => {
                    eprintln!("Convex Error: {}", e.message);
                    std::process::exit(1);
                }
            }
        }
        "get" => {
            let mut query_args = BTreeMap::new();
            query_args.insert("run_id".to_string(), Value::from(run_id.clone()));
            let result = client.query("tasks:get", query_args).await?;
            match result {
                FunctionResult::Value(v) => {
                    println!("{}", serde_json::to_string(&v.export())?);
                }
                FunctionResult::ErrorMessage(e) => {
                    eprintln!("Error: {}", e);
                    std::process::exit(1);
                }
                FunctionResult::ConvexError(e) => {
                    eprintln!("Convex Error: {}", e.message);
                    std::process::exit(1);
                }
            }
        }
        _ => {
            eprintln!("Unknown command: {}", args[1]);
            std::process::exit(1);
        }
    }

    Ok(())
}
