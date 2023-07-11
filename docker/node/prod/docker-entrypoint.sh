#!/bin/sh

echo "Building..."
npm run build

echo "Running new app..."
node /srv/app/.output/server/index.mjs
