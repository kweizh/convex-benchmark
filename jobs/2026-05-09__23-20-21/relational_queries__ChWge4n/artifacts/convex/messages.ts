import { query } from "./_generated/server";

export const listMessages = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").collect();
    return Promise.all(
      messages.map(async (message) => {
        const author = await ctx.db.get(message.authorId);
        return {
          _id: message._id,
          text: message.text,
          authorName: author?.name ?? "Unknown",
        };
      })
    );
  },
});
