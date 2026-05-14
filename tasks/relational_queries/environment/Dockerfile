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
LABEL Description="Convex project initialized with convex and typescript."

RUN mkdir -p /home/user/project && \
    cd /home/user/project && \
    npm init -y && \
    npm install convex typescript @types/node && \
    npx tsc --init && \
    mkdir -p convex

# Container contents:
#   - Node.js v24 for Convex
#   - /home/user/project with npm initialized, convex, and typescript installed
#   - /home/user/project/convex directory

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]