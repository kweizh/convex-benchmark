import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const insertSession = mutation({
  args: { sessionId: v.string(), expiresAt: v.number() },
  handler: async (ctx, args) => {
    await ctx.db.insert("sessions", {
      sessionId: args.sessionId,
      expiresAt: args.expiresAt,
    });
  },
});

export const getSessions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("sessions").collect();
  },
});

export const clearExpired = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expiredSessions = await ctx.db
      .query("sessions")
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect();

    for (const session of expiredSessions) {
      await ctx.db.delete(session._id);
    }
  },
});
