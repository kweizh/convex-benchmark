import { mutation } from "./_generated/server";

export const cleanup = mutation({
  args: {},
  handler: async (ctx) => {
    const runId = process.env.ZEALT_RUN_ID;
    if (!runId) {
      throw new Error("ZEALT_RUN_ID environment variable is not set");
    }
    const tableName = `sessions_${runId}`;
    const now = Date.now();
    
    const expiredSessions = await ctx.db
      .query(tableName)
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect();

    for (const session of expiredSessions) {
      await ctx.db.delete(session._id);
    }
    
    return { deleted: expiredSessions.length };
  },
});
