#!/bin/bash
set -eo pipefail

bash build.bash

bun run ./main.ts