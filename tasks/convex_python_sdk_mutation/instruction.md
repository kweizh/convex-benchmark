# Convex Python SDK Mutation

## Background
Convex provides a Python SDK (`convex` on PyPI) for interacting with your Convex backend. In this task, you will create a Convex backend with a mutation and a query, then use the Python SDK to call the mutation.

## Requirements
- Set up a Convex project in the target directory.
- Define a schema with a `tasks` table containing `text` (string) and `isCompleted` (boolean).
- Create a mutation named `add` in `convex/tasks.ts` that accepts `text` (string) and `isCompleted` (boolean), inserts a new task into the `tasks` table, and returns the generated task ID.
- Create a query named `get` in `convex/tasks.ts` that accepts an `id` argument (string, representing the task ID), and returns the corresponding task document.
- Deploy the Convex backend using `npx convex deploy`.
- Write a Python script `run.py` that connects to the Convex backend using the `CONVEX_URL` environment variable and the `convex` Python package.
- The Python script should accept a `--text` argument, call the `add` mutation with the provided text and `isCompleted` set to `False`, and print the returned task ID.

## Implementation Hints
- Use `npm init -y` and `npm install convex` to set up the Node.js environment for deploying the backend.
- Define your schema in `convex/schema.ts` and your functions in `convex/tasks.ts`.
- Use `npx convex deploy` to deploy your backend functions to the cloud.
- Use the `convex` Python package (install via `pip install convex`).
- In Python, initialize `ConvexClient` with your `CONVEX_URL`.
- Call the mutation using `client.mutation("tasks:add", {"text": args.text, "isCompleted": False})`.
- To query by ID in the backend, you can use `ctx.db.get(ctx.db.normalizeId("tasks", args.id))`.

## Acceptance Criteria
- Project path: /home/user/myproject
- Command: python3 run.py --text <text>
- The Python script must correctly call the Convex mutation and insert the data.
- The stdout should print: `Inserted task ID: <task_id>`

