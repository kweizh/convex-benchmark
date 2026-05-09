import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const setTyping = mutation({
  args: { user: v.string(), isTyping: v.boolean() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("typing_indicators")
      .withIndex("by_user", (q) => q.eq("user", args.user))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        isTyping: args.isTyping,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("typing_indicators", {
        user: args.user,
        isTyping: args.isTyping,
        updatedAt: Date.now(),
      });
    }
  },
});

export const getTypingUsers = query({
  args: {},
  handler: async (ctx) => {
    const typingUsers = await ctx.db
      .query("typing_indicators")
      .filter((q) => q.eq(q.field("isTyping"), true))
      .collect();
    return typingUsers.map((u) => u.user);
  },
});
