import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  products_zr_wudy4vx: defineTable({
    name: v.string(),
    price: v.number(),
  }),
});