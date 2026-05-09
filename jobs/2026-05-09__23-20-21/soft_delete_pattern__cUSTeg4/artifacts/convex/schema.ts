import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    isDeleted: v.boolean(),
  }).index("by_deleted", ["isDeleted"]),
});
