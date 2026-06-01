import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const runId = (process.env.ZEALT_RUN_ID || "default").replace(/-/g, "_");

export default defineSchema({
  [`users_${runId}`]: defineTable({
    name: v.string(),
    role: v.string(),
  }),
  [`documents_${runId}`]: defineTable({
    title: v.string(),
    content: v.string(),
    authorId: v.id(`users_${runId}`),
  }),
});
