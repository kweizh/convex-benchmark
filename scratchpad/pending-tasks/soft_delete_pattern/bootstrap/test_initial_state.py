import os
import shutil
import subprocess
import pytest

PROJECT_DIR = "/home/user/project"

def test_project_dir_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_package_json_exists():
    package_json = os.path.join(PROJECT_DIR, "package.json")
    assert os.path.isfile(package_json), f"package.json not found at {package_json}."

def test_convex_installed():
    node_modules_convex = os.path.join(PROJECT_DIR, "node_modules", "convex")
    assert os.path.isdir(node_modules_convex), "convex is not installed in node_modules."

def test_convex_directory_exists():
    convex_dir = os.path.join(PROJECT_DIR, "convex")
    assert os.path.isdir(convex_dir), f"Convex directory {convex_dir} does not exist."
