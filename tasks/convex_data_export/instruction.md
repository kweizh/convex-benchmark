# Export Data via Convex HTTP Action

## Background
Convex provides HTTP actions to expose public endpoints. You need to build a Convex backend that exposes a public HTTP GET endpoint to export all records from a specific table as a JSON array.

## Requirements
- Initialize a Convex project in `/home/user/myproject`.
- Define a table named `products_{run_id}` where `{run_id}` is the value of the `ZEALT_RUN_ID` environment variable with all hyphens (`-`) replaced by underscores (`_`).
- The table schema must include `name` (string) and `price` (number).
- Expose a Convex HTTP action at `GET /exportProducts`.
- The HTTP action must query all records from the `products_{run_id}` table and return them as a JSON array.
- Deploy the project to Convex.

## Implementation Hints
1. Read the `ZEALT_RUN_ID` environment variable and replace hyphens with underscores to form the table name (e.g., `products_zr_12345`).
2. Define the schema in `convex/schema.ts` using the generated table name.
3. Create an HTTP router in `convex/http.ts`.
4. Define a `route` for `path: "/exportProducts"` and `method: "GET"`.
5. In the handler, use `ctx.runQuery` to execute an internal query that fetches all documents from the generated table name, or write the query logic directly if supported.
6. Return the records as a JSON response using `new Response(JSON.stringify(records), { headers: { "Content-Type": "application/json" } })`.
7. Use `npx convex deploy` to deploy the functions to the cloud.

## Acceptance Criteria
- Project path: /home/user/myproject
- Ensure the Convex deployment is executed and the functions are live in the cloud.
- The Convex table must be named `products_{run_id}` where `{run_id}` is the value of the `ZEALT_RUN_ID` environment variable with all hyphens replaced by underscores.
- The HTTP action must be exposed at the route `GET /exportProducts` on the Convex site URL.
- The HTTP action must return a JSON array containing all records from the table with a 200 OK status.

