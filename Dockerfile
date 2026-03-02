FROM node:25-alpine

WORKDIR /app

RUN mkdir backend

COPY backend backend

RUN npm install --prefix backend
RUN npm run build --prefix backend

RUN mkdir frontend

COPY frontend frontend

RUN npm install --prefix frontend
RUN npm run build --prefix frontend

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "run", "start", "--prefix", "backend"]