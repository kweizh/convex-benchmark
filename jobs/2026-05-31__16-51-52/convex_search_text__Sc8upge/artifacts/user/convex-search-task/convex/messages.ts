import { query } from "./_generated/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

export const search = query({
  args: {
    query: v.string(),
    channel: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withSearchIndex("search_body", (q) => {
        const search = q.search("body", args.query);
        if (args.channel !== undefined) {
          return search.eq("channel", args.channel);
        }
        return search;
      })
      .paginate(args.paginationOpts);
  },
});
