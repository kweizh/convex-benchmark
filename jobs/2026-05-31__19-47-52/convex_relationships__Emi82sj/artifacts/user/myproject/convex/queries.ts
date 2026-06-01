import { queryGeneric } from "convex/server";

export const getUsers = queryGeneric({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("users").collect();
  },
});

export const getTags = queryGeneric({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("tags").collect();
  },
});

export const getPosts = queryGeneric({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("posts").collect();
  },
});

export const getUsersWithPosts = queryGeneric({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();

    const usersWithPosts = await Promise.all(
      users.map(async (user) => {
        const posts = await ctx.db
          .query("posts")
          .withIndex("by_author", (q) => q.eq("author_id", user._id))
          .collect();

        return {
          ...user,
          posts,
        };
      }),
    );

    return usersWithPosts;
  },
});

export const getPostsWithTags = queryGeneric({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").collect();

    const postsWithTags = await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.author_id);
        const postTags = await ctx.db
          .query("post_tags")
          .withIndex("by_post", (q) => q.eq("post_id", post._id))
          .collect();
        const tags = await Promise.all(
          postTags.map((postTag) => ctx.db.get(postTag.tag_id)),
        );

        return {
          ...post,
          author,
          tags: tags.filter((tag) => tag !== null),
        };
      }),
    );

    return postsWithTags;
  },
});
