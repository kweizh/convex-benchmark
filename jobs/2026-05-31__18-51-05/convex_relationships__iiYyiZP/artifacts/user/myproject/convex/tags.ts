import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tags", { name: args.name });
  },
});

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query("tags").collect();
  },
});

export const linkToPost = mutation({
  args: {
    post_id: v.id("posts"),
    tag_id: v.id("tags"),
  },
  handler: async (ctx, args) => {
    // Check if already linked
    const existing = await ctx.db
      .query("post_tags")
      .filter((q) =>
        q.and(
          q.eq(q.field("post_id"), args.post_id),
          q.eq(q.field("tag_id"), args.tag_id)
        )
      )
      .first();
    if (existing) return existing._id;
    return await ctx.db.insert("post_tags", {
      post_id: args.post_id,
      tag_id: args.tag_id,
    });
  },
});
