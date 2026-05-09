import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  cursors: defineTable({
    id: v.string(),
    x: v.number(),
    y: v.number(),
    color: v.string(),
  }).index("by_cursor_id", ["id"]),
});
