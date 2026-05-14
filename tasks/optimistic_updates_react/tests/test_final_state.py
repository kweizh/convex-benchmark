import os
import pytest

PROJECT_DIR = "/home/user/project"

def test_optimistic_update_code():
    app_tsx_path = os.path.join(PROJECT_DIR, "src", "App.tsx")
    with open(app_tsx_path) as f:
        content = f.read()
    
    assert ".withOptimisticUpdate" in content, "Expected '.withOptimisticUpdate' to be used in src/App.tsx."
    assert "useQuery" in content, "Expected 'useQuery' to be used in src/App.tsx."
    assert "useMutation" in content, "Expected 'useMutation' to be used in src/App.tsx."
