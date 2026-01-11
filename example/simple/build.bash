#!/bin/bash
set -eo pipefail
set -x

go run -v github.com/aperturerobotics/goscript/cmd/goscript \
     compile \
     --all-dependencies \
     --package .

# Copy for reference
cp ./output/@goscript/example/main.gs.ts ./main.gs.ts
