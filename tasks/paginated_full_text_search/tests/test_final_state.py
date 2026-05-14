import os
import json
import pytest

PROJECT_DIR = "/home/user/convex-app"

def test_package_json_contains_convex():
    pkg_path = os.path.join(PROJECT_DIR, "package.json")
    assert os.path.isfile(pkg_path), f"package.json not found at {pkg_path}"
    
    with open(pkg_path, "r") as f:
        data = json.load(f)
        
    deps = data.get("dependencies", {})
    dev_deps = data.get("devDependencies", {})
    assert "convex" in deps or "convex" in dev_deps, "convex is not in package.json dependencies"

def test_schema_ts_defines_table_and_index():
    schema_path = os.path.join(PROJECT_DIR, "convex", "schema.ts")
    assert os.path.isfile(schema_path), f"schema.ts not found at {schema_path}"
    
    with open(schema_path, "r") as f:
        content = f.read()
        
    assert "messages" in content, "messages table is not defined in schema.ts"
    assert "body" in content, "body field is not defined in messages table"
    assert "channel" in content, "channel field is not defined in messages table"
    assert "search_body" in content, "search_body index is not defined in schema.ts"
    assert "searchField" in content, "searchField is not defined in search_body index"
    assert "filterFields" in content, "filterFields is not defined in search_body index"

def test_messages_ts_exports_query_with_pagination_and_search():
    messages_path = os.path.join(PROJECT_DIR, "convex", "messages.ts")
    assert os.path.isfile(messages_path), f"messages.ts not found at {messages_path}"
    
    with open(messages_path, "r") as f:
        content = f.read()
        
    assert "searchMessages" in content, "searchMessages query is not defined in messages.ts"
    assert "paginationOptsValidator" in content, "paginationOptsValidator is not used in the query"
    assert "withSearchIndex" in content, "withSearchIndex is not used in the query"
    assert "search_body" in content, "search_body index is not used in withSearchIndex"
    assert "search(" in content or ".search" in content, "search() method is not used"
    assert "eq(" in content or ".eq" in content, "eq() method is not used for channel filtering"
    assert "paginate(" in content or ".paginate" in content, "paginate() method is not used"