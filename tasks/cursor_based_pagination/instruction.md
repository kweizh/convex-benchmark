# Convex Cursor-Based Pagination

## Background
Convex provides a built-in `paginate` method on database queries to fetch data in chunks using a cursor. This is essential for building scalable lists and feeds.

## Requirements
- Initialize a Convex project in `/home/user/project`.
- Define a schema with a `messages` table containing `text` (string) and `author` (string).
- Create a mutation to send messages.
- Create a paginated query to list messages in descending order.
- Write a Node.js script that populates the database and tests the pagination, saving the results to a JSON file.

## Implementation Guide
1. Initialize a Node.js project in `/home/user/project` and install `convex` and `dotenv`.
2. Create `convex/schema.ts` defining a `messages` table with `text: v.string()` and `author: v.string()`.
3. Create `convex/messages.ts` with:
   - A `send` mutation taking `text` and `author`.
   - A `list` query taking `paginationOpts: paginationOptsValidator` and returning `ctx.db.query("messages").order("desc").paginate(args.paginationOpts)`.
4. Create `/home/user/project/test_pagination.js` that uses `ConvexHttpClient` to:
   - Call the `send` mutation 5 times with different messages.
   - Call the `list` query with `paginationOpts: { numItems: 2, cursor: null }`.
   - Call the `list` query again using the `continueCursor` from the first result and `numItems: 2`.
   - Write an object containing `page1` (first result page array) and `page2` (second result page array) to `/home/user/project/output.json`.

## Constraints
- Project path: `/home/user/project`
- Log file: `/home/user/project/output.json`
- You must deploy your Convex functions using `npx convex deploy`.
- Ensure you configure the client in your script with the `CONVEX_URL` environment variable.

## Integrations
- None