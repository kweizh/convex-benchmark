import { mutation } from "./_generated/server";

export const cleanup = mutation({
  args: {},
  handler: async (ctx) => {
    const runId = process.env.ZEALT_RUN_ID;
    const tableName = `sessions_${runId}` as any;
    const now = Date.now();

    const expiredSessions = await ctx.db
      .query(tableName)
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect();

    for (const doc of expiredSessions) {
      await ctx.db.delete(doc._id);
    }
  },
});