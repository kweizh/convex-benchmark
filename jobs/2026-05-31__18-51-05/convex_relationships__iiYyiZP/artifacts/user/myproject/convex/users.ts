import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("users", { name: args.name });
  },
});

export const list = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    return Promise.all(
      users.map(async (user) => {
        const posts = await ctx.db
          .query("posts")
          .filter((q) => q.eq(q.field("author_id"), user._id))
          .collect();
        return { ...user, posts };
      })
    );
  },
});
