const fs = require("fs");
const path = require("path");
const { ConvexHttpClient } = require("convex/browser");

const envPath = path.join(__dirname, ".env.local");
if (!process.env.CONVEX_URL && fs.existsSync(envPath)) {
  const contents = fs.readFileSync(envPath, "utf8");
  for (const line of contents.split(/\r?\n/)) {
    if (!line || line.startsWith("#")) continue;
    const [key, ...rest] = line.split("=");
    if (!key) continue;
    const value = rest.join("=");
    if (value && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function main() {
  const url = process.env.CONVEX_URL;
  if (!url) {
    throw new Error("CONVEX_URL is not set");
  }

  const client = new ConvexHttpClient(url);
  const tasks = await client.query("queries:getAll");
  const outputPath = path.join(__dirname, "output.log");
  fs.writeFileSync(outputPath, JSON.stringify(tasks));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
