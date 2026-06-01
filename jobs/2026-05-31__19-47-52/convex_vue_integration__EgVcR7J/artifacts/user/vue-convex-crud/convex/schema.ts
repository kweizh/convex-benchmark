import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { tasksTable } from "./tableName";

const schema = defineSchema({
  [tasksTable]: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
});

export default schema;
