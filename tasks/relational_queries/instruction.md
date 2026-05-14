# Convex Relational Queries

## Background
Convex is a reactive database where queries are written in TypeScript. In this task, you will implement a relational query that joins data from two tables: `users` and `messages`.

## Requirements
- Define a schema in `convex/schema.ts` with two tables: `users` (has a `name` string field) and `messages` (has a `text` string field, and an `authorId` field referencing `users`).
- Implement a query `listMessages` in `convex/messages.ts` that fetches all messages and also fetches the author for each message, returning an array of objects containing the message and its author's name.

## Implementation Guide
1. The project is already initialized at `/home/user/project` with `convex` and `typescript` installed. The `convex` folder exists.
2. Create `convex/schema.ts` defining the `users` and `messages` tables.
3. Create `convex/messages.ts` and implement the `listMessages` query.
   - The query should take no arguments.
   - It should return an array of objects, each containing the `_id` of the message, the `text` of the message, and the `authorName` (the name of the user referenced by `authorId`).

## Constraints
- Project path: `/home/user/project`
- Use the new function syntax for Convex functions.
- Ensure `convex/schema.ts` and `convex/messages.ts` are syntactically correct TypeScript.