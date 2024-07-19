
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app




FROM base AS install
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM base
COPY --from=install /app/node_modules /app/node_modules


ARG NODE_ENV

RUN chmod +x /app/scripts/start.sh


CMD ["scripts/start.sh"]

