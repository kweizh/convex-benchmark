import { action, mutation } from "./_generated/server";
import { v } from "convex/values";

export const insert = mutation({
  args: {
    runId: v.string(),
    text: v.string(),
    embedding: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("foods", args);
  },
});

export const searchSimilar = action({
  args: {
    runId: v.string(),
    vector: v.array(v.float64()),
  },
  handler: async (ctx, args) => {
    const results = await ctx.vectorSearch("foods", "by_embedding", {
      vector: args.vector,
      limit: 2,
      filter: (q) => q.eq("runId", args.runId),
    });

    return results.map(({ _id, _score }) => ({ _id, _score }));
  },
});
