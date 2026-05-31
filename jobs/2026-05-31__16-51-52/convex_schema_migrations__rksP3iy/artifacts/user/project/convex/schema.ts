import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
  tasks_zr_rksp3iy: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
    priority: v.string(),
  }),
});
