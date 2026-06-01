import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { TABLE_NAME } from "./schema";

// Get all tasks
export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query(TABLE_NAME).collect();
  },
});

// Create a new task
export const create = mutation({
  args: {
    text: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert(TABLE_NAME, {
      text: args.text,
      isCompleted: false,
    });
  },
});

// Toggle a task's completion status
export const toggle = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id as any);
    if (task) {
      await ctx.db.patch(args.id as any, {
        isCompleted: !task.isCompleted,
      });
    }
  },
});

// Delete a task
export const deleteTask = mutation({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id as any);
  },
});