import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    body: v.string(),
    channel: v.string(),
  }).searchIndex("search_body", {
    searchField: "body",
    filterFields: ["channel"],
  }),
});