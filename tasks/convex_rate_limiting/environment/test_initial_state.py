import os
import shutil
import pytest

PROJECT_DIR = "/home/user/project"

def test_node_available():
    assert shutil.which("node") is not None, "node binary not found in PATH."

def test_npm_available():
    assert shutil.which("npm") is not None, "npm binary not found in PATH."

def test_npx_available():
    assert shutil.which("npx") is not None, "npx binary not found in PATH."

def test_project_dir_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_environment_variables():
    assert "CONVEX_DEPLOY_KEY" in os.environ, "CONVEX_DEPLOY_KEY environment variable is not set."
    assert "CONVEX_URL" in os.environ, "CONVEX_URL environment variable is not set."
    assert "ZEALT_RUN_ID" in os.environ, "ZEALT_RUN_ID environment variable is not set."
