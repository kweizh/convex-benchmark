import os
import subprocess
import json
import pytest

PROJECT_DIR = "/home/user/project"

def run_action(user_id):
    """Run the Convex action using the CLI."""
    result = subprocess.run(
        ["npx", "convex", "run", "actions:doWork", json.dumps({"userId": user_id})],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    return result

def test_rate_limiting_action():
    """Verify that the action is rate limited to 3 calls per user."""
    user_id = "test_user_1"
    
    # First 3 calls should succeed
    for i in range(3):
        res = run_action(user_id)
        assert res.returncode == 0, f"Call {i+1} failed: {res.stderr}"
        assert "Work completed" in res.stdout or "Work completed" in res.stderr, \
            f"Expected 'Work completed' on call {i+1}, got: {res.stdout} {res.stderr}"
            
    # 4th call should fail with rate limit exceeded
    res = run_action(user_id)
    assert res.returncode != 0, "4th call succeeded, but should have failed due to rate limit."
    assert "Rate limit exceeded" in res.stderr or "Rate limit exceeded" in res.stdout, \
        f"Expected 'Rate limit exceeded' error, got: {res.stderr} {res.stdout}"
