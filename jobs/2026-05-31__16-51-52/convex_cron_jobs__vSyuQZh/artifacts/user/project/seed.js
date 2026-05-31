const { ConvexHttpClient } = require("convex/browser");
const { anyApi } = require("convex/server");

const url = process.env.CONVEX_URL;
if (!url) {
  console.error("CONVEX_URL is not set");
  process.exit(1);
}

const client = new ConvexHttpClient(url);

async function main() {
  const runIdIndex = process.argv.indexOf("--run-id");
  if (runIdIndex === -1 || runIdIndex === process.argv.length - 1) {
    console.error("Usage: node seed.js --run-id <run-id>");
    process.exit(1);
  }
  const runId = process.argv[runIdIndex + 1];

  const expiresAt = Date.now() - 10000; // 10 seconds ago

  const id = await client.mutation(anyApi.sessions.insertSession, {
    runId,
    expiresAt,
    isActive: true,
  });

  console.log(`Session ID: ${id}`);
}

main().catch(console.error);