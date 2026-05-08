import os
import subprocess
import pytest
import json

PROJECT_DIR = "/home/user/project"

def test_mutations():
    test_script = """
import { ConvexHttpClient } from "convex/browser";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const url = process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL;
if (!url) {
  console.error("No CONVEX_URL found in .env.local");
  process.exit(1);
}

const client = new ConvexHttpClient(url);
import { api } from "./convex/_generated/api.js";

async function runTests() {
  try {
    const adminId = await client.mutation(api.tasks.createUser, { name: "Admin", role: "admin" });
    const userId = await client.mutation(api.tasks.createUser, { name: "User", role: "user" });
    const taskId = await client.mutation(api.tasks.createTask, { text: "Test Task", status: "todo" });

    let unauthorizedThrown = false;
    try {
      await client.mutation(api.tasks.deleteTask, { taskId, userId });
    } catch (e) {
      if (e.message.includes("Unauthorized")) {
        unauthorizedThrown = true;
      } else {
        console.error("Unexpected error:", e);
        process.exit(1);
      }
    }

    if (!unauthorizedThrown) {
      console.error("Expected Unauthorized error was not thrown");
      process.exit(1);
    }

    await client.mutation(api.tasks.deleteTask, { taskId, userId: adminId });
    console.log("SUCCESS");
  } catch (e) {
    console.error("Test failed:", e);
    process.exit(1);
  }
}
runTests();
"""
    test_file = os.path.join(PROJECT_DIR, "test_script.ts")
    with open(test_file, "w") as f:
        f.write(test_script)
    
    # We need to install dotenv and tsx if not already installed
    subprocess.run(["npm", "install", "dotenv", "tsx"], cwd=PROJECT_DIR, capture_output=True)
    
    result = subprocess.run(["npx", "tsx", "test_script.ts"], cwd=PROJECT_DIR, capture_output=True, text=True)
    assert result.returncode == 0, f"Test script failed: {result.stderr}\n{result.stdout}"
    assert "SUCCESS" in result.stdout, f"Test script did not output SUCCESS: {result.stdout}"
