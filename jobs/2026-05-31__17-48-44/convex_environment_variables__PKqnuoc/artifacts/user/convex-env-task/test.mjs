import { appendFile } from "node:fs/promises";
import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";

const client = new ConvexHttpClient(process.env.CONVEX_URL);
const token = await client.action(api.config.getToken);

await appendFile("/home/user/convex-env-task/output.log", `Token: ${token}\n`);
