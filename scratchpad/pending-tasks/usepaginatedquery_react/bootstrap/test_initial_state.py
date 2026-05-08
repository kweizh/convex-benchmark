import os
import shutil
import pytest

PROJECT_DIR = "/home/user/app"

def test_npm_binary_available():
    assert shutil.which("npm") is not None, "npm binary not found in PATH."

def test_npx_binary_available():
    assert shutil.which("npx") is not None, "npx binary not found in PATH."

def test_project_dir_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_schema_file_exists():
    schema_path = os.path.join(PROJECT_DIR, "convex", "schema.ts")
    assert os.path.isfile(schema_path), f"Schema file {schema_path} does not exist."

def test_schema_contains_messages_table():
    schema_path = os.path.join(PROJECT_DIR, "convex", "schema.ts")
    with open(schema_path) as f:
        content = f.read()
    assert "messages" in content, "Expected 'messages' table in schema.ts."
    assert "body" in content, "Expected 'body' field in messages table in schema.ts."

def test_seed_file_exists():
    seed_path = os.path.join(PROJECT_DIR, "convex", "seed.ts")
    assert os.path.isfile(seed_path), f"Seed file {seed_path} does not exist."
