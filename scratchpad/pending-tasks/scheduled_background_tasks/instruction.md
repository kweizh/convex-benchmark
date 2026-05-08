Convex allows scheduling functions to run in the background using `ctx.scheduler`, which is highly useful for maintenance tasks like cleaning up stale data.

You need to implement a scheduled cleanup workflow in `convex/cleanup.ts` to remove expired user sessions. Write a mutation named `removeExpiredSessions` that queries the `sessions` table for all records where the `expiresAt` timestamp is less than the current time, and deletes them. Then, write a mutation named `triggerCleanup` that uses `ctx.scheduler.runAfter` to schedule this cleanup mutation to run immediately (after 0 milliseconds).

**Constraints:**
- Use `ctx.db.delete()` to remove the records.
- Do NOT use standard Node.js timing functions like `setTimeout`; you must use the Convex scheduler API exclusively.