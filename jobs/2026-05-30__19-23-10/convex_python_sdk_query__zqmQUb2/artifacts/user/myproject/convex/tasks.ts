import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

export const add = mutation({
  args: { text: v.string(), status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", { text: args.text, status: args.status });
  },
});
