import { action, mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const saveMessage = mutation({
  args: { text: v.string() },
  handler: async (ctx: any, args: { text: string }) => {
    await ctx.db.insert("messages", { text: args.text });
  },
});

export const sendMessageAction = action({
  args: { text: v.string() },
  handler: async (ctx: any, args: { text: string }) => {
    let attempts = 0;
    const maxAttempts = 4;
    let lastError: any;

    while (attempts < maxAttempts) {
      try {
        const response = await fetch("https://httpstat.us/200", {
          method: "POST",
          body: JSON.stringify({ text: args.text }),
        });

        if (response.ok) {
          await ctx.runMutation(api.messages.saveMessage, { text: args.text });
          return;
        }
        
        lastError = new Error(`Status ${response.status}: ${response.statusText}`);
      } catch (error) {
        lastError = error;
      }
      attempts++;
    }

    throw new Error(`Failed to send message after ${maxAttempts} attempts. Last error: ${lastError?.message}`);
  },
});
