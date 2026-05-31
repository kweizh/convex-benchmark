import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    age: v.number(),
    role: v.union(v.literal("admin"), v.literal("user")),
  }),
});