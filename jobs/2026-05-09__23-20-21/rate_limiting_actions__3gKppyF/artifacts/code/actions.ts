import { action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const doWork = action({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const success = await ctx.runMutation(api.rateLimit.checkAndIncrement, {
      userId: args.userId,
    });

    if (!success) {
      throw new Error("Rate limit exceeded");
    }

    return "Work completed";
  },
});
