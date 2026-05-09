import { query } from "./_generated/server";
import { api } from "./_generated/api";

export const getUser = query({
  args: {},
  handler: async (ctx): Promise<{ name: string; post: any }> => {
    return { name: "Alice", post: await ctx.runQuery(api.posts.getPost) };
  }
});
