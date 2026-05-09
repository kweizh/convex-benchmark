import { query, mutation } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const document = await ctx.db.query("counter").first();
    return document ? document.value : 0;
  },
});

export const increment = mutation({
  args: {},
  handler: async (ctx) => {
    const document = await ctx.db.query("counter").first();
    if (document) {
      await ctx.db.patch(document._id, { value: document.value + 1 });
    } else {
      await ctx.db.insert("counter", { value: 1 });
    }
  },
});
