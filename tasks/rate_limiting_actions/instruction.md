# Rate Limiting Convex Actions

## Background
Implement a rate-limited action in a Convex backend. Convex actions are used for side effects (like calling external APIs), but we want to limit how often a user can trigger an action using the database.

## Requirements
- Create a Convex project in `/home/user/project`.
- Define a schema with a `rateLimits` table containing `userId` (string) and `count` (number). Add an index on `userId` named `by_userId`.
- Create a mutation `checkAndIncrement` in `convex/rateLimit.ts` that takes a `userId` (string). It should find the user's rate limit record using the index. If it doesn't exist, create it with count 1 and return `true`. If it exists and count is < 3, increment count by 1 and return `true`. If count is >= 3, return `false`.
- Create an action `doWork` in `convex/actions.ts` that takes a `userId` (string). It calls the `checkAndIncrement` mutation. If the mutation returns `false`, throw an Error with message "Rate limit exceeded". If `true`, return "Work completed".

## Implementation Guide
1. Initialize a Node.js project in `/home/user/project` and install `convex`.
2. Create `convex/schema.ts` defining the `rateLimits` table with the required index.
3. Create `convex/rateLimit.ts` with the `checkAndIncrement` mutation.
4. Create `convex/actions.ts` with the `doWork` action.

## Constraints
- Project path: /home/user/project
- Do not use external rate limiting services, use the Convex database.
- The action must be defined using the new function syntax.