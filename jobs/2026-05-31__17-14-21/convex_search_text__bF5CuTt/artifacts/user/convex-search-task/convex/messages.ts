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
    const { query, channel, paginationOpts } = args;

    let searchQuery = ctx.db
      .query("messages")
      .withSearchIndex("search_body", (q) => {
        if (channel !== undefined) {
          return q.search("body", query).eq("channel", channel);
        }
        return q.search("body", query);
      });

    return await searchQuery.paginate(paginationOpts);
  },
});