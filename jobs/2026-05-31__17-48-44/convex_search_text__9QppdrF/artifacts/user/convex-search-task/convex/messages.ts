import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { query } from "./_generated/server";

export const search = query({
  args: {
    query: v.string(),
    channel: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const searchQuery = ctx.db
      .query("messages")
      .withSearchIndex("search_body", (q) => {
        let search = q.search("body", args.query);
        if (args.channel) {
          search = search.eq("channel", args.channel);
        }
        return search;
      });

    return await searchQuery.paginate(args.paginationOpts);
  },
});
