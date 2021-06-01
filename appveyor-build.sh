#!/bin/bash
set -euo pipefail

rm -Rf ./dist

export NODE_OPTIONS="--max-old-space-size=7168" #increase to 7gb

npm run electron:windows
