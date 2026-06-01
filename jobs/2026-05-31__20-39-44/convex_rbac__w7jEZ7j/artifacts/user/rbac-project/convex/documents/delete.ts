import { mutation } from "../_generated/server";
import { v, ConvexError } from "convex/values";

const runId = (process.env.ZEALT_RUN_ID as string).replace(/-/g, "_");

export default mutation({
  args: { userId: v.string(), documentId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId as any);
    if (!user || user.role !== "admin") {
      throw new ConvexError("Unauthorized");
    }

    await ctx.db.delete(args.documentId as any);
  },
});