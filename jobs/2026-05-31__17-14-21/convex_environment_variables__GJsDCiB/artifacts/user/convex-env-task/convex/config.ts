import { action } from "./_generated/server";

export const getToken = action({
  args: {},
  handler: async () => {
    return process.env.SECRET_TOKEN ?? null;
  },
});