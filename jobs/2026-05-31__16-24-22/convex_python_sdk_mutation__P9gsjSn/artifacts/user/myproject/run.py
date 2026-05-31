import os
import argparse
from convex import ConvexClient

def main():
    parser = argparse.ArgumentParser(description="Call Convex mutation to add a task.")
    parser.add_argument("--text", required=True, help="The text of the task.")
    args = parser.parse_args()

    convex_url = os.environ.get("CONVEX_URL")
    if not convex_url:
        print("Error: CONVEX_URL environment variable is not set.")
        return

    client = ConvexClient(convex_url)
    
    try:
        task_id = client.mutation("tasks:add", {"text": args.text, "isCompleted": False})
        print(f"Inserted task ID: {task_id}")
    except Exception as e:
        print(f"Error calling mutation: {e}")

if __name__ == "__main__":
    main()
