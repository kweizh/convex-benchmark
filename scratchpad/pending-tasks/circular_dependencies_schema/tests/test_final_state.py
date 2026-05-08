import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/convex-project"

def test_tsc_passes_without_errors():
    """Priority 1: Run npx tsc to verify circular dependency is resolved."""
    result = subprocess.run(["npx", "tsc"], cwd=PROJECT_DIR, capture_output=True, text=True)
    assert result.returncode == 0, f"Expected npx tsc to pass, but it failed with output:\n{result.stdout}\n{result.stderr}"

def test_runquery_still_used():
    """Priority 3: Verify the functions still call each other via runQuery."""
    for filename in ["users.ts", "posts.ts", "comments.ts"]:
        filepath = os.path.join(PROJECT_DIR, "convex", filename)
        with open(filepath, "r") as f:
            content = f.read()
        assert "runQuery(" in content, f"Expected {filename} to still use 'runQuery' to call other functions."
