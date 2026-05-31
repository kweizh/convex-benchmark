import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";

const convexUrl = process.env.CONVEX_URL;
if (!convexUrl) {
  console.error("CONVEX_URL environment variable is required");
  process.exit(1);
}

const runId = process.env.ZEALT_RUN_ID || "";
const client = new ConvexHttpClient(convexUrl);

async function main() {
  const args = process.argv.slice(2);
  const action = args[0];

  if (action === "create") {
    const name = args[1];
    const age = parseInt(args[2], 10);
    const role = args[3] as "admin" | "user";

    if (!name || isNaN(age) || !role) {
      console.error("Usage: create <name> <age> <role>");
      process.exit(1);
    }

    const fullName = `${name}-${runId}`;
    await client.mutation(api.users.createUser, { name: fullName, age, role });
  } else if (action === "list") {
    const role = args[1] as "admin" | "user";
    if (!role) {
      console.error("Usage: list <role>");
      process.exit(1);
    }

    const users = await client.query(api.users.getUsersByRole, { role });
    const filteredUsers = users.filter((u) => u.name.endsWith(`-${runId}`));
    console.log(JSON.stringify(filteredUsers));
  } else {
    console.error("Unknown action. Use 'create' or 'list'.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
