import os
import subprocess
import json
import pytest
import time

PROJECT_DIR = "/home/user/convex-aggregate"

@pytest.fixture(scope="session", autouse=True)
def deploy_app():
    # Deploy the convex app to production
    result = subprocess.run(
        ["npx", "convex", "deploy"],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode == 0, f"'npx convex deploy' failed: {result.stderr}\n{result.stdout}"
    yield

def run_convex_function(function_name, args_dict):
    """Helper to run a convex function via CLI."""
    args_json = json.dumps(args_dict)
    result = subprocess.run(
        ["npx", "convex", "run", "--prod", function_name, args_json],
        capture_output=True, text=True, cwd=PROJECT_DIR
    )
    assert result.returncode == 0, f"'npx convex run --prod {function_name}' failed: {result.stderr}"
    return result.stdout

def test_aggregate_functions():
    run_id = os.environ.get("ZEALT_RUN_ID", "default-run-id")
    
    # 1. Add Expenses
    run_convex_function("expenses:addExpense", {"category": f"food-{run_id}", "amount": 50})
    run_convex_function("expenses:addExpense", {"category": f"food-{run_id}", "amount": 75})
    run_convex_function("expenses:addExpense", {"category": f"travel-{run_id}", "amount": 200})
    
    # Wait a moment for aggregate to update
    time.sleep(2)
    
    # 2. Get Category Stats for Food
    food_out = run_convex_function("expenses:getCategoryStats", {"category": f"food-{run_id}"})
    assert "2" in food_out and "125" in food_out, f"Expected count: 2, totalAmount: 125 in food stats. Got: {food_out}"
    
    # 3. Get Category Stats for Travel
    travel_out = run_convex_function("expenses:getCategoryStats", {"category": f"travel-{run_id}"})
    assert "1" in travel_out and "200" in travel_out, f"Expected count: 1, totalAmount: 200 in travel stats. Got: {travel_out}"
    
    # 4. Get Category Stats for Unknown
    unknown_out = run_convex_function("expenses:getCategoryStats", {"category": f"unknown-{run_id}"})
    assert "0" in unknown_out, f"Expected count: 0, totalAmount: 0 in unknown stats. Got: {unknown_out}"
