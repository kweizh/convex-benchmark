import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    text: v.string(),
    run_id: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("tasks", {
      text: args.text,
      run_id: args.run_id,
    });
  },
});

export const get = query({
  args: {
    run_id: v.string(),
  },
  handler: async (ctx, args) => {
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_run_id", (q) => q.eq("run_id", args.run_id))
      .collect();
    return tasks.map((t) => t.text);
  },
});
