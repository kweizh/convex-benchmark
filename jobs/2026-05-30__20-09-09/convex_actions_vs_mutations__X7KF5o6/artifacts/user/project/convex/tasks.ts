import { action, mutation } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";

export const fetchAndSave = action({
  args: {},
  handler: async (ctx) => {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    const data = await response.json();

    const taskId = await ctx.runMutation(api.tasks.saveTask, {
      title: data.title,
    });
    return taskId;
  },
});

export const saveTask = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", {
      title: args.title,
      isCompleted: false,
    });
    return taskId;
  },
});