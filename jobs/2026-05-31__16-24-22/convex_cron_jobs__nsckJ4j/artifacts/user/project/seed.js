const { ConvexHttpClient } = require("convex/browser");
const { api } = require("./convex/_generated/api");

const CONVEX_URL = process.env.CONVEX_URL;

if (!CONVEX_URL) {
  console.error("CONVEX_URL environment variable is not set");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function main() {
  const args = process.argv.slice(2);
  const runIdIndex = args.indexOf("--run-id");
  if (runIdIndex === -1 || !args[runIdIndex + 1]) {
    console.error("Usage: node seed.js --run-id <run-id>");
    process.exit(1);
  }
  const runId = args[runIdIndex + 1];

  // Set expiresAt to 1 minute ago
  const expiresAt = Date.now() - 60000;

  const sessionId = await client.mutation(api.sessions.createSession, {
    runId,
    expiresAt,
    isActive: true,
  });

  console.log(`Session ID: ${sessionId}`);
}

main().catch(console.error);
