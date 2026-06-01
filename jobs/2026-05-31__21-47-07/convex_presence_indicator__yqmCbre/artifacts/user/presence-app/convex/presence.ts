import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const heartbeat = mutation({
  args: { user_id: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("presence")
      .withIndex("by_user_id", (q) => q.eq("user_id", args.user_id))
      .first();

    const now = Date.now();
    if (existing) {
      await ctx.db.patch(existing._id, { updated_at: now });
    } else {
      await ctx.db.insert("presence", {
        user_id: args.user_id,
        updated_at: now,
      });
    }
  },
});

export const getOnlineUsers = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const threshold = now - 15000; // 15 seconds ago
    
    const allPresence = await ctx.db.query("presence").collect();
    
    // Filter and sort manually since we don't have an index on updated_at
    // Or we could add an index, but this is fine for this task
    return allPresence
      .filter((p) => p.updated_at >= threshold)
      .map((p) => p.user_id);
  },
});
