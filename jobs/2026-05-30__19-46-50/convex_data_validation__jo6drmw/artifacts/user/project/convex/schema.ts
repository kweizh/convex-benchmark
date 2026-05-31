import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const tableName = "products_zr_jo6drmw";

export default defineSchema({
  [tableName]: defineTable({
    name: v.string(),
    price: v.number(),
    inStock: v.boolean(),
  }),
});
