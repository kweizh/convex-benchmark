import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

export const insert_webhook = internalMutation({
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

export const get_webhook = query({
  args: {
    runId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("webhooks")
      .withIndex("by_runId", (q) => q.eq("runId", args.runId))
      .collect();
  },
});
