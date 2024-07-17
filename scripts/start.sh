#!/bin/sh

if [ "$NODE_ENV" = "development" ]; then
  echo "Running in development mode"
  pnpm prisma:generate && exec pnpm run start:dev
else
  echo "Running in production mode"
  exec pnpm run start:prod
fi