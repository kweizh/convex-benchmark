import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  rateLimits: defineTable({
    userId: v.string(),
    count: v.number(),
  }).index("by_userId", ["userId"]),
});
