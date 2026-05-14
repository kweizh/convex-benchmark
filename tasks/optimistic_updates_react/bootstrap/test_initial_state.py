import os
import shutil
import pytest

PROJECT_DIR = "/home/user/project"

def test_node_installed():
    assert shutil.which("node") is not None, "node binary not found in PATH."
    assert shutil.which("npm") is not None, "npm binary not found in PATH."

def test_project_dir_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_package_json_exists():
    package_json = os.path.join(PROJECT_DIR, "package.json")
    assert os.path.isfile(package_json), f"package.json not found at {package_json}."

def test_convex_files_exist():
    schema_path = os.path.join(PROJECT_DIR, "convex", "schema.ts")
    counter_path = os.path.join(PROJECT_DIR, "convex", "counter.ts")
    assert os.path.isfile(schema_path), f"Convex schema not found at {schema_path}."
    assert os.path.isfile(counter_path), f"Convex counter functions not found at {counter_path}."

def test_app_tsx_exists():
    app_tsx = os.path.join(PROJECT_DIR, "src", "App.tsx")
    assert os.path.isfile(app_tsx), f"App.tsx not found at {app_tsx}."
