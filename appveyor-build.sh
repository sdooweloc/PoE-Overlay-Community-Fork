#!/bin/bash
set -euo pipefail

rm -Rf ./dist

export NODE_OPTIONS="--max-old-space-size=7168" #increase to 7gb

#npm run electron:windows
#npm run build:prod && electron-builder build --windows
#build:prod
#npm run build -- -c production
#build
#npm run electron:serve-tsc && ng build
#electron:serve-tsc
#node_modules/.bin/tsc -p tsconfig.serve.json

npm run node_modules/typescript/bin/tsc -p tsconfig.serve.json && ng build -- -c production && electron-builder build --windows
