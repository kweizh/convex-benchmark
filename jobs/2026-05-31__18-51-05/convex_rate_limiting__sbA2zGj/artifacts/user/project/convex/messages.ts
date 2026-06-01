import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { RateLimiter } from "@convex-dev/rate-limiter";
import { components } from "./_generated/api";

const rateLimiter = new RateLimiter(components.rateLimiter, {
  sendMessage: { kind: "fixed window", rate: 3, period: 10000 },
});

export const sendMessage = mutation({
  args: {
    userId: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const runId = process.env.ZEALT_RUN_ID || "default";
    const tableName = `messages_${runId.replace(/-/g, "_")}`;

    // Rate limit key includes run-id to prevent cross-run conflicts
    const key = `${runId}_${args.userId}`;
    const status = await rateLimiter.limit(ctx, "sendMessage", { key });

    if (!status.ok) {
      throw new Error(`Rate limit exceeded. Try again in ${status.retryAfter}ms`);
    }

    await ctx.db.insert(tableName as any, {
      userId: args.userId,
      text: args.text,
    });
  },
});
