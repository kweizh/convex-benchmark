import os
import subprocess
import pytest

CLI_DIR = "/home/user/rust-convex-task/cli"

def test_create_first_task():
    """Verify that the CLI can create the first task."""
    env = os.environ.copy()
    result = subprocess.run(
        ["cargo", "run", "--", "create", "First task"],
        cwd=CLI_DIR,
        env=env,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"cargo run -- create 'First task' failed. stdout: {result.stdout}, stderr: {result.stderr}"

def test_create_second_task():
    """Verify that the CLI can create the second task."""
    env = os.environ.copy()
    result = subprocess.run(
        ["cargo", "run", "--", "create", "Second task"],
        cwd=CLI_DIR,
        env=env,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"cargo run -- create 'Second task' failed. stdout: {result.stdout}, stderr: {result.stderr}"

def test_get_tasks():
    """Verify that the CLI can retrieve the tasks and print them as a JSON array."""
    env = os.environ.copy()
    result = subprocess.run(
        ["cargo", "run", "--", "get"],
        cwd=CLI_DIR,
        env=env,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"cargo run -- get failed. stdout: {result.stdout}, stderr: {result.stderr}"
    
    stdout = result.stdout
    assert '"First task"' in stdout, f"Expected 'First task' in stdout, got: {stdout}"
    assert '"Second task"' in stdout, f"Expected 'Second task' in stdout, got: {stdout}"
    assert "[" in stdout and "]" in stdout, f"Expected output to be a JSON array, got: {stdout}"
