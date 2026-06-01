import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
  }),
  posts: defineTable({
    title: v.string(),
    content: v.string(),
    author_id: v.id("users"),
  }),
  tags: defineTable({
    name: v.string(),
  }),
  post_tags: defineTable({
    post_id: v.id("posts"),
    tag_id: v.id("tags"),
  }),
});
