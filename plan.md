# Convex Benchmark Research Report
Convex is a reactive backend-as-a-service (BaaS) that provides a real-time database, serverless functions, and cloud infrastructure with a focus on TypeScript and developer experience.
## 1. Library Overview
*   **Description**: Convex is a "reactive database" where queries are written in TypeScript and automatically stay in sync with the client. It replaces traditional databases, ORMs, and state management libraries with a unified serverless platform.
*   **Ecosystem Role**: It acts as the entire backend layer for modern web and mobile apps (Next.js, React, Expo, etc.), handling data storage, server-side logic, real-time sync, file storage, and background jobs.
*   **Project Setup**:
    1.  Install the CLI: `npm install convex`
    2.  Initialize a project: `npx convex dev`
    3.  This command prompts for login, creates a `convex/` directory, and sets up a `.env.local` file with `CONVEX_DEPLOYMENT`.
    4.  Define schema in `convex/schema.ts`.
    5.  Write functions in `convex/`.
## 2. Core Primitives & APIs
### Functions
Convex has three main types of functions, each with specific capabilities and constraints:
*   **Queries**: Read-only, reactive, and deterministic. Run in a V8 environment.
*   **Mutations**: Write-access to the database, transactional, and deterministic. Run in a V8 environment.
*   **Actions**: Can call external APIs (side effects), but cannot directly access the database. Can run in Node.js with `"use node";`.
```typescript
// convex/tasks.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
// A Query to fetch data
export const get = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});
// A Mutation to change data
export const create = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", { text: args.text, status: "todo" });
    return taskId;
  },
});
```
### Schema & Validation
Convex uses a code-first schema with strong runtime validation.
```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    status: v.union(v.literal("todo"), v.literal("done")),
  }).index("by_status", ["status"]),
});
```
### Scheduling & Background Jobs
```typescript
// Inside a mutation or action
await ctx.scheduler.runAfter(0, internal.api.tasks.cleanup, { olderThan: Date.now() });
```
## 3. Real-World Use Cases & Templates
*   **Real-time Chat**: [Chat App Example](https://docs.convex.dev/tutorial/) - Demonstrates real-time subscriptions, user management, and AI integration.
*   **SaaS Boilerplates**: [Convex SaaS Starter](https://github.com/get-convex/convex-saas-starter) - Includes Clerk auth, Stripe integration, and multi-tenancy patterns.
*   **AI Agents**: [Convex AI Town](https://github.com/a16z-infra/ai-town) - A complex simulation using Convex for state management and background processing.
*   **Vector Search**: [Convex Vector Search](https://docs.convex.dev/search/vector-search) - Integrating LLMs with a built-in vector database.

A example creating a react app using Convex:

1. Create a React app

```bash
npm create vite@latest my-app -- --template react-ts
```

2. Install the Convex client and server library

```bash
cd my-app && npm install convex
```

3. Create sample data for your database

```jsonl
{"text": "Buy groceries", "isCompleted": true}
{"text": "Go for a swim", "isCompleted": true}
{"text": "Integrate Convex", "isCompleted": false}
```


4. Add the sample data to your database

```bash
npx convex import --table tasks sampleData.jsonl
```

5. Define a schema
Add a new file schema.ts in the convex/ folder with a description of your data.

This will declare the types of your data for optional typechecking with TypeScript, and it will be also enforced at runtime.

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
});
```

6. Expose a database query
Add a new file tasks.ts in the convex/ folder with a query function that loads the data.

Exporting a query function from this file declares an API function named after the file and the export name, api.tasks.get.

```typescript
import { query } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});
```

7. Connect the app to your backend
In src/main.tsx, create a ConvexReactClient and pass it to a ConvexProvider wrapping your app.

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  </React.StrictMode>,
);
```

8. Display the data in your app
In src/App.tsx, use the useQuery hook to fetch from your api.tasks.get API function and display the data.

```typescript
import "./App.css";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

function App() {
  const tasks = useQuery(api.tasks.get);
  return (
    <div className="App">
      {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
    </div>
  );
}

export default App;
```

9. Start the app

Start the app, open http://localhost:5173/ in a browser, and see the list of tasks.

```bash
npm run dev
```

## 4. Developer Friction Points
1.  **Table Name Limit**: Convex enforces an alphanumeric-and-underscore limit on table names, whenever a table name is used, should add notes and then convert to alphanumeric-and-underscore format.
2.  **Strict Separation of Actions and Mutations**: Developers often try to call external APIs (like OpenAI or Stripe) inside a `mutation`, which fails because mutations must be deterministic and have no side effects. The fix requires moving the API call to an `action` and then calling a mutation to save the result.
    *   *Reference*: [Actions vs Mutations](https://docs.convex.dev/functions/actions)
3.  **Circular Dependencies in Generated Code**: Large projects with many cross-file function calls can trigger TypeScript circularity limits in the `_generated/api.ts` file.
    *   *Reference*: [Circular Dependencies Workarounds](https://docs.convex.dev/generated-api/#circular-dependencies)
4.  **V8 vs Node.js Runtimes**: Using Node-specific libraries (like `fs` or certain crypto libs) in a Query/Mutation will fail. Developers must use Actions with `"use node";` for these cases.
    *   *Reference*: [Runtimes](https://docs.convex.dev/functions/runtimes)
## 5. Cloud Platform & Auth Info
To automate benchmarks or CI/CD deployments, Convex uses **Deployment Keys**.
*   **Required Auth Info**: `CONVEX_DEPLOY_KEY`
*   **How to Obtain**:
    1.  Go to the [Convex Dashboard](https://dashboard.convex.dev/).
    2.  Select your Project and Deployment (e.g., Production).
    3.  Navigate to **Settings** > **Deployment Keys**.
    4.  Generate a new key.
*   **Environment Variable Usage**:
    *   Provide `CONVEX_DEPLOY_KEY` in your environment (e.g., GitHub Secrets, `.env`).
    *   The CLI will automatically use this key when running `npx convex deploy`.
    *   Frontend clients typically need `NEXT_PUBLIC_CONVEX_URL` or `VITE_CONVEX_URL` to connect to the cloud instance,
        the value is provided in `CONVEX_URL`, please use it and set it as the needed frontend environment variable.
## 6. Evaluation Ideas
1.  **Basic CRUD**: Implement a simple task manager with schema validation and indexes.
2.  **Languages SDKs**: Use different SDKs (React, Next.js, Python, Rust) to interact with Convex backend.
    * If using Rust SDK, it may take more time 120s to build the project, should specify in tasks description to start a background job to build the Rust project.
2.  **Real-time Sync**: Create a collaborative white-board or counter where multiple clients see updates instantly.
3.  **Complex Transaction**: Implement a "bank transfer" mutation that ensures atomicity across multiple table updates.
4.  **AI Integration**: Build an action that fetches data from an external API, processes it with an LLM, and saves the result via a mutation.
5.  **Scheduled Cleanup**: Set up a cron job or a scheduled mutation to delete expired session data every hour.
6.  **File Upload Flow**: Implement a multi-step process for uploading an image to Convex Storage and storing its metadata in a table.
7.  **Paginated Search**: Build a full-text search query that returns paginated results with specific filters.
## 7. Sources
1.  [Convex llms.txt](https://www.convex.dev/llms.txt) - Structured overview of documentation and best practices.
2.  [Convex Workflow](https://docs.convex.dev/understanding/workflow) - Details on `npx convex dev` and deployment cycles.
3.  [Convex CLI Reference](https://docs.convex.dev/cli) - List of commands and environment variable usage.
4.  [Environment Variables](https://docs.convex.dev/production/hosting/environment-variables) - How to use `process.env` and built-in variables.
5.  [Custom Hosting](https://docs.convex.dev/production/hosting/custom) - Instructions for manual deployments using `CONVEX_DEPLOY_KEY`.