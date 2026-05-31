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
  const idIndex = args.indexOf("--id");
  if (idIndex === -1 || !args[idIndex + 1]) {
    console.error("Usage: node check.js --id <session-id>");
    process.exit(1);
  }
  const sessionId = args[idIndex + 1];

  const session = await client.query(api.sessions.getSession, { id: sessionId });

  if (!session) {
    console.error("Session not found");
    process.exit(1);
  }

  console.log(`Is Active: ${session.isActive}`);
}

main().catch(console.error);
