import os
import subprocess
import json
import pytest

PROJECT_DIR = "/home/user/project"

def run_convex_command(cmd_args):
    """Helper to run npx convex run commands and parse JSON output."""
    result = subprocess.run(
        ["npx", "convex", "run"] + cmd_args,
        cwd=PROJECT_DIR,
        capture_output=True,
        text=True
    )
    return result

def test_bank_transfer_flow():
    run_id = os.environ.get("ZEALT_RUN_ID", "local")
    
    # 1. Create Account A
    res_a = run_convex_command(["bank:createAccount", f'{{"name": "Alice_{run_id}", "initialBalance": 100}}'])
    assert res_a.returncode == 0, f"Failed to create Account A. stderr: {res_a.stderr}"
    # The output is usually the JSON-encoded ID string, e.g., "jd1..."
    # npx convex run might output some logs, but the last line is usually the result, or we can just parse it.
    # Convex CLI output: "ID_STRING"
    try:
        account_a_id = json.loads(res_a.stdout.strip())
    except Exception:
        # fallback if there's other output
        lines = res_a.stdout.strip().split("\n")
        account_a_id = json.loads(lines[-1])
        
    assert isinstance(account_a_id, str), f"Account A ID is not a string: {account_a_id}"

    # 2. Create Account B
    res_b = run_convex_command(["bank:createAccount", f'{{"name": "Bob_{run_id}", "initialBalance": 50}}'])
    assert res_b.returncode == 0, f"Failed to create Account B. stderr: {res_b.stderr}"
    try:
        account_b_id = json.loads(res_b.stdout.strip())
    except Exception:
        lines = res_b.stdout.strip().split("\n")
        account_b_id = json.loads(lines[-1])
        
    assert isinstance(account_b_id, str), f"Account B ID is not a string: {account_b_id}"

    # 3. Perform Transfer (30 from A to B)
    res_transfer = run_convex_command(["bank:transfer", f'{{"from": "{account_a_id}", "to": "{account_b_id}", "amount": 30}}'])
    assert res_transfer.returncode == 0, f"Transfer failed. stderr: {res_transfer.stderr}"

    # 4. Verify Balance A
    res_get_a = run_convex_command(["bank:getAccount", f'{{"accountId": "{account_a_id}"}}'])
    assert res_get_a.returncode == 0, f"Failed to get Account A. stderr: {res_get_a.stderr}"
    try:
        account_a = json.loads(res_get_a.stdout.strip())
    except Exception:
        lines = res_get_a.stdout.strip().split("\n")
        account_a = json.loads(lines[-1])
    assert account_a["balance"] == 70, f"Expected Account A balance 70, got {account_a.get('balance')}"

    # 5. Verify Balance B
    res_get_b = run_convex_command(["bank:getAccount", f'{{"accountId": "{account_b_id}"}}'])
    assert res_get_b.returncode == 0, f"Failed to get Account B. stderr: {res_get_b.stderr}"
    try:
        account_b = json.loads(res_get_b.stdout.strip())
    except Exception:
        lines = res_get_b.stdout.strip().split("\n")
        account_b = json.loads(lines[-1])
    assert account_b["balance"] == 80, f"Expected Account B balance 80, got {account_b.get('balance')}"

    # 6. Test Insufficient Funds (100 from A to B)
    res_fail = run_convex_command(["bank:transfer", f'{{"from": "{account_a_id}", "to": "{account_b_id}", "amount": 100}}'])
    assert res_fail.returncode != 0, "Transfer should have failed due to insufficient funds, but it succeeded."

    # 7. Verify Balance A Remains Unchanged
    res_get_a_again = run_convex_command(["bank:getAccount", f'{{"accountId": "{account_a_id}"}}'])
    assert res_get_a_again.returncode == 0, f"Failed to get Account A. stderr: {res_get_a_again.stderr}"
    try:
        account_a_again = json.loads(res_get_a_again.stdout.strip())
    except Exception:
        lines = res_get_a_again.stdout.strip().split("\n")
        account_a_again = json.loads(lines[-1])
    assert account_a_again["balance"] == 70, f"Expected Account A balance to remain 70, got {account_a_again.get('balance')}"
