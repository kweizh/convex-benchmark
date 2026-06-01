import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

let runId = "zr_5qpajai";
try {
  runId = process.env.ZEALT_RUN_ID || "zr_5qpajai";
} catch (e) {}
const safeRunId = runId.replace(/-/g, "_");

export default defineSchema({
  [`users_${safeRunId}`]: defineTable({
    name: v.string(),
    role: v.string(),
  }),
  [`documents_${safeRunId}`]: defineTable({
    title: v.string(),
    content: v.string(),
    authorId: v.id(`users_${safeRunId}`),
  }),
});
