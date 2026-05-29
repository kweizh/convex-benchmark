import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const add = mutation({
  args: { text: v.string(), run_id: v.string() },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", { text: args.text, run_id: args.run_id });
    return taskId;
  },
});

export const get_by_run_id = query({
  args: { run_id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("run_id"), args.run_id))
      .collect();
  },
});
