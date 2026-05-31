import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const cleanup = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const sessions = await ctx.db
      .query("sessions")
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    for (const session of sessions) {
      if (session.expiresAt < now) {
        await ctx.db.patch(session._id, { isActive: false });
      }
    }
  },
});

export const insertSession = mutation({
  args: { runId: v.string(), expiresAt: v.number(), isActive: v.boolean() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sessions", args);
  },
});

export const getSession = query({
  args: { id: v.id("sessions") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});