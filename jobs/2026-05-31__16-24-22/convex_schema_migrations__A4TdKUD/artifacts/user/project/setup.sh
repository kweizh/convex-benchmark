#!/bin/bash
export TABLE_NAME="tasks_${ZEALT_RUN_ID//-/_}"
cat <<SCHEMA > convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
  ${TABLE_NAME}: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
});
SCHEMA

cat <<SETUP_MUTATION > convex/setup.ts
import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    await ctx.db.insert("${TABLE_NAME}", { text: "Buy groceries", isCompleted: true });
    await ctx.db.insert("${TABLE_NAME}", { text: "Go for a swim", isCompleted: true });
    await ctx.db.insert("${TABLE_NAME}", { text: "Integrate Convex", isCompleted: false });
  },
});
SETUP_MUTATION

npx convex deploy
npx convex run setup:seed
