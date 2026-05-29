# Convex Basic CRUD

## Background
Convex is a reactive backend-as-a-service. In this task, you will create a simple task manager backend using Convex, define a schema with validation and indexes, and deploy it.

## Requirements
- Create a Node.js project in `/home/user/myproject` and install `convex`.
- Read the `run-id` from the `ZEALT_RUN_ID` environment variable.
- Define a schema in `convex/schema.ts` with a table named `tasks_${run-id}`.
- The table must have two fields: `text` (string) and `status` (a union of literal "todo" and literal "done").
- Add an index named `by_status` on the `status` field of this table.
- Create a file `convex/tasks.ts` and define a mutation named `create` that takes a `text` string argument, inserts a new record into the `tasks_${run-id}` table with `text` and `status: "todo"`, and returns the new record's ID.
- In the same file, define a query named `get` that takes a `status` string argument and returns all records from the `tasks_${run-id}` table matching that status, using the `by_status` index.
- Deploy the Convex project and save the deployment output to `/home/user/myproject/deploy.log`.

## Implementation Hints
- Set up a basic `package.json` and install the `convex` package.
- You will need to dynamically generate `convex/schema.ts` and `convex/tasks.ts` to include the `run-id` in the table name.
- The `CONVEX_DEPLOY_KEY` environment variable is already available in the environment for deployment.
- Use `npx convex deploy` to push your schema and functions to the Convex cloud. Redirect its output to `deploy.log`.

## Acceptance Criteria
- Project path: `/home/user/myproject`
- Log file: `/home/user/myproject/deploy.log`
- The deployed Convex backend must expose a mutation `api.tasks.create` and a query `api.tasks.get`.
- The table name must strictly match `tasks_${run-id}`.

