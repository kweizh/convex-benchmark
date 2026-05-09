import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  typing_indicators: defineTable({
    user: v.string(),
    isTyping: v.boolean(),
    updatedAt: v.number(),
  }).index("by_user", ["user"]),
});
