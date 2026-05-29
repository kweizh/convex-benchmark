# Convex Rust SDK CLI

## Background
Convex is a reactive backend-as-a-service. You can interact with it using various SDKs, including Rust. In this task, you will create a simple Convex backend and a Rust CLI to interact with it.

## Requirements
- Initialize a Convex project and define a schema with a `tasks` table containing `text` (string) and `run_id` (string).
- Create a Convex mutation `tasks:create` that accepts `text` and `run_id` and inserts a new task.
- Create a Convex query `tasks:get` that accepts `run_id` and returns all tasks matching that `run_id`.
- Deploy the Convex backend using the provided `CONVEX_DEPLOY_KEY`.
- Create a Rust CLI application using the `convex` and `tokio` crates.
- The Rust CLI must read `CONVEX_URL` and `ZEALT_RUN_ID` from the environment.
- The Rust CLI must implement two commands:
  - `create <text>`: Invokes the `tasks:create` mutation using the given text and the `run-id` from `ZEALT_RUN_ID`.
  - `get`: Invokes the `tasks:get` query using the `run-id` from `ZEALT_RUN_ID` and prints the `text` of the returned tasks as a JSON array of strings to stdout.

## Implementation Hints
- Create the Convex backend in the project root. You will need a `package.json` with `convex` installed to run `npx convex deploy`.
- Use `v.string()` for schema validation in Convex.
- For the Rust CLI, create a new Cargo project. Add `convex`, `tokio`, and `serde_json` as dependencies.
- Use `ConvexClient::new(&url)` to initialize the Rust client.
- Use `client.mutation(...)` and `client.query(...)` with `btreemap!` or `map!` to pass arguments in Rust.

## Acceptance Criteria
- Project path: /home/user/rust-convex-task
- Ensure the Convex backend is deployed.
- Command: `cd /home/user/rust-convex-task/cli && cargo run -- <command> [args]`
- Command input argument format:
  - `create <text>`
  - `get`
- The expected command output format:
  - For `get`, the stdout should print a JSON array of strings containing the text of the tasks (e.g., `["Buy groceries", "Read a book"]`).
- The data must be isolated using the `run-id` read from the `ZEALT_RUN_ID` environment variable.

