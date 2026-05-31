import { internalQuery } from "./_generated/server";

export const getAllProducts = internalQuery({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("products_zr_wudy4vx").collect();
    return products;
  },
});