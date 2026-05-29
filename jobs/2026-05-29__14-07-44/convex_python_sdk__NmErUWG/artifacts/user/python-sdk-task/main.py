import os
import argparse
from convex import ConvexClient

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--run-id", required=True)
    args = parser.parse_args()

    convex_url = os.environ.get("CONVEX_URL")
    if not convex_url:
        print("CONVEX_URL environment variable not set")
        return

    client = ConvexClient(convex_url)
    
    # Call mutation
    client.mutation("tasks:add", {"text": "Hello from Python", "run_id": args.run_id})
    
    # Call query
    tasks = client.query("tasks:get_by_run_id", {"run_id": args.run_id})
    
    print(tasks)

if __name__ == "__main__":
    main()
