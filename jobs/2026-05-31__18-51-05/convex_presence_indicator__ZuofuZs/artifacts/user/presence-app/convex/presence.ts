import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const heartbeat = mutation({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.user_id))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { updated_at: Date.now() });
    } else {
      await ctx.db.insert("presence", {
        user_id: args.user_id,
        updated_at: Date.now(),
      });
    }
  },
});

export const getOnlineUsers = query({
  args: {},
  handler: async (ctx) => {
    const fifteenSecondsAgo = Date.now() - 15000;
    const onlineUsers = await ctx.db
      .query("presence")
      .filter((q) => q.gt(q.field("updated_at"), fifteenSecondsAgo))
      .collect();
    return onlineUsers;
  },
});
