import { mutationGeneric } from "convex/server";
import { v } from "convex/values";

export const createUser = mutationGeneric({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return ctx.db.insert("users", { name: args.name });
  },
});

export const createPost = mutationGeneric({
  args: {
    title: v.string(),
    content: v.string(),
    authorId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("posts", {
      title: args.title,
      content: args.content,
      author_id: args.authorId,
    });
  },
});

export const createTag = mutationGeneric({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return ctx.db.insert("tags", { name: args.name });
  },
});

export const addTagToPost = mutationGeneric({
  args: {
    postId: v.id("posts"),
    tagId: v.id("tags"),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("post_tags")
      .withIndex("by_post_tag", (q) =>
        q.eq("post_id", args.postId).eq("tag_id", args.tagId),
      )
      .first();

    if (existing) {
      return existing._id;
    }

    return ctx.db.insert("post_tags", {
      post_id: args.postId,
      tag_id: args.tagId,
    });
  },
});
