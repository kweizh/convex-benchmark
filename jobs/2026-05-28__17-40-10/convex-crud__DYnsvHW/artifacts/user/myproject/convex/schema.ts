import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks_zr_dynsvhw: defineTable({
    text: v.string(),
    status: v.union(v.literal("todo"), v.literal("done")),
  }).index("by_status", ["status"]),
});
