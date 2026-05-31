import { query } from "./_generated/server";
import { v } from "convex/values";

export const get_webhook = query({
  args: {
    runId: v.string(),
  },
  handler: async (ctx, { runId }) => {
    return await ctx.db
      .query("webhooks")
      .withIndex("by_runId", (q) => q.eq("runId", runId))
      .collect();
  },
});
