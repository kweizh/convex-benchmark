import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  sessions: defineTable({
    runId: v.string(),
    expiresAt: v.number(),
    isActive: v.boolean(),
  }).index("isActive", ["isActive"]),
});