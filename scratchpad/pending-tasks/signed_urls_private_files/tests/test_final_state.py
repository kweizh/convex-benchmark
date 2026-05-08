import os
import subprocess
import json
import urllib.request
import urllib.error
import pytest

PROJECT_DIR = "/home/user/myproject"

def test_generate_url_query():
    """Priority 1: Call the files:generateUrl query and verify the URL."""
    result = subprocess.run(
        ["npx", "convex", "run", "files:generateUrl", '{"storageId": "kg29384759283749283749283749"}'],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"Failed to run convex query: {result.stderr}"
    
    output = result.stdout.strip()
    assert "servePrivateFile" in output, f"Expected URL containing 'servePrivateFile', got: {output}"
    assert "token=" in output, f"Expected URL containing 'token=', got: {output}"

def test_http_action_403_and_404():
    """Priority 3: Test the HTTP action behavior using urllib."""
    site_url = os.environ.get("CONVEX_SITE_URL")
    if not site_url:
        # Fallback to fetching it via npx convex env get
        result = subprocess.run(["npx", "convex", "env", "get", "CONVEX_SITE_URL"], cwd=PROJECT_DIR, capture_output=True, text=True)
        site_url = result.stdout.strip()
        
    secret = os.environ.get("PRIVATE_FILE_SECRET")
    if not secret:
        result = subprocess.run(["npx", "convex", "env", "get", "PRIVATE_FILE_SECRET"], cwd=PROJECT_DIR, capture_output=True, text=True)
        secret = result.stdout.strip()
    
    if not site_url or not secret:
        pytest.fail("Could not determine CONVEX_SITE_URL or PRIVATE_FILE_SECRET from environment or convex CLI.")
    
    # Test 403 Forbidden with invalid token
    invalid_url = f"{site_url}/servePrivateFile?storageId=kg29384759283749283749283749&token=invalid_token_123"
    req = urllib.request.Request(invalid_url)
    try:
        urllib.request.urlopen(req)
        pytest.fail("Expected 403 Forbidden, but request succeeded")
    except urllib.error.HTTPError as e:
        assert e.code == 403, f"Expected 403 Forbidden, got {e.code}"
        
    # Test 404 Not Found with valid token (since storageId is dummy)
    valid_url = f"{site_url}/servePrivateFile?storageId=kg29384759283749283749283749&token={secret}"
    req = urllib.request.Request(valid_url)
    try:
        urllib.request.urlopen(req)
        pytest.fail("Expected 404 Not Found, but request succeeded")
    except urllib.error.HTTPError as e:
        assert e.code == 404, f"Expected 404 Not Found, got {e.code}"