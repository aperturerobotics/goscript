#!/bin/bash
set -eo pipefail
set -x

# Compile Go code to TypeScript using GoScript
go run -v github.com/aperturerobotics/goscript/cmd/goscript \
     compile \
     --all-dependencies \
     --package ./todo
