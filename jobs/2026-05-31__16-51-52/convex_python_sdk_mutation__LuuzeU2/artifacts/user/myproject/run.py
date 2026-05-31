import os
import argparse
from convex import ConvexClient

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--text", required=True, help="Task text")
    args = parser.parse_args()

    convex_url = os.environ.get("CONVEX_URL")
    if not convex_url:
        raise ValueError("CONVEX_URL environment variable is not set")

    client = ConvexClient(convex_url)
    
    # Call the mutation
    task_id = client.mutation("tasks:add", {"text": args.text, "isCompleted": False})
    
    print(f"Inserted task ID: {task_id}")

if __name__ == "__main__":
    main()
