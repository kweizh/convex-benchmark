import os
import shutil
import pytest

PROJECT_DIR = "/home/user/project"

def test_npm_binary_available():
    assert shutil.which("npm") is not None, "npm binary not found in PATH."

def test_project_directory_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_package_json_exists():
    package_json_path = os.path.join(PROJECT_DIR, "package.json")
    assert os.path.isfile(package_json_path), f"File {package_json_path} does not exist."

def test_schema_exists():
    schema_path = os.path.join(PROJECT_DIR, "convex", "schema.ts")
    assert os.path.isfile(schema_path), f"File {schema_path} does not exist."
