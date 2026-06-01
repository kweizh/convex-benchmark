# Convex Strict TypeScript Types

## Background
Convex provides a code-first schema with strong runtime validation. In this task, you will create a Convex backend that enforces strict TypeScript types for a `users` table and build a CLI script to interact with it.

## Requirements
- Initialize a Convex project.
- Define a schema in `convex/schema.ts` with a `users` table. The table must strictly validate:
  - `name`: string
  - `age`: number
  - `role`: union of literal strings `"admin"` and `"user"`
- Define a mutation `createUser` in `convex/users.ts` that enforces these types in its arguments and inserts a user.
- Define a query `getUsersByRole` in `convex/users.ts` that takes a `role` argument and returns users with that role.
- Create a TypeScript CLI script `cli.ts` that uses `ConvexHttpClient` to call these functions.
- The CLI script must read the `ZEALT_RUN_ID` environment variable and apply it to avoid cross-run collisions.

## Implementation Hints
- Use `defineSchema` and `defineTable` with `v.string()`, `v.number()`, and `v.union(v.literal("admin"), v.literal("user"))` for the schema.
- In `cli.ts`, use `process.env.CONVEX_URL` to initialize the `ConvexHttpClient`.
- Import the generated API types from `./convex/_generated/api.js` to ensure type safety in `cli.ts`.
- You may need to run `npx convex deploy` or `npx convex dev` to generate the `api.js` files during your development.

## Acceptance Criteria
- Project path: `/home/user/myproject`
- Command: `npx tsx cli.ts <action> [args...]`
- The CLI must support the following actions:
  - `create <name> <age> <role>`: Calls the `createUser` mutation. The script MUST append `-${run-id}` (read from the `ZEALT_RUN_ID` environment variable) to the provided `<name>` before passing it to the mutation.
  - `list <role>`: Calls the `getUsersByRole` query. The script MUST filter the returned users in the client to only include those whose `name` ends with `-${run-id}`, and then print the filtered list as a JSON array to stdout.
- The stdout for the `list` command should print a JSON array of user objects.
- The project must be type-safe. Running `npx tsc --noEmit` in the project directory must succeed without errors.

