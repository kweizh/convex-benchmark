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
LABEL Description="Convex project with soft delete pattern task environment."

RUN mkdir -p /home/user/project && \
    cd /home/user/project && \
    npm init -y && \
    npm install convex && \
    mkdir -p convex && \
    cat > convex/tsconfig.json <<'EOF'
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["ES2021", "DOM"],
    "forceConsistentCasingInFileNames": true,
    "allowJs": true,
    "strict": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "module": "ESNext",
    "moduleResolution": "Node"
  },
  "include": ["./**/*"],
  "exclude": ["./_generated"]
}
EOF

# Container contents:
#   - Node.js v24 installed.
#   - /home/user/project - Initialized Node.js project with convex installed.
#   - /home/user/project/convex - Convex directory for the task.

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]