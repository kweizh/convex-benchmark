import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/project"

def test_heartbeat_test_user_1():
    """Priority 1: Use Convex CLI to run the heartbeat mutation for test_user_1."""
    result = subprocess.run(
        ["npx", "convex", "run", "presence:heartbeat", '{"userId": "test_user_1"}'],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode == 0, f"'npx convex run presence:heartbeat' failed for test_user_1: {result.stderr}"

def test_heartbeat_test_user_2():
    """Priority 1: Use Convex CLI to run the heartbeat mutation for test_user_2."""
    result = subprocess.run(
        ["npx", "convex", "run", "presence:heartbeat", '{"userId": "test_user_2"}'],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode == 0, f"'npx convex run presence:heartbeat' failed for test_user_2: {result.stderr}"

def test_get_online_users():
    """Priority 1: Use Convex CLI to verify both users are returned by getOnlineUsers."""
    result = subprocess.run(
        ["npx", "convex", "run", "presence:getOnlineUsers"],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode == 0, f"'npx convex run presence:getOnlineUsers' failed: {result.stderr}"
    assert "test_user_1" in result.stdout, f"Expected 'test_user_1' in getOnlineUsers output, got: {result.stdout}"
    assert "test_user_2" in result.stdout, f"Expected 'test_user_2' in getOnlineUsers output, got: {result.stdout}"
