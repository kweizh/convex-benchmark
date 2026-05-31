import { ConvexHttpClient } from "convex/browser";
import { anyApi } from "convex/server";
import fs from "fs";

const api = anyApi;
const client = new ConvexHttpClient(process.env.CONVEX_URL);

const token = await client.action(api.config.getToken);

fs.appendFileSync("output.log", `Token: ${token}\n`);