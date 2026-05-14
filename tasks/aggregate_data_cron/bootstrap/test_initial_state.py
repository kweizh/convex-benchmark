import os
import shutil
import pytest

PROJECT_DIR = "/home/user/project"

def test_project_dir_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_convex_dir_exists():
    convex_dir = os.path.join(PROJECT_DIR, "convex")
    assert os.path.isdir(convex_dir), f"Convex directory {convex_dir} does not exist."

def test_schema_file_exists():
    schema_path = os.path.join(PROJECT_DIR, "convex", "schema.ts")
    assert os.path.isfile(schema_path), f"Schema file {schema_path} does not exist."

def test_schema_contains_tables():
    schema_path = os.path.join(PROJECT_DIR, "convex", "schema.ts")
    with open(schema_path) as f:
        content = f.read()
    assert "events:" in content, "Expected 'events' table in schema.ts"
    assert "aggregations:" in content, "Expected 'aggregations' table in schema.ts"
