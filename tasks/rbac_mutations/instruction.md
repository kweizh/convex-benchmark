# Convex RBAC Mutation

## Background
Implement a simple Role-Based Access Control (RBAC) system in a Convex backend to restrict who can delete tasks.

## Requirements
1. Define a schema in `convex/schema.ts` with two tables:
   - `users`: `{ name: v.string(), role: v.string() }`
   - `tasks`: `{ text: v.string(), status: v.string() }`
2. Create the following mutations in `convex/tasks.ts`:
   - `createUser`: accepts `name: v.string()` and `role: v.string()`, inserts a user, and returns the user ID.
   - `createTask`: accepts `text: v.string()` and `status: v.string()`, inserts a task, and returns the task ID.
   - `deleteTask`: accepts `taskId: v.id("tasks")` and `userId: v.id("users")`. Inside the mutation, fetch the user. If the user does not exist or their `role` is not `"admin"`, it must throw an Error with the exact message `"Unauthorized"`. If the user is an admin, delete the task using `ctx.db.delete(args.taskId)`.

## Implementation Guide
1. Initialize a Convex project in `/home/user/project` if not already initialized.
2. Write the schema in `convex/schema.ts`.
3. Write the mutations in `convex/tasks.ts`.

## Constraints
- Project path: `/home/user/project`
- Use `v.id("tasks")` and `v.id("users")` for the arguments.