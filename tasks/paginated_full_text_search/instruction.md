# Paginated Full-Text Search in Convex

## Background
Convex supports powerful full-text search directly within its database. You need to implement a paginated search query for a chat application's messages.

## Requirements
- Define a `messages` table in `convex/schema.ts` with `body` (string) and `channel` (string) fields.
- Add a search index named `search_body` on the `messages` table. The index should search the `body` field and filter on the `channel` field.
- Create a public query named `searchMessages` in `convex/messages.ts`.
- The query must accept `paginationOpts` (using Convex's `paginationOptsValidator`), a `query` string, and a `channel` string.
- The query must use `.withSearchIndex` to search the `body` field for the `query` string and filter by the `channel`.
- The query must return paginated results using `.paginate(args.paginationOpts)`.

## Implementation Guide
1. Initialize a Node.js project in `/home/user/convex-app`.
2. Install the `convex` package.
3. Create `convex/schema.ts` and define the schema with the `messages` table and `search_body` index.
4. Create `convex/messages.ts` and implement the `searchMessages` query.

## Constraints
- Project path: `/home/user/convex-app`
- Do not run `npx convex dev` as it requires cloud authentication. Just write the code correctly.

## Integrations
- None