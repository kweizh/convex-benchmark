import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    run_id: v.string(),
  }).index("by_run_id", ["run_id"]),
});
