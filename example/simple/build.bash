#!/bin/bash
set -eo pipefail
set -x

go run -v github.com/s4wave/goscript/cmd/goscript \
     compile \
     --package .

# Copy for reference
cp ./output/@goscript/example/main.gs.ts ./main.gs.ts
