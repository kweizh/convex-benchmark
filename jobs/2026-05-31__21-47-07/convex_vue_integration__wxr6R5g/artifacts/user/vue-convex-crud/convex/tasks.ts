import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { tableName: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.query(args.tableName as any).collect();
  },
});

export const create = mutation({
  args: { tableName: v.string(), text: v.string(), isCompleted: v.boolean() },
  handler: async (ctx, args) => {
    return await ctx.db.insert(args.tableName as any, {
      text: args.text,
      isCompleted: args.isCompleted,
    });
  },
});

export const toggle = mutation({
  args: { tableName: v.string(), id: v.string() },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id as any);
    if (!task) throw new Error("Task not found");
    return await ctx.db.patch(args.id as any, {
      isCompleted: !task.isCompleted,
    });
  },
});

const deleteFn = mutation({
  args: { tableName: v.string(), id: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id as any);
  },
});

export { deleteFn as delete };
