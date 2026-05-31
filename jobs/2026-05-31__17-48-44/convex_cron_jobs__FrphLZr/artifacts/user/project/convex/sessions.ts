import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const createSession = mutation({
  args: {
    runId: v.string(),
    expiresAt: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("sessions", args);
    return id;
  },
});

export const getSession = query({
  args: { id: v.id("sessions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const cleanupExpiredSessions = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expiredSessions = await ctx.db
      .query("sessions")
      .withIndex("by_active_expires", (q) =>
        q.eq("isActive", true).lt("expiresAt", now)
      )
      .collect();

    for (const session of expiredSessions) {
      await ctx.db.patch(session._id, { isActive: false });
    }

    return { updatedCount: expiredSessions.length };
  },
});
