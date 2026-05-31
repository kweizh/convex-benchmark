import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listByRunId = query({
  args: { runId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db
      .query("tasks")
      .withIndex("by_run_id", (q) => q.eq("runId", args.runId))
      .collect();
  },
});

export const addTask = mutation({
  args: { text: v.string(), runId: v.string() },
  handler: async (ctx, args) => {
    return ctx.db.insert("tasks", {
      text: args.text,
      runId: args.runId,
      isCompleted: false,
    });
  },
});
