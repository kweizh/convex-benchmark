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

RUN mkdir -p /home/user/project && \
    cd /home/user/project && \
    npm init -y && \
    npm install convex && \
    mkdir -p convex && \
    cat >setup.sh <<'EOF'
#!/bin/bash
export TABLE_NAME="tasks_${ZEALT_RUN_ID//-/_}"
cat <<SCHEMA > convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
  ${TABLE_NAME}: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
});
SCHEMA

cat <<SETUP_MUTATION > convex/setup.ts
import { mutation } from "./_generated/server";

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    await ctx.db.insert("${TABLE_NAME}", { text: "Buy groceries", isCompleted: true });
    await ctx.db.insert("${TABLE_NAME}", { text: "Go for a swim", isCompleted: true });
    await ctx.db.insert("${TABLE_NAME}", { text: "Integrate Convex", isCompleted: false });
  },
});
SETUP_MUTATION

npx convex deploy
npx convex run setup:seed
EOF

RUN chmod +x /home/user/project/setup.sh

LABEL Author="generate-harbor-tasks"
LABEL Description="Convex schema migrations task environment with Node.js v24 and Convex client installed."

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]

# Container contents:
#   - always required apt packages: curl wget ca-certificates git python3 python3-pip python3-pytest bash ripgrep
#   - always required pip3 packages: pytest-json-ctrf
#   - Node.js v24 for the Convex project
#   - /home/user/project: directory for the Convex project with setup.sh
