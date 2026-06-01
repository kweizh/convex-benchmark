# Efficient Aggregation in Convex

## Background
Convex is a reactive database where queries automatically stay in sync with the client. When you need to calculate counts and sums across many documents, naive approaches like fetching all documents can be slow. The `@convex-dev/aggregate` component provides a scalable way to maintain counts and sums.

## Requirements
- Initialize a Convex project.
- Install the `@convex-dev/aggregate` component and configure it in `convex/convex.config.ts`.
- Define a schema with an `expenses` table containing `category` (string) and `amount` (number).
- Create a `TableAggregate` for the `expenses` table. Use the `category` as the `namespace` and the `amount` as the `sumValue`. The `sortKey` can be the document's `_creationTime`.
- Create a mutation `api.expenses.addExpense` that takes `category` (string) and `amount` (number). It must insert the expense into the database and also insert it into the aggregate.
- Create a query `api.expenses.getCategoryStats` that takes `category` (string) and returns an object `{ count: number, totalAmount: number }` by querying the aggregate for the given category namespace.

## Implementation Hints
- Read the `@convex-dev/aggregate` documentation to understand how to use `TableAggregate`.
- Remember to update the aggregate in the same mutation where you insert the document into the table.
- The client will pass a `run-id` suffixed `category` (e.g. `food-<run-id>`) to isolate test data. You don't need to handle `run-id` specially in your backend logic, just use the `category` argument as provided.

## Acceptance Criteria
- Project path: /home/user/convex-aggregate
- Deployment: Ensure the code is deployed to the production environment using `npx convex deploy`.
- API Endpoints (Convex Functions):
  - Mutation `api.expenses.addExpense`: Accepts `{ category: string, amount: number }` and returns the new document ID.
  - Query `api.expenses.getCategoryStats`: Accepts `{ category: string }` and returns `{ count: number, totalAmount: number }`.
- The `getCategoryStats` query MUST use the aggregate component to calculate the stats, not a naive `.collect()` and manual sum.

