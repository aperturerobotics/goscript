#!/bin/bash
set -eo pipefail

# Build the GoScript code
bash build.bash

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    bun install
fi

# Run the server
bun run server.ts
