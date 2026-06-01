import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages_zr_ajhkw43: defineTable({
    userId: v.string(),
    text: v.string(),
  }),
});