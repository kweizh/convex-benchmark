import os
import json
import subprocess
import requests

PROJECT_DIR = "/home/user/myproject"

def test_convex_data_export():
    # Step 1: Read run-id and get safe_run_id
    run_id = os.environ.get("ZEALT_RUN_ID")
    assert run_id, "ZEALT_RUN_ID environment variable is not set."
    safe_run_id = run_id.replace("-", "_")
    table_name = f"products_{safe_run_id}"
    
    # Step 2: Create test_data.jsonl
    test_data_path = os.path.join(PROJECT_DIR, "test_data.jsonl")
    with open(test_data_path, "w") as f:
        f.write('{"name": "Test Product A", "price": 100}\n')
        f.write('{"name": "Test Product B", "price": 200}\n')
    
    # Step 3: Run npx convex import
    import_cmd = ["npx", "convex", "import", "--table", table_name, "test_data.jsonl"]
    result = subprocess.run(import_cmd, cwd=PROJECT_DIR, capture_output=True, text=True)
    assert result.returncode == 0, f"Convex import failed: {result.stderr}\n{result.stdout}"
    
    # Step 4: Construct the Convex site URL
    convex_url = os.environ.get("CONVEX_URL")
    assert convex_url, "CONVEX_URL environment variable is not set."
    
    # Replace .cloud with .site
    convex_site_url = convex_url.replace(".cloud", ".site")
    
    # Step 5: Send GET request to /exportProducts
    export_url = f"{convex_site_url}/exportProducts"
    response = requests.get(export_url)
    
    assert response.status_code == 200, f"Expected status 200, got {response.status_code}. Response: {response.text}"
    
    try:
        data = response.json()
    except ValueError:
        raise AssertionError(f"Response is not valid JSON: {response.text}")
        
    assert isinstance(data, list), f"Expected response to be a JSON array, got {type(data)}"
    
    # Verify the items are in the response
    names = [item.get("name") for item in data if isinstance(item, dict)]
    prices = [item.get("price") for item in data if isinstance(item, dict)]
    
    assert "Test Product A" in names, "Expected 'Test Product A' in the exported data."
    assert "Test Product B" in names, "Expected 'Test Product B' in the exported data."
    assert 100 in prices, "Expected price 100 in the exported data."
    assert 200 in prices, "Expected price 200 in the exported data."
