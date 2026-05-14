# Convex Data Migration Script

## Background
You have a Convex project initialized at `/home/user/project`. You need to write a migration script as a Convex mutation to seed the database with initial tasks.

## Requirements
- Create a new file `convex/migration.ts`.
- In this file, export a mutation named `seedTasks`.
- The mutation should insert three records into the `tasks` table:
  1. `text`: "Buy milk", `status`: "todo"
  2. `text`: "Read book", `status`: "todo"
  3. `text`: "Write code", `status`: "done"
- After creating the mutation, deploy it and run it using the Convex CLI.

## Implementation Guide
1. Create `convex/migration.ts` and define the `seedTasks` mutation using `mutation` from `./_generated/server`.
2. Use `ctx.db.insert("tasks", { ... })` to insert the records.
3. Run `npx convex deploy` to push your functions to Convex.
4. Run `npx convex run migration:seedTasks` to execute the migration.

## Constraints
- Project path: `/home/user/project`
- The project is already initialized and the `tasks` table is defined in `convex/schema.ts`.
- Use the provided `CONVEX_DEPLOY_KEY` environment variable.