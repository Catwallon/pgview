FROM oven/bun:1.3.13-alpine AS builder

ARG PGVIEW_VERSION
ENV VITE_PGVIEW_VERSION=$PGVIEW_VERSION

WORKDIR /app

COPY package.json bun.lock ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/
COPY shared-types/package.json ./shared-types/

ENV BUN_INSTALL_CACHE_DIR=/root/.bun/install/cache
RUN --mount=type=cache,id=bun,target=/root/.bun/install/cache bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM alpine:3.22.4

RUN apk add --no-cache libstdc++

COPY --from=builder /app/backend/dist/pgview /pgview

EXPOSE 8080
CMD ["/pgview"]