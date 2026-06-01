# Query Convex with Rust SDK

## Background
You need to create a Rust application that connects to a Convex backend and queries data from it.

## Requirements
- Initialize a Rust Cargo project named `convex_query_app` in `/home/user/project`.
- Add the `convex` Rust client library, `tokio`, and `dotenvy` as dependencies.
- Write a Rust program in `src/main.rs` that connects to the Convex backend using the `CONVEX_URL` environment variable.
- The program must query the `tasks:get` API and print the results to stdout.
- Note: Building the Rust project takes time. Start a background job to build the Rust project (`cargo build`) as early as possible while you work on other things.

## Implementation Hints
- Use `ConvexClient::new` to connect to the deployment URL.
- Use `client.query("tasks:get", BTreeMap::new()).await` to fetch the tasks.
- Load environment variables using `dotenvy` or `std::env::var`.

## Acceptance Criteria
- Project path: /home/user/project/convex_query_app
- Command: cargo run
- The stdout should print the array of tasks fetched from Convex.

