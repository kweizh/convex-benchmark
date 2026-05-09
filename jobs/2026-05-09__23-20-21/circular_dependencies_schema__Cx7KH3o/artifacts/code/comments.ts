import { query } from "./_generated/server";
import { api } from "./_generated/api";

export const getComment = query({
  args: {},
  handler: async (ctx): Promise<{ text: string; user: any }> => {
    return { text: "Nice", user: await ctx.runQuery(api.users.getUser) };
  }
});
