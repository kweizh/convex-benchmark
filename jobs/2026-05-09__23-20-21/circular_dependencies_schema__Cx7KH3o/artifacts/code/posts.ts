import { query } from "./_generated/server";
import { api } from "./_generated/api";

export const getPost = query({
  args: {},
  handler: async (ctx): Promise<{ title: string; comment: any }> => {
    return { title: "Hello", comment: await ctx.runQuery(api.comments.getComment) };
  }
});
