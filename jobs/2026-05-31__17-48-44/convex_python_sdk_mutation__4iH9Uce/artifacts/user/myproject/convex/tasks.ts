import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const add = mutation({
  args: {
    text: v.string(),
    isCompleted: v.boolean(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("tasks", {
      text: args.text,
      isCompleted: args.isCompleted,
    });
    return id;
  },
});

export const get = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedId = ctx.db.normalizeId("tasks", args.id);
    if (!normalizedId) {
      return null;
    }
    return await ctx.db.get(normalizedId);
  },
});
