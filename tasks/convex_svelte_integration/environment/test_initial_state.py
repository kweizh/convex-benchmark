import os
import shutil
import pytest

def test_node_npm_available():
    assert shutil.which("node") is not None, "node binary not found in PATH."
    assert shutil.which("npm") is not None, "npm binary not found in PATH."
    assert shutil.which("npx") is not None, "npx binary not found in PATH."

def test_convex_env_vars_available():
    # The runner provides these, but it's good to ensure they exist or will be provided.
    # In Harbor, environment variables are injected at runtime.
    # We can skip strict assertion here to avoid false negatives if they are injected later,
    # but we can check if ZEALT_RUN_ID is present as required by the task.
    assert "ZEALT_RUN_ID" in os.environ, "ZEALT_RUN_ID environment variable is missing."
