import os
import subprocess
import json
import urllib.request
import urllib.parse
import time
import pytest

PROJECT_DIR = "/home/user/project"
URL_FILE = os.path.join(PROJECT_DIR, "convex_site_url.txt")

def test_site_url_file_exists():
    assert os.path.isfile(URL_FILE), f"{URL_FILE} was not created."
    with open(URL_FILE, "r") as f:
        url = f.read().strip()
    assert url.startswith("http"), f"Invalid URL format in {URL_FILE}: {url}"

def test_webhook_post_and_query():
    # Priority 1: Use HTTP request and Convex CLI to verify
    with open(URL_FILE, "r") as f:
        base_url = f.read().strip()
    
    webhook_url = f"{base_url}/webhook"
    
    # Use a unique author to avoid collisions
    test_author = f"TestUser_{int(time.time())}"
    test_body = "TestMessage123"
    
    payload = json.dumps({
        "author": test_author,
        "body": test_body
    }).encode('utf-8')
    
    req = urllib.request.Request(webhook_url, data=payload, headers={'Content-Type': 'application/json'})
    
    try:
        response = urllib.request.urlopen(req, timeout=10)
        assert response.status == 200, f"Expected 200 OK, got {response.status}"
    except Exception as e:
        pytest.fail(f"Failed to post to {webhook_url}: {e}")
        
    # Wait a moment for data to be written
    time.sleep(2)
    
    # Use npx convex run to query the database
    query = f'await ctx.db.query("messages").filter(q => q.eq(q.field("author"), "{test_author}")).collect()'
    result = subprocess.run(
        ["npx", "convex", "run", "--inline-query", query],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    
    assert result.returncode == 0, f"Convex query failed: {result.stderr}"
    
    # The output of npx convex run contains the JSON result.
    # It might have some CLI output prefixes, so let's just check if the body is in the output
    assert test_body in result.stdout, f"Message body '{test_body}' not found in query result: {result.stdout}"
