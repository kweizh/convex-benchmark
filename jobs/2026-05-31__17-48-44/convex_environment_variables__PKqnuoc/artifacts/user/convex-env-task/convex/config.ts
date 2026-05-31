import { action } from "./_generated/server";

export const getToken = action(async () => {
  return process.env.SECRET_TOKEN ?? "";
});
