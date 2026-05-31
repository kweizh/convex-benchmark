import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { runId: v.string() },
  handler: async (ctx, { runId }) => {
    return await ctx.db
      .query("counters")
      .withIndex("by_runId", (q) => q.eq("runId", runId))
      .unique();
  },
});

export const increment = mutation({
  args: { runId: v.string() },
  handler: async (ctx, { runId }) => {
    const existing = await ctx.db
      .query("counters")
      .withIndex("by_runId", (q) => q.eq("runId", runId))
      .unique();

    if (existing) {
      const nextCount = existing.count + 1;
      await ctx.db.patch(existing._id, { count: nextCount });
      return nextCount;
    }

    await ctx.db.insert("counters", { runId, count: 1 });
    return 1;
  },
});
