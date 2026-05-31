const { ConvexHttpClient } = require("convex/browser");

function getArgValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index + 1 >= process.argv.length) {
    return null;
  }
  return process.argv[index + 1];
}

async function main() {
  const runId = getArgValue("--run-id");
  if (!runId) {
    throw new Error("Missing --run-id argument.");
  }

  const convexUrl = process.env.CONVEX_URL;
  if (!convexUrl) {
    throw new Error("CONVEX_URL environment variable is required.");
  }

  const client = new ConvexHttpClient(convexUrl);
  const deployKey = process.env.CONVEX_DEPLOY_KEY;
  if (deployKey) {
    client.setAdminAuth(deployKey);
  }

  const sessionId = await client.mutation("sessions:createSession", {
    runId,
    expiresAt: Date.now() - 60_000,
    isActive: true,
  });

  console.log(`Session ID: ${sessionId}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
