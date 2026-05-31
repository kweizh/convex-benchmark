import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const insertWebhook = internalMutation({
  args: {
    payload: v.string(),
    runId: v.string(),
  },
  handler: async (ctx, { payload, runId }) => {
    await ctx.db.insert("webhooks", { payload, runId });
  },
});
