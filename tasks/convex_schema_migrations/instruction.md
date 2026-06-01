# Convex Schema Migrations

## Background
Convex is a reactive database where schema changes deploy instantly, but existing data is not automatically transformed. To add a required field to an existing table, you must update the schema and write a backfill mutation to update existing records.

## Requirements
- You are provided with a Convex project in `/home/user/project`.
- First, run `bash setup.sh` to initialize the database. This script will create a table named `tasks_<run_id>` (where `<run_id>` is derived from `ZEALT_RUN_ID` with hyphens replaced by underscores) and insert 3 initial records with `text` and `isCompleted` fields.
- Update `convex/schema.ts` to add a new required field `priority` (string) to the table.
- Create a new file `convex/migrations.ts` and write a mutation named `backfillPriority` that iterates over all records in the table and sets the `priority` field to `"medium"` for any record that doesn't have it.
- Deploy your changes to Convex.
- Execute your `backfillPriority` mutation to update the existing data.
- Create a query function in `convex/queries.ts` named `getAll` that returns all records from the table.
- Write a Node.js script `fetch.js` that uses `ConvexHttpClient` (from `convex/browser`) to call your `getAll` query and writes the JSON stringified result to `/home/user/project/output.log`.
- Run `node fetch.js` to generate the log file.

## Implementation Hints
- `setup.sh` will dynamically generate `convex/schema.ts` based on `ZEALT_RUN_ID`. Review it after running the script.
- Convex table names must be alphanumeric and underscores. The setup script handles this conversion for you.
- To backfill, you can use `ctx.db.query(tableName).collect()` to get all records, and `ctx.db.patch(record._id, { priority: "medium" })` to update them.
- Use `npx convex deploy` to deploy your schema and functions.
- Use `npx convex run migrations:backfillPriority` to execute the mutation from the CLI.
- In `fetch.js`, initialize `ConvexHttpClient` with `process.env.CONVEX_URL` (ensure you load `.env.local` or pass the URL).

## Acceptance Criteria
- Project path: /home/user/project
- Ensure the real migration action is executed and the log artifact exists.
- Log file: /home/user/project/output.log
- The log file must contain a JSON array of the tasks.
- Every task in the log file must have `text`, `isCompleted`, and `priority` fields.
- The `priority` field for all tasks must be `"medium"`.

