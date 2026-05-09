import { v } from "convex/values";
import { query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const searchMessages = query({
  args: {
    paginationOpts: paginationOptsValidator,
    query: v.string(),
    channel: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withSearchIndex("search_body", (q) =>
        q.search("body", args.query).eq("channel", args.channel)
      )
      .paginate(args.paginationOpts);
  },
});
