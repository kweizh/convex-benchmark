Convex uses a code-first approach for defining database schemas with strong runtime validation.

You need to define a database schema for a simple task manager in `convex/schema.ts`. The schema must contain a single table named `tasks` with two fields: a string `text` and a union `status` that only accepts the literal strings "todo" or "done". You must also define an index named `by_status` on the `status` field.

**Constraints:**
- Do NOT create any additional tables or fields outside of the specified requirements.
- You MUST use Convex's built-in `v` validator imported from `convex/values`.
- The final code must successfully export the schema using `defineSchema`.