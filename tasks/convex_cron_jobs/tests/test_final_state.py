import os
import subprocess
import time
import re
import pytest

PROJECT_DIR = "/home/user/project"

def test_cron_job_cleanup():
    """Verify that the cron job cleans up the expired session."""
    run_id = os.environ.get("ZEALT_RUN_ID", "test-run-id")
    
    # Run seed.js to create an expired session
    result_seed = subprocess.run(
        ["node", "seed.js", "--run-id", run_id],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result_seed.returncode == 0, f"'node seed.js' failed: {result_seed.stderr}\nStdout: {result_seed.stdout}"
    
    # Parse Session ID
    match = re.search(r"Session ID:\s*([^\s]+)", result_seed.stdout)
    assert match is not None, f"Expected 'Session ID: <id>' in output, got: {result_seed.stdout}"
    session_id = match.group(1)
    
    # Check initial state: should be active
    result_check_initial = subprocess.run(
        ["node", "check.js", "--id", session_id],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result_check_initial.returncode == 0, f"'node check.js' initial check failed: {result_check_initial.stderr}"
    assert "Is Active: true" in result_check_initial.stdout, f"Expected initial session to be active, got: {result_check_initial.stdout}"
    
    # Wait for the cron job to run (1 minute interval + 10 seconds buffer)
    time.sleep(70)
    
    # Check final state: should be inactive
    result_check_final = subprocess.run(
        ["node", "check.js", "--id", session_id],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result_check_final.returncode == 0, f"'node check.js' final check failed: {result_check_final.stderr}"
    assert "Is Active: false" in result_check_final.stdout, f"Expected cron job to have marked session as inactive, got: {result_check_final.stdout}"
