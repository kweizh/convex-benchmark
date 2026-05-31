import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";
import fs from "fs";

const client = new ConvexHttpClient(process.env.CONVEX_URL);

async function main() {
  const result = await client.action(api.config.getToken);
  fs.appendFileSync("output.log", `Token: ${result}\n`);
}

main().catch(console.error);
