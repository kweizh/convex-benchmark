import os
import shutil
import pytest

def test_node_available():
    assert shutil.which("node") is not None, "node binary not found in PATH."

def test_npm_available():
    assert shutil.which("npm") is not None, "npm binary not found in PATH."

def test_project_dir_exists():
    assert os.path.isdir("/home/user/convex-env-task"), "Project directory /home/user/convex-env-task does not exist."

def test_env_vars_present():
    assert "ZEALT_RUN_ID" in os.environ, "ZEALT_RUN_ID environment variable is not set."
    assert "CONVEX_DEPLOY_KEY" in os.environ, "CONVEX_DEPLOY_KEY environment variable is not set."
    assert "CONVEX_URL" in os.environ, "CONVEX_URL environment variable is not set."
