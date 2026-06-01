import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks_zr_4dcjjyz: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
});
