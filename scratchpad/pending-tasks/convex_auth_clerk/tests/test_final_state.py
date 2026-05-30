import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/myproject"
LOG_FILE = os.path.join(PROJECT_DIR, "output.log")
AUTH_CONFIG_FILE = os.path.join(PROJECT_DIR, "convex", "auth.config.ts")

def get_deployment_url():
    if not os.path.isfile(LOG_FILE):
        return None
    with open(LOG_FILE, "r") as f:
        for line in f:
            if line.startswith("Deployment URL: "):
                return line.strip().split("Deployment URL: ")[1].strip()
    return None

def test_log_file_and_url_exists():
    assert os.path.isfile(LOG_FILE), f"Log file {LOG_FILE} does not exist."
    url = get_deployment_url()
    assert url is not None, "Deployment URL not found in output.log."

def test_tasks_get_requires_auth():
    url = get_deployment_url()
    if not url:
        pytest.skip("Deployment URL not found, skipping test.")
    
    result = subprocess.run(
        ["npx", "convex", "run", "tasks:get", "--url", url],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode != 0, "Expected 'npx convex run tasks:get' to fail without authentication."
    assert "Unauthenticated" in result.stdout or "Unauthenticated" in result.stderr, \
        f"Expected 'Unauthenticated' in output, got stdout: {result.stdout}, stderr: {result.stderr}"

def test_tasks_create_requires_auth():
    url = get_deployment_url()
    if not url:
        pytest.skip("Deployment URL not found, skipping test.")
    
    result = subprocess.run(
        ["npx", "convex", "run", "tasks:create", '{"text": "hello"}', "--url", url],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode != 0, "Expected 'npx convex run tasks:create' to fail without authentication."
    assert "Unauthenticated" in result.stdout or "Unauthenticated" in result.stderr, \
        f"Expected 'Unauthenticated' in output, got stdout: {result.stdout}, stderr: {result.stderr}"

def test_auth_config_contains_clerk_issuer_url():
    assert os.path.isfile(AUTH_CONFIG_FILE), f"Auth config file {AUTH_CONFIG_FILE} does not exist."
    with open(AUTH_CONFIG_FILE, "r") as f:
        content = f.read()
    assert "process.env.CLERK_ISSUER_URL" in content, \
        "Expected 'process.env.CLERK_ISSUER_URL' in convex/auth.config.ts."