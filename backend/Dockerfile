FROM oven/bun:1
WORKDIR /parkaddis-backend
COPY . .
RUN bun install
EXPOSE 1000
CMD ["bun", "src/server.ts"]