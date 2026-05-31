import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const productsTableName = "products_zr_hlqe6ce";

export default defineSchema({
  [productsTableName]: defineTable({
    name: v.string(),
    price: v.number(),
  }),
});
