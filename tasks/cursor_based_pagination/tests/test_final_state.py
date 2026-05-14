import os
import subprocess
import json
import pytest

PROJECT_DIR = "/home/user/project"
OUTPUT_FILE = "/home/user/project/output.json"

def test_script_execution():
    """Run the user script and ensure it executes successfully."""
    result = subprocess.run(
        ["node", "test_pagination.js"],
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    assert result.returncode == 0, f"Script execution failed: {result.stderr}"

def test_output_json_format_and_content():
    """Verify the output JSON contains correct paginated results."""
    assert os.path.isfile(OUTPUT_FILE), "output.json does not exist."
    
    with open(OUTPUT_FILE, "r") as f:
        try:
            data = json.load(f)
        except json.JSONDecodeError:
            pytest.fail("output.json is not valid JSON.")
            
    assert "page1" in data, "output.json missing 'page1'"
    assert "page2" in data, "output.json missing 'page2'"
    
    page1 = data["page1"]
    page2 = data["page2"]
    
    assert isinstance(page1, list), "'page1' is not an array."
    assert isinstance(page2, list), "'page2' is not an array."
    
    assert len(page1) == 2, f"Expected 2 items in page1, got {len(page1)}"
    assert len(page2) == 2, f"Expected 2 items in page2, got {len(page2)}"
    
    # We don't know the exact messages, but they should have text and author
    for item in page1 + page2:
        assert "text" in item or ("_creationTime" in item), "Items in pages do not look like valid Convex records."
