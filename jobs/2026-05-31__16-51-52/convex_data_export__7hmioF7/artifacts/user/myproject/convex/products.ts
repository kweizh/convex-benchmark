import { query } from "./_generated/server";

export const getProducts = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("products_zr_7hmiof7").collect();
  },
});
