import { action } from "./_generated/server";

export const getToken = action({
  args: {},
  handler: async (ctx) => {
    return process.env.SECRET_TOKEN;
  },
});
