import { v } from "convex/values";
import { query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const search = query({
  args: {
    query: v.string(),
    channel: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    let dbQuery = ctx.db
      .query("messages")
      .withSearchIndex("search_body", (q) => {
        let searchQ = q.search("body", args.query);
        if (args.channel !== undefined) {
          searchQ = searchQ.eq("channel", args.channel);
        }
        return searchQ;
      });

    return await dbQuery.paginate(args.paginationOpts);
  },
});
