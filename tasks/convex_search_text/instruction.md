# Convex Full-Text Search with Pagination

## Background
Convex provides built-in full-text search capabilities using Tantivy. You need to implement a search query that filters messages by channel and supports pagination.

## Requirements
- Define a `messages` table in `convex/schema.ts` with `body` (string) and `channel` (string).
- Add a search index named `search_body` on the `messages` table. The index must search the `body` field and allow filtering by `channel`.
- Implement a `search` query in `convex/messages.ts`.
- The `search` query must accept `query` (string), `channel` (optional string), and `paginationOpts` (using Convex's `paginationOptsValidator`).
- The query must use `.withSearchIndex()` to search the `body` and optionally filter by `channel`, then return the paginated results.
- Deploy the schema and functions to the Convex cloud instance.

## Implementation Hints
- Use `defineSchema` and `defineTable` in `convex/schema.ts`.
- Use `.searchIndex()` on the table definition to configure `searchField` and `filterFields`.
- In `convex/messages.ts`, use `query` from `./_generated/server`.
- Use `paginationOptsValidator` from `convex/server` for the pagination arguments.
- Use `.withSearchIndex()` and `.paginate()` on the database query.
- Use `npx convex deploy` to deploy your changes.

## Acceptance Criteria
- Project path: /home/user/convex-search-task
- Command: `npx convex run messages:search`
- The query must accept a JSON argument with `query` (string), `channel` (optional string), and `paginationOpts` (object with `numItems`).
- The stdout should print the paginated result object containing a `page` array of matched documents.

