import os
import json
import pytest

OUTPUT_LOG = "/home/user/project/output.log"

def test_output_log_exists():
    """Verify that output.log exists."""
    assert os.path.isfile(OUTPUT_LOG), f"Output log file {OUTPUT_LOG} does not exist."

def test_output_log_contents():
    """Verify the contents of output.log match the expected JSON structure."""
    with open(OUTPUT_LOG, "r") as f:
        content = f.read()
    
    try:
        data = json.loads(content)
    except json.JSONDecodeError as e:
        pytest.fail(f"Failed to parse {OUTPUT_LOG} as JSON: {e}")
        
    assert isinstance(data, list), "Expected output to be a JSON array."
    assert len(data) == 3, f"Expected exactly 3 objects in the array, found {len(data)}."
    
    for i, item in enumerate(data):
        assert isinstance(item, dict), f"Item at index {i} is not a JSON object."
        
        # Verify priority field
        assert "priority" in item, f"Item at index {i} is missing 'priority' field."
        assert item["priority"] == "medium", f"Item at index {i} has incorrect priority: {item['priority']}. Expected: 'medium'."
        
        # Verify text and isCompleted fields
        assert "text" in item, f"Item at index {i} is missing 'text' field."
        assert "isCompleted" in item, f"Item at index {i} is missing 'isCompleted' field."