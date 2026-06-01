import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users_zr_w7jez7j: defineTable({
    name: v.string(),
    role: v.string(),
  }),
  documents_zr_w7jez7j: defineTable({
    title: v.string(),
    content: v.string(),
    authorId: v.string(),
  }),
});