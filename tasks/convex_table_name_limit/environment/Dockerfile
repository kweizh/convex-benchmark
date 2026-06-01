FROM ubuntu:24.04

RUN apt-get update -y && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        curl wget ca-certificates git python3 python3-pip python3-pytest bash ripgrep && \
    curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    pip3 install --break-system-packages pytest-json-ctrf && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/user && chmod 0755 /home/user

# Setup the initial Convex project
RUN mkdir -p /home/user/project && \
    cd /home/user/project && \
    npm init -y && \
    npm install convex typescript && \
    mkdir -p convex && \
    cat >convex/schema.ts <<'EOF'
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  "my-tasks": defineTable({
    text: v.string(),
  }),
});
EOF
RUN cd /home/user/project && \
    cat >convex/tasks.ts <<'EOF'
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("my-tasks").collect();
  },
});

export const add = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("my-tasks", { text: args.text });
  },
});
EOF

LABEL Author="generate-harbor-tasks"
LABEL Description="Convex project with an invalid table name 'my-tasks'."

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]

# Container contents:
#   - always required apt packages: curl wget ca-certificates git python3 python3-pip python3-pytest bash ripgrep
#   - always required pip3 packages: pytest-json-ctrf
#   - Node.js v24 for running the Convex client and CLI
#   - /home/user/project: initial Convex project directory with invalid table name in schema.ts
