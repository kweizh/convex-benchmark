import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Table name derived from ZEALT_RUN_ID (zr-grthqad -> tasks_zr_grthqad)
// Environment variables are not available during schema evaluation, so this must be hardcoded
export const TABLE_NAME = "tasks_zr_grthqad";

export default defineSchema({
  [TABLE_NAME]: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
});