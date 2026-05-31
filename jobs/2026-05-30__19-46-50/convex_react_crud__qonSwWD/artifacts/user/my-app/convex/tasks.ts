import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const statusValues = v.union(v.literal("todo"), v.literal("done"));

export const getTasks = query({
  args: {
    runId: v.string(),
    status: v.optional(statusValues),
  },
  handler: async (ctx, args) => {
    if (args.status) {
      return ctx.db
        .query("tasks")
        .withIndex("by_run_id_and_status", (q) =>
          q.eq("runId", args.runId).eq("status", args.status),
        )
        .collect();
    }

    return ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("runId"), args.runId))
      .collect();
  },
});

export const addTask = mutation({
  args: {
    text: v.string(),
    runId: v.string(),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("tasks", {
      text: args.text,
      status: "todo",
      runId: args.runId,
    });
  },
});

export const updateTaskStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: statusValues,
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const deleteTask = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
