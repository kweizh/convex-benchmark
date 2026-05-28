# Scheduled Cleanup in Convex

## Background
Convex allows scheduling functions to run on a recurring basis using cron jobs. You need to implement a scheduled cleanup job to delete expired session data.

## Requirements
- Initialize a Convex project in `/home/user/project`.
- Define a `sessions` table in `convex/schema.ts` with fields: `sessionId` (string) and `expiresAt` (number).
- Create a mutation named `insertSession` in `convex/sessions.ts` that takes `sessionId` and `expiresAt` as arguments and inserts a new session.
- Create a query named `getSessions` in `convex/sessions.ts` that returns all sessions.
- Create a mutation named `clearExpired` in `convex/sessions.ts` that deletes all sessions where `expiresAt` is less than the current time (`Date.now()`).
- Define a cron job in `convex/crons.ts` named `clear expired sessions` that runs the `clearExpired` mutation every hour.
- Deploy the Convex functions to the cloud using `npx convex deploy`.

## Implementation Hints
- Set up a basic Node.js project and install `convex`.
- You can configure the project by manually creating `convex.json` and the `convex/` folder.
- Use `CONVEX_DEPLOY_KEY` in your environment to authenticate for `npx convex deploy`.
- In `convex/sessions.ts`, write the mutations and queries.
- In `convex/crons.ts`, use `crons.hourly()` to schedule the mutation.

## Acceptance Criteria
- Project path: `/home/user/project`
- The cloud instance must have the `sessions` table, the `insertSession` mutation, the `getSessions` query, the `clearExpired` mutation, and the cron job deployed.
- The `insertSession` mutation must successfully insert a session.
- The `getSessions` query must return all inserted sessions.
- The `clearExpired` mutation must successfully delete sessions with `expiresAt < Date.now()` and leave other sessions intact.
- The cron job must be defined in `convex/crons.ts` to run hourly.
