import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// We will replace zr_sba2zgj with the actual run ID before deployment
const tableName = `messages_zr_sba2zgj`;

export default defineSchema({
  [tableName]: defineTable({
    userId: v.string(),
    text: v.string(),
  }),
});
