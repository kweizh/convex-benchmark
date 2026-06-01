FROM ubuntu:24.04

RUN apt-get update -y && \
    DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
        curl wget ca-certificates git python3 python3-pip python3-pytest bash ripgrep build-essential && \
    pip3 install --break-system-packages pytest-json-ctrf && \
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

ENV PATH="/root/.cargo/bin:${PATH}"

RUN mkdir -p /home/user && chmod 0755 /home/user && \
    mkdir -p /home/user/project

LABEL Author="generate-harbor-tasks"
LABEL Description="Rust environment for Convex SDK query task"

CMD ["/bin/bash", "-c", "trap : TERM INT; sleep infinity & wait"]

# Container contents:
#   - always required apt packages: curl wget ca-certificates git python3 python3-pip python3-pytest bash ripgrep build-essential
#   - always required pip3 packages: pytest-json-ctrf
#   - rust installed via rustup
#   - /home/user/project: project directory
