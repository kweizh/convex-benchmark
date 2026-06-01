import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const safeRunId = "zr_tesyycm";
const usersTableName = `users_${safeRunId}` as const;
const documentsTableName = `documents_${safeRunId}` as const;

export default defineSchema({
  [usersTableName]: defineTable({
    name: v.string(),
    role: v.string(),
  }),
  [documentsTableName]: defineTable({
    title: v.string(),
    content: v.string(),
    authorId: v.id(usersTableName),
  }),
});
