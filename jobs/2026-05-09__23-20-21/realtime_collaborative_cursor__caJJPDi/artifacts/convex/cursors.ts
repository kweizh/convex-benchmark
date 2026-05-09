import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const update = mutation({
  args: {
    id: v.string(),
    x: v.number(),
    y: v.number(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("cursors")
      .withIndex("by_cursor_id", (q) => q.eq("id", args.id))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { x: args.x, y: args.y, color: args.color });
    } else {
      await ctx.db.insert("cursors", { id: args.id, x: args.x, y: args.y, color: args.color });
    }
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("cursors").collect();
  },
});
