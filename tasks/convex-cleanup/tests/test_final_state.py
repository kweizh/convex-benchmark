import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/project"

def test_crons_file_exists_and_configured():
    crons_path = os.path.join(PROJECT_DIR, "convex", "crons.ts")
    assert os.path.isfile(crons_path), f"crons.ts not found at {crons_path}"
    
    with open(crons_path, "r") as f:
        content = f.read()
    
    assert "crons.hourly" in content or "crons.cron" in content, \
        "crons.ts does not seem to contain scheduling logic (e.g., crons.hourly or crons.cron)."
    assert "clearExpired" in content, \
        "crons.ts does not seem to schedule the clearExpired mutation."

def test_convex_mutations_and_queries():
    script_content = """
import { ConvexHttpClient } from "convex/browser";
import fs from "fs";

// Read CONVEX_URL from .env.local
let url = process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL;
if (!url) {
    try {
        const envContent = fs.readFileSync(".env.local", "utf-8");
        const match = envContent.match(/CONVEX_URL=(.*)/) || envContent.match(/NEXT_PUBLIC_CONVEX_URL=(.*)/);
        if (match) url = match[1].trim();
    } catch(e) {}
}

if (!url) {
    console.error("CONVEX_URL not found");
    process.exit(1);
}

const client = new ConvexHttpClient(url);

async function run() {
    // Insert expired
    await client.mutation("sessions:insertSession", { sessionId: "expired-1", expiresAt: Date.now() - 100000 });
    // Insert valid
    await client.mutation("sessions:insertSession", { sessionId: "valid-1", expiresAt: Date.now() + 100000 });
    
    // Clear expired
    await client.mutation("sessions:clearExpired", {});
    
    // Get sessions
    const sessions = await client.query("sessions:getSessions", {});
    
    const ids = sessions.map(s => s.sessionId);
    if (ids.includes("expired-1")) {
        console.error("expired-1 was not deleted");
        process.exit(1);
    }
    if (!ids.includes("valid-1")) {
        console.error("valid-1 was deleted");
        process.exit(1);
    }
    
    console.log("Success");
}

run().catch(e => {
    console.error(e);
    process.exit(1);
});
"""
    script_path = os.path.join(PROJECT_DIR, "verify_convex.mjs")
    with open(script_path, "w") as f:
        f.write(script_content)
    
    result = subprocess.run(
        ["node", "verify_convex.mjs"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    
    assert result.returncode == 0, f"Verification script failed: {result.stderr}\n{result.stdout}"
    assert "Success" in result.stdout, "Verification script did not output Success."
