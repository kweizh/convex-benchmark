import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
  tasks_zr_wo4sgv8: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
    priority: v.string(),
  }),
});
