import os
import time
import pytest
from convex import ConvexClient

def test_deploy_log_exists():
    log_path = "/home/user/project/deploy.log"
    assert os.path.isfile(log_path), f"Deployment log {log_path} does not exist."

def test_rate_limiting():
    convex_url = os.environ.get("CONVEX_URL")
    assert convex_url is not None, "CONVEX_URL environment variable is not set."

    client = ConvexClient(convex_url)
    
    user1 = f"user1_{int(time.time())}"
    user2 = f"user2_{int(time.time())}"
    
    # Call 3 times for user1
    for i in range(3):
        try:
            client.mutation("messages:sendMessage", {"userId": user1, "text": "hello"})
        except Exception as e:
            pytest.fail(f"Expected mutation to succeed, but failed on call {i+1} for {user1}: {e}")
            
    # 4th call should fail
    with pytest.raises(Exception) as exc_info:
        client.mutation("messages:sendMessage", {"userId": user1, "text": "hello"})
    assert "Rate limit exceeded" in str(exc_info.value), \
        f"Expected error message to contain 'Rate limit exceeded', got: {exc_info.value}"
        
    # Call for user2 should succeed
    try:
        client.mutation("messages:sendMessage", {"userId": user2, "text": "hello"})
    except Exception as e:
        pytest.fail(f"Expected mutation for {user2} to succeed, but failed: {e}")
        
    # Wait 11 seconds
    time.sleep(11)
    
    # Call for user1 should succeed now
    try:
        client.mutation("messages:sendMessage", {"userId": user1, "text": "hello"})
    except Exception as e:
        pytest.fail(f"Expected mutation for {user1} to succeed after waiting, but failed: {e}")
