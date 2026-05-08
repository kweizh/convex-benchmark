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
LABEL Description="Convex project with circular type dependencies in _generated/api."

RUN mkdir -p /home/user/convex-project/convex/_generated && \
    cd /home/user/convex-project && \
    npm init -y && \
    npm install convex typescript @types/node && \
    npm pkg set type="module" && \
    cat >tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "es2022",
    "module": "esnext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "ignoreDeprecations": "6.0"
  }
}
EOF

RUN cd /home/user/convex-project && \
    cat >convex/_generated/server.ts <<'EOF'
export type Ctx = {
  runQuery: <Args, Return>(func: (ctx: Ctx) => Promise<Return>) => Promise<Return>;
};
export function query<Args, Return>(obj: { args: Args; handler: (ctx: Ctx) => Promise<Return> }): (ctx: Ctx) => Promise<Return> {
  return obj.handler;
}
EOF

RUN cd /home/user/convex-project && \
    cat >convex/_generated/api.ts <<'EOF'
import * as users from "../users";
import * as posts from "../posts";
import * as comments from "../comments";

export const api = {
    users,
    posts,
    comments
};
EOF

RUN cd /home/user/convex-project && \
    cat >convex/users.ts <<'EOF'
import { query } from "./_generated/server";
import { api } from "./_generated/api";

export const getUser = query({
  args: {},
  handler: async (ctx) => {
    return { name: "Alice", post: await ctx.runQuery(api.posts.getPost) };
  }
});
EOF

RUN cd /home/user/convex-project && \
    cat >convex/posts.ts <<'EOF'
import { query } from "./_generated/server";
import { api } from "./_generated/api";

export const getPost = query({
  args: {},
  handler: async (ctx) => {
    return { title: "Hello", comment: await ctx.runQuery(api.comments.getComment) };
  }
});
EOF

RUN cd /home/user/convex-project && \
    cat >convex/comments.ts <<'EOF'
import { query } from "./_generated/server";
import { api } from "./_generated/api";

export const getComment = query({
  args: {},
  handler: async (ctx) => {
    return { text: "Nice", user: await ctx.runQuery(api.users.getUser) };
  }
});
EOF

# Container contents:
#   - Node.js v24 installed
#   - /home/user/convex-project with convex, typescript dependencies
#   - A mock _generated API and three mutually dependent files triggering TS circularity error.

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]
