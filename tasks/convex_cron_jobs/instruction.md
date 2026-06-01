# Convex Cron Jobs

## Background
Convex allows you to schedule functions to run on a recurring basis. In this task, you will create a scheduled cron job to clean up expired sessions in a Convex database.

## Requirements
- Initialize a Convex project.
- Define a `sessions` table schema with fields: `runId` (string), `expiresAt` (number), `isActive` (boolean).
- Create a mutation that finds all sessions where `expiresAt` is strictly less than the current time (`Date.now()`) and `isActive` is `true`, and updates their `isActive` status to `false`.
- Create a cron job that runs the cleanup mutation every 1 minute.
- Deploy the Convex backend to the cloud.
- Create a Node.js script `seed.js` that inserts an already-expired session into the database.
- Create a Node.js script `check.js` that retrieves a session by its ID and outputs its `isActive` status.

## Implementation Hints
- Read the `CONVEX_DEPLOY_KEY` and `CONVEX_URL` environment variables for authentication and connection.
- Define your schema in `convex/schema.ts` and your mutation in a file like `convex/sessions.ts`.
- Define the cron job in `convex/crons.ts` using `crons.interval()` for a 1-minute interval.
- Use `npx convex deploy` to deploy your backend functions and cron jobs to the Convex cloud.
- In `seed.js` and `check.js`, use `ConvexHttpClient` to interact with the deployed backend.
- Ensure `seed.js` sets `expiresAt` to a time in the past so it is immediately eligible for cleanup.

## Acceptance Criteria
- Project path: /home/user/project
- Command 1: `node seed.js --run-id <run-id>`
  - The expected command output format should include: `Session ID: <id>`
- Command 2: `node check.js --id <session-id>`
  - The expected command output format should include: `Is Active: <true|false>`
- The Convex backend must be successfully deployed and the cron job must be actively running in the cloud.

