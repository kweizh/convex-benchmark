# Convex Cron Job for Data Aggregation

## Background
You have a Convex project initialized in `/home/user/project`. The `convex/schema.ts` file defines an `events` table (with `type` and `value` fields) and an `aggregations` table (with a `totalValue` field).
Your task is to create a scheduled background job that aggregates data from the `events` table every hour.

## Requirements
1. **Create `convex/aggregate.ts`**:
   - Define and export an internal mutation named `run`.
   - The mutation takes no arguments.
   - It should query all documents from the `events` table, calculate the total sum of the `value` field across all events, and insert a new document into the `aggregations` table with `totalValue` set to the calculated sum.

2. **Create `convex/crons.ts`**:
   - Initialize a `crons` object using `cronJobs()`.
   - Schedule the `internal.aggregate.run` mutation to run every 1 hour using `crons.interval`.
   - Name the interval job `"aggregate events"`.
   - Export the `crons` object as the default export.

## Implementation Guide
- In `convex/aggregate.ts`, import `internalMutation` from `./_generated/server` and use the object syntax (`internalMutation({ args: {}, handler: async (ctx, args) => { ... } })`).
- In `convex/crons.ts`, import `cronJobs` from `convex/server` and `internal` from `./_generated/api`.
- Do not use the deprecated `crons.hourly` helper. Use `crons.interval("aggregate events", { hours: 1 }, internal.aggregate.run, {})`.

## Constraints
- Project path: `/home/user/project`
- You do not need to run the project. Just create the correct files.