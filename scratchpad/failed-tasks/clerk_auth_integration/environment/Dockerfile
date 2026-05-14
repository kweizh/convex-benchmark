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
LABEL Description="Next.js task environment with Convex pre-installed."

RUN cd /home/user && \
    npx create-next-app@latest app --typescript --tailwind --eslint --app --src-dir false --import-alias "@/*" --use-npm && \
    cd app && \
    npm install convex && \
    mkdir -p convex && \
    cat > convex/schema.ts <<'EOF'
import { defineSchema } from "convex/server";
export default defineSchema({});
EOF

# Container contents:
#   - Node.js v24
#   - /home/user/app - Next.js application with Convex installed

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]
