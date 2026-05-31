import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";

const convexUrl = process.env.CONVEX_URL;
if (!convexUrl) {
  throw new Error("CONVEX_URL environment variable is required.");
}

const runId = process.env.ZEALT_RUN_ID;
if (!runId) {
  throw new Error("ZEALT_RUN_ID environment variable is required.");
}

const client = new ConvexHttpClient(convexUrl);

const [action, ...args] = process.argv.slice(2);

type Role = "admin" | "user";

const isRole = (value: string): value is Role => value === "admin" || value === "user";

const run = async () => {
  if (action === "create") {
    const [name, ageInput, role] = args;
    if (!name || !ageInput || !role || !isRole(role)) {
      throw new Error("Usage: create <name> <age> <role>");
    }

    const age = Number(ageInput);
    if (Number.isNaN(age)) {
      throw new Error("Age must be a number.");
    }

    const result = await client.mutation(api.users.createUser, {
      name: `${name}-${runId}`,
      age,
      role,
    });

    console.log(JSON.stringify(result));
    return;
  }

  if (action === "list") {
    const [role] = args;
    if (!role || !isRole(role)) {
      throw new Error("Usage: list <role>");
    }

    const users = await client.query(api.users.getUsersByRole, { role });
    const filtered = users.filter((user) => user.name.endsWith(`-${runId}`));
    console.log(JSON.stringify(filtered));
    return;
  }

  throw new Error("Usage: <create|list> [args...]");
};

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
