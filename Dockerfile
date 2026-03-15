FROM node:24-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store pnpm install --frozen-lockfile

COPY . .
RUN pnpm build
RUN pnpm deploy --filter @pgview/backend --prod /app/backend-deploy

FROM node:24-alpine

WORKDIR /app

COPY --from=builder /app/backend/dist   ./backend/dist
COPY --from=builder /app/frontend/dist  ./frontend/dist
COPY --from=builder /app/backend-deploy/node_modules ./backend/node_modules
COPY --from=builder /app/backend-deploy/package.json ./backend/package.json

EXPOSE 8080
ENV NODE_ENV=production
CMD ["node", "./backend/dist/index.js"]