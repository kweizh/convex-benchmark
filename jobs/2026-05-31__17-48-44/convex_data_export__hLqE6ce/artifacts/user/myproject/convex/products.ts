import { query } from "./_generated/server";

const productsTableName = "products_zr_hlqe6ce" as any;

export const list = query(async (ctx) => {
  return await ctx.db.query(productsTableName).collect();
});
