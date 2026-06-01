import { mutationGeneric, queryGeneric } from "convex/server";
import { v } from "convex/values";

export const heartbeat = mutationGeneric({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.user_id))
      .unique();

    const now = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, { updated_at: now });
      return existing._id;
    }

    return ctx.db.insert("presence", {
      user_id: args.user_id,
      updated_at: now,
    });
  },
});

export const getOnlineUsers = queryGeneric({
  args: {},
  handler: async (ctx) => {
    const cutoff = Date.now() - 15_000;
    const users = await ctx.db
      .query("presence")
      .filter((q) => q.gte(q.field("updated_at"), cutoff))
      .collect();

    return users.map((user) => ({
      user_id: user.user_id,
      updated_at: user.updated_at,
    }));
  },
});
