import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { tasksTable } from "./tableName";

const tableName = tasksTable as string;

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query(tableName).order("desc").collect();
  },
});

export const create = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const trimmed = args.text.trim();
    if (!trimmed) {
      return null;
    }
    return await ctx.db.insert(tableName, {
      text: trimmed,
      isCompleted: false,
    });
  },
});

export const toggle = mutation({
  args: { id: v.id(tableName as any) },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);
    if (!task) {
      return null;
    }
    await ctx.db.patch(args.id, { isCompleted: !task.isCompleted });
    return args.id;
  },
});

export const remove = mutation({
  args: { id: v.id(tableName as any) },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return args.id;
  },
});
