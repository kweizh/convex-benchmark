import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const add = mutation({
  args: { text: v.string(), isCompleted: v.boolean() },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", {
      text: args.text,
      isCompleted: args.isCompleted,
    });
    return taskId;
  },
});

export const get = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const normalizedId = ctx.db.normalizeId("tasks", args.id);
    if (!normalizedId) {
      return null;
    }
    return await ctx.db.get(normalizedId);
  },
});
