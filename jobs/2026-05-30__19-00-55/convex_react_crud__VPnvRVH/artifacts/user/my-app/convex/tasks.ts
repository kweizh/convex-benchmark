import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    runId: v.string(),
    status: v.optional(v.union(v.literal("todo"), v.literal("done"))),
  },
  handler: async (ctx, args) => {
    let q = ctx.db.query("tasks").withIndex("by_run_id_and_status", (q) => q.eq("runId", args.runId));
    if (args.status) {
      q = ctx.db.query("tasks").withIndex("by_run_id_and_status", (q) => q.eq("runId", args.runId).eq("status", args.status));
    }
    return await q.collect();
  },
});

export const add = mutation({
  args: {
    text: v.string(),
    runId: v.string(),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", {
      text: args.text,
      status: "todo",
      runId: args.runId,
    });
    return taskId;
  },
});

export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(v.literal("todo"), v.literal("done")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const remove = mutation({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
