#!/bin/sh

if [ "$NODE_ENV" = "development" ]; then
  echo "Running in development mode"
  pnpm db:migrate && exec pnpm run start:dev
else
  echo "Running in production mode"
  pnpm db:migrate:prod && exec pnpm run start:prod
fi