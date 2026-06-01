import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

const tableName = "tasks_zr_4dcjjyz";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query(tableName as any).collect();
  },
});

export const create = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert(tableName as any, {
      text: args.text,
      isCompleted: false,
    });
  },
});

export const toggle = mutation({
  args: { id: v.id(tableName as any) },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (task) {
      await ctx.db.patch(args.id, {
        isCompleted: !task.isCompleted,
      });
    }
  },
});

export const remove = mutation({
  args: { id: v.id(tableName as any) },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
