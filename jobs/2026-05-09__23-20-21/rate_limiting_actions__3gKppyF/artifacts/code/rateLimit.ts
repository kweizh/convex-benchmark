import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const checkAndIncrement = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const record = await ctx.db
      .query("rateLimits")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();

    if (!record) {
      await ctx.db.insert("rateLimits", {
        userId: args.userId,
        count: 1,
      });
      return true;
    }

    if (record.count < 3) {
      await ctx.db.patch(record._id, {
        count: record.count + 1,
      });
      return true;
    }

    return false;
  },
});
