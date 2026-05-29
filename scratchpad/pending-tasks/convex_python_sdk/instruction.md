# Convex Python SDK Integration

## Background
Convex is a reactive backend-as-a-service. While it is heavily TypeScript-focused for defining backends, it provides a Python SDK (`convex` on PyPI) for interacting with the database. You need to build a Convex backend and a Python script that interacts with it.

## Requirements
- Initialize a Convex backend project and define a schema with a `tasks` table containing `text` (string) and `run_id` (string).
- Create a mutation `tasks:add` that accepts `text` and `run_id` and inserts a new task.
- Create a query `tasks:get_by_run_id` that accepts `run_id` and returns all tasks matching that `run_id`.
- Deploy the Convex backend.
- Write a Python script `main.py` that uses the `convex` package to connect to the backend.
- The script should accept a `--run-id` argument, call the `tasks:add` mutation with `text` set to "Hello from Python" and the given `run_id`, then query `tasks:get_by_run_id` with that `run_id`, and print the result to stdout.

## Implementation Hints
- Use `npx convex dev` or `npx convex deploy` to deploy the backend. The `CONVEX_DEPLOY_KEY` is provided in the environment.
- The Python script should read the `CONVEX_URL` environment variable to initialize the `ConvexClient`.
- Use `argparse` in Python to parse the `--run-id` argument.
- Use `client.mutation` and `client.query` from the `convex` Python package.

## Acceptance Criteria
- Project path: /home/user/python-sdk-task
- Command: python3 main.py --run-id <run-id>
- The stdout should print the list of tasks returned by the query, which must include the task created with `text` "Hello from Python" and the given `run-id`.

