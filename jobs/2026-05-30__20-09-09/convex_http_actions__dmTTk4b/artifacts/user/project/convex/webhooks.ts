import { query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Internal mutation to insert a webhook record (called from HTTP action)
export const insertWebhook = internalMutation({
  args: {
    payload: v.string(),
    runId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("webhooks", {
      payload: args.payload,
      runId: args.runId,
    });
  },
});

// Query to get webhook records by runId
export const get_webhook = query({
  args: {
    runId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("webhooks")
      .filter((q) => q.eq(q.field("runId"), args.runId))
      .collect();
  },
});