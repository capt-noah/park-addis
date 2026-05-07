FROM oven/bun:1
WORKDIR /parkaddis-backend
COPY . .
RUN bun install
CMD ["bun", "src/server.ts"]