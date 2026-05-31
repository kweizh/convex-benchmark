import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const cleanupExpiredSessions = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expiredSessions = await ctx.db
      .query("sessions")
      .withIndex("isActive", (q) => q.eq("isActive", true))
      .filter((q) => q.lt(q.field("expiresAt"), now))
      .collect();

    for (const session of expiredSessions) {
      await ctx.db.patch(session._id, { isActive: false });
    }

    return expiredSessions.length;
  },
});

export const createSession = mutation({
  args: {
    runId: v.string(),
    expiresAt: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const sessionId = await ctx.db.insert("sessions", {
      runId: args.runId,
      expiresAt: args.expiresAt,
      isActive: args.isActive,
    });
    return sessionId;
  },
});

export const getSession = query({
  args: {
    id: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});