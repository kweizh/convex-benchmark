import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  my_tasks: defineTable({
    text: v.string(),
  }),
});
