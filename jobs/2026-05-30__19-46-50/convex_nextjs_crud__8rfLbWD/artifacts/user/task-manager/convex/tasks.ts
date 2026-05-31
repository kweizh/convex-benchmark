import { mutation, query } from "convex/server";
import { v } from "convex/values";

export const listTasks = query({
  args: { runId: v.string() },
  handler: async (ctx, { runId }) => {
    return ctx.db
      .query("tasks")
      .withIndex("by_runId", (q) => q.eq("runId", runId))
      .order("desc")
      .collect();
  },
});

export const addTask = mutation({
  args: { text: v.string(), runId: v.string() },
  handler: async (ctx, { text, runId }) => {
    return ctx.db.insert("tasks", {
      text,
      runId,
      isCompleted: false,
    });
  },
});

export const toggleTask = mutation({
  args: { id: v.id("tasks"), runId: v.string() },
  handler: async (ctx, { id, runId }) => {
    const task = await ctx.db.get(id);
    if (!task || task.runId !== runId) {
      throw new Error("Task not found for this run.");
    }

    await ctx.db.patch(id, { isCompleted: !task.isCompleted });
    return null;
  },
});

export const deleteTask = mutation({
  args: { id: v.id("tasks"), runId: v.string() },
  handler: async (ctx, { id, runId }) => {
    const task = await ctx.db.get(id);
    if (!task || task.runId !== runId) {
      throw new Error("Task not found for this run.");
    }

    await ctx.db.delete(id);
    return null;
  },
});
