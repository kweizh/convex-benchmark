import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";

const url = process.env.CONVEX_URL || "http://127.0.0.1:3210";
const client = new ConvexHttpClient(url);

const runId = process.env.ZEALT_RUN_ID || "";

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("No action provided");
    process.exit(1);
  }

  const action = args[0];

  if (action === "create") {
    const name = args[1];
    const ageStr = args[2];
    const role = args[3] as "admin" | "user";

    if (!name || !ageStr || !role) {
      console.error("Usage: create <name> <age> <role>");
      process.exit(1);
    }

    const age = parseInt(ageStr, 10);
    const finalName = `${name}-${runId}`;

    await client.mutation(api.users.createUser, {
      name: finalName,
      age,
      role,
    });
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
    console.error("Unknown action");
    process.exit(1);
  }
}

main().catch(console.error);
