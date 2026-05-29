import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  repo_pitches: defineTable({
    repo: v.string(),
    pitch: v.string(),
  }),
});
