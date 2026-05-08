FROM oven/bun:1 AS build
WORKDIR parkaddis-frontend
COPY . .
RUN bun install
RUN bun run build