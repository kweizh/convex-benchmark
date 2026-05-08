FROM ubuntu:24.04

RUN apt-get update -y && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        curl ca-certificates git python3 python3-pip python3-pytest bash && \
    curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/user && chmod 0755 /home/user

LABEL Author="any-task-builder"
LABEL Description="Vite React environment with Convex installed for optimistic updates task."

RUN mkdir -p /home/user/project && \
    cd /home/user/project && \
    npm create vite@latest . -- --template react-ts && \
    npm install && \
    npm install convex && \
    mkdir -p convex && \
    cat > convex/schema.ts <<'EOF'
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  counter: defineTable({
    value: v.number(),
  }),
});
EOF
RUN cd /home/user/project && \
    cat > convex/counter.ts <<'EOF'
import { query, mutation } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const document = await ctx.db.query("counter").first();
    return document ? document.value : 0;
  },
});

export const increment = mutation({
  args: {},
  handler: async (ctx) => {
    const document = await ctx.db.query("counter").first();
    if (document) {
      await ctx.db.patch(document._id, { value: document.value + 1 });
    } else {
      await ctx.db.insert("counter", { value: 1 });
    }
  },
});
EOF
RUN cd /home/user/project && \
    cat > src/App.tsx <<'EOF'
import React from 'react';

function App() {
  return (
    <div>
      <h1>Convex Counter</h1>
    </div>
  );
}

export default App;
EOF

# Container contents:
#   - Node.js v24 and Vite React project in /home/user/project
#   - Convex installed and schema defined

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]
