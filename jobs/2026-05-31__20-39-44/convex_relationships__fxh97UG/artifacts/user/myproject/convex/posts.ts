import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ========== QUERIES ==========

export const getUsersWithPosts = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const usersWithPosts = await Promise.all(
      users.map(async (user) => {
        const posts = await ctx.db
          .query("posts")
          .filter((q) => q.eq(q.field("author_id"), user._id))
          .collect();
        return { ...user, posts };
      })
    );
    return usersWithPosts;
  },
});

export const getPostsWithTags = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").collect();
    const postsWithTags = await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.author_id);
        const postTags = await ctx.db
          .query("post_tags")
          .filter((q) => q.eq(q.field("post_id"), post._id))
          .collect();
        const tags = await Promise.all(
          postTags.map(async (pt) => {
            const tag = await ctx.db.get(pt.tag_id);
            return tag;
          })
        );
        return {
          ...post,
          authorName: author?.name ?? "Unknown",
          tags: tags.filter((t) => t !== null),
        };
      })
    );
    return postsWithTags;
  },
});

export const getAllTags = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tags").collect();
  },
});

// ========== MUTATIONS ==========

export const createUser = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", { name: args.name });
  },
});

export const createPost = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    author_id: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("posts", {
      title: args.title,
      content: args.content,
      author_id: args.author_id,
    });
  },
});

export const createTag = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tags", { name: args.name });
  },
});

export const addTagToPost = mutation({
  args: {
    post_id: v.id("posts"),
    tag_id: v.id("tags"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("post_tags", {
      post_id: args.post_id,
      tag_id: args.tag_id,
    });
  },
});