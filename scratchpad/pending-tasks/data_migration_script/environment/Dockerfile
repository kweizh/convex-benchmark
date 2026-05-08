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
LABEL Description="Convex project initialized in /home/user/project."

RUN mkdir -p /home/user/project/convex && \
    cd /home/user/project && \
    npm init -y && \
    npm install convex && \
    cat > convex/schema.ts <<'EOF'
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    status: v.union(v.literal("todo"), v.literal("done")),
  }),
});
EOF

# Container contents:
#   - Node.js v24 installed
#   - /home/user/project - Convex project with package.json and convex/schema.ts

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]
