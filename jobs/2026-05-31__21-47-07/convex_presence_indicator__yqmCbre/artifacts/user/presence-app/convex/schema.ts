import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  presence: defineTable({
    user_id: v.string(),
    updated_at: v.number(),
  }).index("by_user_id", ["user_id"]),
});
