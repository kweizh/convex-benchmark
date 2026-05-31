import argparse
import os
import sys

from convex import ConvexClient


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Insert a task into Convex.")
    parser.add_argument("--text", required=True, help="Task text to insert.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    convex_url = os.environ.get("CONVEX_URL")
    if not convex_url:
        print("CONVEX_URL is not set in the environment.", file=sys.stderr)
        return 1

    client = ConvexClient(convex_url)
    task_id = client.mutation(
        "tasks:add", {"text": args.text, "isCompleted": False}
    )
    print(f"Inserted task ID: {task_id}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
