import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    role: v.string(),
  }),
  tasks: defineTable({
    text: v.string(),
    status: v.string(),
  }),
});
