FROM ubuntu:24.04

RUN apt-get update -y && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        curl wget ca-certificates git python3 python3-pip python3-pytest bash ripgrep \
        build-essential pkg-config libssl-dev && \
    curl -fsSL https://deb.nodesource.com/setup_24.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    pip3 install --break-system-packages pytest-json-ctrf && \
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV PATH="/root/.cargo/bin:${PATH}"

RUN mkdir -p /home/user && chmod 0755 /home/user
RUN mkdir -p /home/user/rust-convex-task

LABEL Author="generate-harbor-tasks"
LABEL Description="Convex Rust SDK CLI task environment with Node.js v24 and Rust installed."

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]

# Container contents:
#   - always required apt packages: curl wget ca-certificates git python3 python3-pip python3-pytest bash ripgrep
#   - additional apt packages for Rust: build-essential pkg-config libssl-dev
#   - always required pip3 packages: pytest-json-ctrf
#   - Node.js v24 for the Convex CLI
#   - Rust and Cargo for the Rust CLI
#   - /home/user/rust-convex-task: directory for the project
