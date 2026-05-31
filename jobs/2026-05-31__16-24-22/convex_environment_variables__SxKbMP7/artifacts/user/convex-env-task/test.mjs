import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";
import fs from "fs";

const client = new ConvexHttpClient(process.env.CONVEX_URL);

async function run() {
  const token = await client.action(api.config.getToken);
  fs.appendFileSync("output.log", `Token: ${token}\n`);
}

run().catch(console.error);
