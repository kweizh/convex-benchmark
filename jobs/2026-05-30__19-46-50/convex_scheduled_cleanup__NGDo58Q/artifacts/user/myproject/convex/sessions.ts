import { mutation } from "./_generated/server";

export const cleanup = mutation(async (ctx) => {
  const runId = process.env.ZEALT_RUN_ID;
  if (!runId) {
    throw new Error("ZEALT_RUN_ID is not set");
  }

  const tableName = `sessions_${runId}` as any;
  const expiredSessions = await ctx.db
    .query(tableName)
    .filter((q) => q.lt(q.field("expiresAt"), Date.now()))
    .collect();

  await Promise.all(expiredSessions.map((session) => ctx.db.delete(session._id)));
});
