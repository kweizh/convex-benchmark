# Soft Delete Pattern in Convex

## Background
Implement a soft delete pattern in a Convex project to keep data for auditing while hiding it from normal queries.

## Requirements
- Define a schema for a `documents` table that supports soft deletion.
- Implement a mutation to create a document.
- Implement a mutation to soft delete a document.
- Implement a query to list only active (non-deleted) documents using an index.

## Implementation Guide
1. In `/home/user/project/convex/schema.ts`, define a `documents` table with `title` (v.string()) and `isDeleted` (v.boolean()). Add an index named `by_deleted` on `["isDeleted"]`.
2. In `/home/user/project/convex/documents.ts`, export a `create` mutation that takes `title` (v.string()) and inserts a document with `title` and `isDeleted: false`. Return the ID.
3. Export a `softDelete` mutation that takes `id` (v.id("documents")) and updates `isDeleted` to `true`.
4. Export a `listActive` query that uses the `by_deleted` index to return all documents where `isDeleted` is `false`.

## Constraints
- Project path: /home/user/project
- Use `v.string()`, `v.boolean()`, and `v.id("documents")` for validation.