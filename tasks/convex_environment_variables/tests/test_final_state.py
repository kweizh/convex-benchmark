import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/convex-env-task"
LOG_FILE = os.path.join(PROJECT_DIR, "output.log")
VERIFY_SCRIPT = os.path.join(PROJECT_DIR, "verify.mjs")

def test_log_file_exists():
    assert os.path.isfile(LOG_FILE), f"Log file {LOG_FILE} does not exist."

def test_log_content():
    run_id = os.environ.get("ZEALT_RUN_ID", "")
    assert run_id, "ZEALT_RUN_ID environment variable is not set."
    
    with open(LOG_FILE, "r") as f:
        content = f.read()
    
    expected_line = f"Token: {run_id}"
    assert expected_line in content, f"Expected '{expected_line}' in {LOG_FILE}, but got:\n{content}"

def test_action_deployed():
    run_id = os.environ.get("ZEALT_RUN_ID", "")
    assert run_id, "ZEALT_RUN_ID environment variable is not set."
    
    script_content = """import { ConvexHttpClient } from "convex/browser";
import { anyApi } from "convex/server";

const client = new ConvexHttpClient(process.env.CONVEX_URL);
client.action(anyApi.config.getToken).then(console.log).catch((err) => {
    console.error(err);
    process.exit(1);
});
"""
    
    with open(VERIFY_SCRIPT, "w") as f:
        f.write(script_content)
    
    result = subprocess.run(
        ["node", "verify.mjs"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    
    assert result.returncode == 0, f"verify.mjs failed with error:\n{result.stderr}\n{result.stdout}"
    assert run_id in result.stdout, f"Expected output to contain {run_id}, but got:\n{result.stdout}"
