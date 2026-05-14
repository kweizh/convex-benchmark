# Convex Vector Search with Filtering

## Background
Convex supports vector search with the ability to filter results based on additional fields. This is useful for finding similar items within a specific category, such as finding similar foods within a specific cuisine.

## Requirements
- Define a `foods` table schema in `convex/schema.ts` with:
  - `description`: string
  - `cuisine`: string
  - `embedding`: array of float64
  - A vector index named `by_embedding` on the `embedding` field with 4 dimensions and filtering on `cuisine`.
- Create an internal query `fetchResults` in `convex/foods.ts` that takes an array of `foods` IDs (`ids: v.array(v.id("foods"))`) and returns the corresponding documents.
- Create an action `similarFoods` in `convex/foods.ts` that takes a `vector` (array of float64) and a `cuisine` (string), performs a vector search on the `by_embedding` index using `ctx.vectorSearch` with the provided vector and filters by the provided cuisine (exact match), and then fetches the full documents using the `fetchResults` query.

## Implementation Guide
1. Initialize a Node.js project in `/home/user/project`.
2. Install `convex`.
3. Create `convex/schema.ts` and define the `foods` table and vector index.
4. Create `convex/foods.ts` and implement the `fetchResults` internal query and `similarFoods` action.

## Constraints
- Project path: `/home/user/project`
- The `similarFoods` action should accept the vector directly as an argument `args: { vector: v.array(v.float64()), cuisine: v.string() }`.
- Do not call any external embedding API in the action.