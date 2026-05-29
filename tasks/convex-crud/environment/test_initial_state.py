import os
import shutil

PROJECT_DIR = "/home/user/myproject"

def test_node_and_npm_available():
    assert shutil.which("node") is not None, "node binary not found in PATH."
    assert shutil.which("npm") is not None, "npm binary not found in PATH."

def test_project_dir_exists():
    assert os.path.isdir(PROJECT_DIR), f"Project directory {PROJECT_DIR} does not exist."

def test_convex_deploy_key_env_var_exists():
    assert "CONVEX_DEPLOY_KEY" in os.environ, "CONVEX_DEPLOY_KEY environment variable is not set."
