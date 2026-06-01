import os
import shutil
import pytest

PROJECT_DIR = "/home/user/project"

def test_node_npm_npx_available():
    assert shutil.which("node") is not None, "node binary not found in PATH."
    assert shutil.which("npm") is not None, "npm binary not found in PATH."
    assert shutil.which("npx") is not None, "npx binary not found in PATH."

def test_project_dir_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_setup_script_exists():
    setup_path = os.path.join(PROJECT_DIR, "setup.sh")
    assert os.path.isfile(setup_path), f"Setup script {setup_path} does not exist."

def test_package_json_exists():
    package_json_path = os.path.join(PROJECT_DIR, "package.json")
    assert os.path.isfile(package_json_path), f"package.json {package_json_path} does not exist."

def test_convex_dependency_installed():
    package_json_path = os.path.join(PROJECT_DIR, "package.json")
    with open(package_json_path, "r") as f:
        content = f.read()
    assert "convex" in content, "convex dependency not found in package.json."