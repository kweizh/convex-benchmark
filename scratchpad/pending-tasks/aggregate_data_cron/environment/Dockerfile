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
LABEL Description="Convex project with an initial schema in /home/user/project."

RUN mkdir -p /home/user/project/convex && \
    cd /home/user/project && \
    npm init -y && \
    npm install convex typescript && \
    cat >convex/schema.ts <<'EOF'
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  events: defineTable({
    type: v.string(),
    value: v.number(),
  }),
  aggregations: defineTable({
    totalValue: v.number(),
  }),
});
EOF

# Container contents:
#   - Node.js v24 installed
#   - /home/user/project initialized with npm, convex, and typescript
#   - /home/user/project/convex/schema.ts created with events and aggregations tables

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]
