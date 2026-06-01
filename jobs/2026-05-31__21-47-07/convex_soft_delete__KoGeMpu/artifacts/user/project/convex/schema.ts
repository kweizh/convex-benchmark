import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages_zr_kogempu: defineTable({
    text: v.string(),
    isDeleted: v.boolean(),
  }),
});
