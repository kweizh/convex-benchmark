import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products_zr_7hmiof7: defineTable({
    name: v.string(),
    price: v.number(),
  }),
});
