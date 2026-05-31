import argparse
import os
from convex import ConvexClient

def main():
    parser = argparse.ArgumentParser(description="Add a task to Convex")
    parser.add_argument("--text", required=True, help="The text of the task")
    args = parser.parse_args()

    convex_url = os.environ["CONVEX_URL"]
    client = ConvexClient(convex_url)

    task_id = client.mutation("tasks:add", {
        "text": args.text,
        "isCompleted": False,
    })

    print(f"Inserted task ID: {task_id}")

if __name__ == "__main__":
    main()