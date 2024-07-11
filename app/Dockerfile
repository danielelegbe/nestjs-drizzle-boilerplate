FROM node:20

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

COPY . .

# Install dependencies with pnpm
RUN pnpm install

ARG PORT=3000
ENV PORT $PORT

RUN pnpm run build

CMD ["pnpm", "run", "start:dev"]