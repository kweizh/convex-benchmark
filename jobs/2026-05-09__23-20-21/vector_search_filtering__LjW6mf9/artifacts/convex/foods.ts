import { v } from "convex/values";
import { internalQuery, action } from "./_generated/server";
import { internal } from "./_generated/api";

export const fetchResults = internalQuery({
  args: { ids: v.array(v.id("foods")) },
  handler: async (ctx, args) => {
    const results = [];
    for (const id of args.ids) {
      const doc = await ctx.db.get(id);
      if (doc) {
        results.push(doc);
      }
    }
    return results;
  },
});

export const similarFoods = action({
  args: {
    vector: v.array(v.float64()),
    cuisine: v.string(),
  },
  handler: async (ctx, args) => {
    const results = await ctx.vectorSearch("foods", "by_embedding", {
      vector: args.vector,
      filter: (q) => q.eq("cuisine", args.cuisine),
      limit: 10,
    });

    const ids = results.map((r) => r._id);

    const docs = await ctx.runQuery(internal.foods.fetchResults, { ids });

    return docs;
  },
});
