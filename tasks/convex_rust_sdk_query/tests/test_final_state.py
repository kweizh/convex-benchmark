import os
import subprocess
import pytest

APP_DIR = "/home/user/project/convex_query_app"

def test_app_dir_exists():
    assert os.path.isdir(APP_DIR), f"App directory {APP_DIR} does not exist."

def test_cargo_run_output():
    result = subprocess.run(
        ["cargo", "run"],
        cwd=APP_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"'cargo run' failed: {result.stderr}"
    
    # Check for the sample tasks in the output
    expected_tasks = ["Buy groceries", "Go for a swim", "Integrate Convex"]
    for task in expected_tasks:
        assert task in result.stdout, f"Expected task '{task}' not found in output: {result.stdout}"
