import { query } from "../_generated/server";
import { v } from "convex/values";

const runId = (process.env.ZEALT_RUN_ID as string).replace(/-/g, "_");

export default query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const documents = await ctx.db.query(`documents_${runId}`).collect();
    return documents;
  },
});