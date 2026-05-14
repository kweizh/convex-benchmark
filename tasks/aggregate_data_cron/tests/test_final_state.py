import os
import pytest

PROJECT_DIR = "/home/user/project"

def test_aggregate_file_exists():
    aggregate_path = os.path.join(PROJECT_DIR, "convex", "aggregate.ts")
    assert os.path.isfile(aggregate_path), f"aggregate.ts not found at {aggregate_path}"

def test_aggregate_contents():
    aggregate_path = os.path.join(PROJECT_DIR, "convex", "aggregate.ts")
    with open(aggregate_path) as f:
        content = f.read()
    
    assert "internalMutation" in content, "Expected 'internalMutation' in aggregate.ts"
    assert "events" in content, "Expected reference to 'events' table in aggregate.ts"
    assert "aggregations" in content, "Expected reference to 'aggregations' table in aggregate.ts"
    assert "run" in content, "Expected 'run' to be exported in aggregate.ts"
    assert "totalValue" in content, "Expected 'totalValue' field assignment in aggregate.ts"

def test_crons_file_exists():
    crons_path = os.path.join(PROJECT_DIR, "convex", "crons.ts")
    assert os.path.isfile(crons_path), f"crons.ts not found at {crons_path}"

def test_crons_contents():
    crons_path = os.path.join(PROJECT_DIR, "convex", "crons.ts")
    with open(crons_path) as f:
        content = f.read()
    
    assert "cronJobs" in content, "Expected 'cronJobs' in crons.ts"
    assert "crons.interval" in content, "Expected 'crons.interval' in crons.ts"
    assert "hours: 1" in content or "hours:1" in content, "Expected '{ hours: 1 }' in crons.ts"
    assert "internal.aggregate.run" in content, "Expected 'internal.aggregate.run' in crons.ts"
