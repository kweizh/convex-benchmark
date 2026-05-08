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
LABEL Description="Convex project with a mutation that incorrectly uses fetch."

RUN mkdir -p /home/user/myproject/convex && \
    cd /home/user/myproject && \
    cat >package.json <<'EOF'
{
  "name": "myproject",
  "version": "1.0.0",
  "dependencies": {
    "convex": "^1.16.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0"
  }
}
EOF

RUN cd /home/user/myproject && \
    cat >tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true
  },
  "include": ["convex/**/*"]
}
EOF

RUN cd /home/user/myproject && \
    cat >convex/schema.ts <<'EOF'
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    text: v.string(),
  }),
});
EOF

RUN cd /home/user/myproject && \
    cat >convex/messages.ts <<'EOF'
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const sendMessage = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    // ANTI-PATTERN: fetch inside mutation
    const response = await fetch('https://httpstat.us/200', {
      method: 'POST',
      body: JSON.stringify({ text: args.text })
    });
    if (!response.ok) {
      throw new Error("Failed to send message");
    }
    
    await ctx.db.insert("messages", { text: args.text });
  },
});
EOF

RUN cd /home/user/myproject && npm install

RUN mkdir -p /home/user/myproject/convex/_generated && \
    cat >/home/user/myproject/convex/_generated/server.d.ts <<'EOF'
import { GenericActionCtx, GenericMutationCtx, GenericQueryCtx } from "convex/server";
export declare const query: any;
export declare const mutation: any;
export declare const action: any;
export declare const internalQuery: any;
export declare const internalMutation: any;
export declare const internalAction: any;
EOF

RUN cat >/home/user/myproject/convex/_generated/server.js <<'EOF'
export const query = () => {};
export const mutation = () => {};
export const action = () => {};
export const internalQuery = () => {};
export const internalMutation = () => {};
export const internalAction = () => {};
EOF

RUN cat >/home/user/myproject/convex/_generated/api.d.ts <<'EOF'
export declare const api: any;
export declare const internal: any;
EOF

RUN cat >/home/user/myproject/convex/_generated/api.js <<'EOF'
export const api = {};
export const internal = {};
EOF

# Container contents:
#   - Node.js v24 installed.
#   - /home/user/myproject — Convex project with an incorrect mutation.
#   - convex/messages.ts contains the sendMessage mutation with a fetch call.

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]
