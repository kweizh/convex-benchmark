import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";

const CONVEX_URL = process.env.CONVEX_URL;
if (!CONVEX_URL) {
  console.error("CONVEX_URL environment variable is required");
  process.exit(1);
}

const runId = process.env.ZEALT_RUN_ID;
if (!runId) {
  console.error("ZEALT_RUN_ID environment variable is required");
  process.exit(1);
}

const client = new ConvexHttpClient(CONVEX_URL);

async function main() {
  const action = process.argv[2];

  if (action === "create") {
    const name = process.argv[3];
    const age = parseInt(process.argv[4], 10);
    const role = process.argv[5];

    if (!name || isNaN(age) || !role) {
      console.error("Usage: npx tsx cli.ts create <name> <age> <role>");
      process.exit(1);
    }

    if (role !== "admin" && role !== "user") {
      console.error('Role must be "admin" or "user"');
      process.exit(1);
    }

    const fullName = `${name}-${runId}`;
    const userId = await client.mutation(api.users.createUser, {
      name: fullName,
      age,
      role: role as "admin" | "user",
    });
    console.log(JSON.stringify({ _id: userId, name: fullName, age, role }));
  } else if (action === "list") {
    const role = process.argv[3];

    if (!role) {
      console.error("Usage: npx tsx cli.ts list <role>");
      process.exit(1);
    }

    if (role !== "admin" && role !== "user") {
      console.error('Role must be "admin" or "user"');
      process.exit(1);
    }

    const users = await client.query(api.users.getUsersByRole, {
      role: role as "admin" | "user",
    });

    const filtered = users.filter((user) => user.name.endsWith(`-${runId}`));
    console.log(JSON.stringify(filtered));
  } else {
    console.error("Usage: npx tsx cli.ts <create|list> [args...]");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});