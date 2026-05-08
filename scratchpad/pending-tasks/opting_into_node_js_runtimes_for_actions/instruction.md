Convex queries and mutations run in a restricted V8 environment, meaning Node.js built-ins (like `crypto` or `fs`) cannot be used unless explicitly scoped within a Node.js-specific action.

You need to write an action in `convex/cryptoOperations.ts` that uses the native Node.js `crypto` module to generate a SHA-256 hash of a provided string. Create an action named `generateHash` that accepts a `data` string argument, hashes it using `crypto.createHash`, and returns the hex string representation.

**Constraints:**
- You MUST include the `"use node";` directive at the very top of the file to opt into the Node.js runtime.
- Do NOT define this function as a `query` or `mutation`, as the `crypto` module will cause the V8 environment to throw an error.