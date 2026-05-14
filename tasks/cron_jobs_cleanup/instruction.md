# Convex Cron Job Cleanup

## Background
You need to set up a Convex project that includes a cron job to clean up expired session data every hour.

## Requirements
- Initialize a Node.js project in `/home/user/convex-cron`.
- Install `convex`.
- Create a Convex schema with a `sessions` table containing `expiresAt` (number).
- Create an internal mutation in `convex/sessions.ts` named `cleanupExpired` that deletes all sessions where `expiresAt` is less than the current time (passed as an argument or using `Date.now()`).
- Create a cron job in `convex/crons.ts` that runs `cleanupExpired` every hour using `crons.hourly()`.

## Implementation Guide
1. `mkdir -p /home/user/convex-cron && cd /home/user/convex-cron`
2. `npm init -y`
3. `npm install convex`
4. Create `convex/schema.ts` defining the `sessions` table.
5. Create `convex/sessions.ts` with the `cleanupExpired` internal mutation.
6. Create `convex/crons.ts` defining the hourly cron job.

## Constraints
- Project path: /home/user/convex-cron
- The mutation must be exported as `cleanupExpired` and use `internalMutation`.
- The cron job must use `crons.hourly()`.