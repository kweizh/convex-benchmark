import os
import subprocess
import pytest

PROJECT_DIR = "/home/user/project"

def test_convex_deploy_succeeds():
    """Priority 1: Run npx convex deploy to verify the schema and functions are valid."""
    result = subprocess.run(
        ["npx", "convex", "deploy"],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode == 0, f"'npx convex deploy' failed: {result.stderr}\n{result.stdout}"

def test_schema_has_soft_delete():
    """Priority 3 fallback: Verify schema.ts has isDeleted and index."""
    schema_path = os.path.join(PROJECT_DIR, "convex", "schema.ts")
    assert os.path.isfile(schema_path), f"schema.ts not found at {schema_path}"
    
    with open(schema_path) as f:
        content = f.read()
    
    assert "isDeleted" in content, "Expected 'isDeleted' in schema.ts"
    assert "v.boolean()" in content, "Expected 'v.boolean()' for isDeleted in schema.ts"
    assert "by_deleted" in content, "Expected 'by_deleted' index in schema.ts"

def test_documents_functions_exist():
    """Priority 3 fallback: Verify documents.ts has required functions."""
    docs_path = os.path.join(PROJECT_DIR, "convex", "documents.ts")
    assert os.path.isfile(docs_path), f"documents.ts not found at {docs_path}"
    
    with open(docs_path) as f:
        content = f.read()
    
    assert "create" in content, "Expected 'create' mutation in documents.ts"
    assert "softDelete" in content, "Expected 'softDelete' mutation in documents.ts"
    assert "listActive" in content, "Expected 'listActive' query in documents.ts"

def test_list_active_uses_index():
    """Priority 3 fallback: Verify listActive uses the index."""
    docs_path = os.path.join(PROJECT_DIR, "convex", "documents.ts")
    with open(docs_path) as f:
        content = f.read()
    
    assert "withIndex" in content, "Expected 'withIndex' to be used in documents.ts"
    assert "by_deleted" in content, "Expected 'by_deleted' index to be used in documents.ts"
