import os
import subprocess
import json
import pytest

PROJECT_DIR = "/home/user/myproject"

@pytest.fixture(scope="session", autouse=True)
def setup_project():
    """Run npm install and convex deploy to ensure the project is ready."""
    env = os.environ.copy()
    
    # Run npm install
    result = subprocess.run(
        ["npm", "install"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True,
        env=env
    )
    assert result.returncode == 0, f"'npm install' failed: {result.stderr}"

    # Run npx convex deploy --yes
    result = subprocess.run(
        ["npx", "convex", "deploy", "--yes"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True,
        env=env
    )
    assert result.returncode == 0, f"'npx convex deploy' failed: {result.stderr}\n{result.stdout}"

def test_type_checking():
    """Verify that the project passes TypeScript validation."""
    result = subprocess.run(
        ["npx", "tsc", "--noEmit"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"TypeScript validation failed: {result.stdout}\n{result.stderr}"

def test_create_admin_user():
    """Verify creating an admin user succeeds."""
    result = subprocess.run(
        ["npx", "tsx", "cli.ts", "create", "Alice", "30", "admin"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"Failed to create admin user: {result.stderr}\n{result.stdout}"

def test_create_regular_user():
    """Verify creating a regular user succeeds."""
    result = subprocess.run(
        ["npx", "tsx", "cli.ts", "create", "Bob", "25", "user"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"Failed to create regular user: {result.stderr}\n{result.stdout}"

def test_list_admin_users():
    """Verify listing admin users returns the created admin user with run-id."""
    run_id = os.environ.get("ZEALT_RUN_ID", "")
    expected_name = f"Alice-{run_id}"

    result = subprocess.run(
        ["npx", "tsx", "cli.ts", "list", "admin"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"Failed to list admin users: {result.stderr}\n{result.stdout}"
    
    try:
        users = json.loads(result.stdout.strip())
    except json.JSONDecodeError:
        pytest.fail(f"Could not parse stdout as JSON: {result.stdout}")
        
    assert isinstance(users, list), "Expected stdout to be a JSON array"
    
    found = any(
        u.get("name") == expected_name and u.get("age") == 30 and u.get("role") == "admin"
        for u in users
    )
    assert found, f"Expected to find user {{'name': '{expected_name}', 'age': 30, 'role': 'admin'}} in {users}"

def test_list_regular_users():
    """Verify listing regular users returns the created regular user with run-id."""
    run_id = os.environ.get("ZEALT_RUN_ID", "")
    expected_name = f"Bob-{run_id}"

    result = subprocess.run(
        ["npx", "tsx", "cli.ts", "list", "user"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"Failed to list regular users: {result.stderr}\n{result.stdout}"
    
    try:
        users = json.loads(result.stdout.strip())
    except json.JSONDecodeError:
        pytest.fail(f"Could not parse stdout as JSON: {result.stdout}")
        
    assert isinstance(users, list), "Expected stdout to be a JSON array"
    
    found = any(
        u.get("name") == expected_name and u.get("age") == 25 and u.get("role") == "user"
        for u in users
    )
    assert found, f"Expected to find user {{'name': '{expected_name}', 'age': 25, 'role': 'user'}} in {users}"

def test_invalid_role_fails():
    """Verify that creating a user with an invalid role fails."""
    result = subprocess.run(
        ["npx", "tsx", "cli.ts", "create", "Charlie", "20", "guest"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode != 0, "Expected command to fail when creating a user with an invalid role 'guest'."
