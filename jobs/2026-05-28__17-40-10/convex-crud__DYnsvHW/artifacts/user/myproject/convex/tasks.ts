import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks_zr_dynsvhw", {
      text: args.text,
      status: "todo",
    });
    return taskId;
  },
});

export const get = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks_zr_dynsvhw")
      .withIndex("by_status", (q) => q.eq("status", args.status as any))
      .collect();
  },
});
