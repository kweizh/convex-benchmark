import argparse
import json
import os
import sys

from convex import ConvexClient


def main() -> int:
    parser = argparse.ArgumentParser(description="Run Convex task operations.")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--add", metavar="TEXT", help="Add a task with text")
    group.add_argument("--list", action="store_true", help="List all tasks")
    parser.add_argument(
        "--status",
        default="todo",
        help="Status for new task when using --add (default: todo)",
    )
    args = parser.parse_args()

    convex_url = os.environ.get("CONVEX_URL")
    if not convex_url:
        print("CONVEX_URL is not set. Run via 'npx convex deploy --cmd'.", file=sys.stderr)
        return 1

    client = ConvexClient(convex_url)

    if args.add:
        result = client.mutation(
            "tasks:add", {"text": args.add, "status": args.status}
        )
        print(json.dumps({"insertedId": result}))
        return 0

    if args.list:
        tasks = client.query("tasks:get")
        print(json.dumps(tasks, indent=2))
        return 0

    return 1


if __name__ == "__main__":
    raise SystemExit(main())
