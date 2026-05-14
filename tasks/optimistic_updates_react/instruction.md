# Convex Optimistic Updates in React

## Background
Convex provides a powerful `.withOptimisticUpdate` feature to update the UI instantly before a mutation completes. This makes applications feel extremely fast and responsive.

## Requirements
You have a Vite React project set up at `/home/user/project` with Convex installed and initialized.
- The schema (`convex/schema.ts`) has a `counter` table with a `value` (number).
- There is a query `get` in `convex/counter.ts` to get the counter value.
- There is a mutation `increment` in `convex/counter.ts` to increment the counter.
- Your task is to update `src/App.tsx` to display the counter and have an "Increment" button.
- You MUST configure the mutation with `.withOptimisticUpdate` to immediately update the local query result before the server responds.

## Implementation Guide
1. Review `convex/schema.ts` and `convex/counter.ts` to understand the backend.
2. In `src/App.tsx`, use `useQuery` to fetch the counter and `useMutation` for the increment.
3. Configure the mutation with `.withOptimisticUpdate` to update the `localStore` immediately.

## Constraints
- Project path: /home/user/project
- The UI must render the counter value and an increment button.