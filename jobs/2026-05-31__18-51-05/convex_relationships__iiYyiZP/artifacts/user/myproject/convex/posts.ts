import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
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

export const list = query({
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").collect();
    return Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.author_id);
        const postTags = await ctx.db
          .query("post_tags")
          .filter((q) => q.eq(q.field("post_id"), post._id))
          .collect();
        const tags = await Promise.all(
          postTags.map(async (pt) => await ctx.db.get(pt.tag_id))
        );
        return {
          ...post,
          authorName: author?.name,
          tags: tags.filter((t) => t !== null),
        };
      })
    );
  },
});
