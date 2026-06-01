import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { documentsTableName, usersTableName } from "./tableNames";
import { Id } from "./_generated/dataModel";

const getUserById = async (ctx: { db: any }, userId: string) => {
  const user = await ctx.db.get(userId as Id<typeof usersTableName>);
  if (!user) {
    throw new ConvexError("Unauthorized");
  }
  return user;
};

export const get = query({
  args: { userId: v.string() },
  handler: async (ctx) => {
    return await ctx.db.query(documentsTableName).collect();
  },
});

export const create = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getUserById(ctx, args.userId);
    if (user.role !== "admin" && user.role !== "editor") {
      throw new ConvexError("Unauthorized");
    }

    const documentId = await ctx.db.insert(documentsTableName, {
      title: args.title,
      content: args.content,
      authorId: args.userId as Id<typeof usersTableName>,
    });

    return documentId;
  },
});

const deleteDocument = mutation({
  args: {
    userId: v.string(),
    documentId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getUserById(ctx, args.userId);
    if (user.role !== "admin") {
      throw new ConvexError("Unauthorized");
    }

    await ctx.db.delete(args.documentId as Id<typeof documentsTableName>);
  },
});

export { deleteDocument as delete };
