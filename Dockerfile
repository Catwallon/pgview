FROM node:25-alpine

WORKDIR /app

COPY . .

RUN npm install -g pnpm

RUN pnpm install
RUN pnpm run build 

EXPOSE 3000

ENV NODE_ENV=production

CMD [`"pnpm", "start", "--filter", "@pgview/backend"`]