const { ConvexHttpClient } = require("convex/browser");

const convexUrl = process.env.CONVEX_URL;
if (!convexUrl) {
  console.error("CONVEX_URL environment variable is required");
  process.exit(1);
}

const client = new ConvexHttpClient(convexUrl);

// Parse --run-id argument
const args = process.argv.slice(2);
let runId = null;
for (let i = 0; i < args.length; i++) {
  if (args[i] === "--run-id" && i + 1 < args.length) {
    runId = args[i + 1];
  }
}

if (!runId) {
  console.error("--run-id argument is required");
  process.exit(1);
}

async function main() {
  // Set expiresAt to a time in the past so it's immediately eligible for cleanup
  const expiresAt = Date.now() - 60000; // 1 minute in the past
  const isActive = true;

  const sessionId = await client.mutation("sessions:createSession", {
    runId,
    expiresAt,
    isActive,
  });

  console.log(`Session ID: ${sessionId}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});