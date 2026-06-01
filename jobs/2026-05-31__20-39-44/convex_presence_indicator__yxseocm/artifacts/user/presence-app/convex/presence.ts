import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const heartbeat = mutation({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("presence")
      .filter((q) => q.eq(q.field("user_id"), args.user_id))
      .first();

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
    const now = Date.now();
    const fifteenSecondsAgo = now - 15000;
    const allPresence = await ctx.db.query("presence").collect();
    return allPresence
      .filter((p) => p.updated_at >= fifteenSecondsAgo)
      .map((p) => p.user_id);
  },
});