import { mutation } from "../_generated/server";
import { v, ConvexError } from "convex/values";

const runId = (process.env.ZEALT_RUN_ID as string).replace(/-/g, "_");

export default mutation({
  args: { userId: v.string(), title: v.string(), content: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId as any);
    if (!user || (user.role !== "admin" && user.role !== "editor")) {
      throw new ConvexError("Unauthorized");
    }

    const documentId = await ctx.db.insert(`documents_${runId}`, {
      title: args.title,
      content: args.content,
      authorId: args.userId as any,
    });

    return documentId;
  },
});