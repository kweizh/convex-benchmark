import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages_zr_axwiqsq: defineTable({
    text: v.string(),
    isDeleted: v.boolean(),
  }),
});
