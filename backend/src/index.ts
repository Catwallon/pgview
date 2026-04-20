import "reflect-metadata";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import cors from "@fastify/cors";
import { errorHandler } from "./utils/errorHandler.util.js";
import { DatabaseController } from "./controllers/database.controller.js";
import { container } from "tsyringe";
import { TableController } from "./controllers/table.controller.js";
import { RowController } from "./controllers/row.controller.js";
import { initEnv } from "./config/env.config.js";

console.log("Starting PgView...");

initEnv();

const fastify = Fastify();

fastify.get("/api/databases", async (request, reply) => {
  return container.resolve(DatabaseController).getAll(request, reply);
});

fastify.get("/api/databases/:dbName/tables", async (request, reply) => {
  return container.resolve(TableController).getAll(request, reply);
});

fastify.get(
  "/api/databases/:dbName/tables/:tableName",
  async (request, reply) => {
    return container.resolve(TableController).get(request, reply);
  },
);

fastify.get(
  "/api/databases/:dbName/tables/:tableName/rows",
  async (request, reply) => {
    return container.resolve(RowController).getAll(request, reply);
  },
);

fastify.post(
  "/api/databases/:dbName/tables/:tableName/rows",
  async (request, reply) => {
    return container.resolve(RowController).create(request, reply);
  },
);

fastify.put(
  "/api/databases/:dbName/tables/:tableName/rows",
  async (request, reply) => {
    return container.resolve(RowController).editMany(request, reply);
  },
);

fastify.delete(
  "/api/databases/:dbName/tables/:tableName/rows",
  async (request, reply) => {
    return container.resolve(RowController).deleteMany(request, reply);
  },
);

fastify.setErrorHandler(errorHandler);

if (process.env.NODE_ENV === "production") {
  fastify.register(fastifyStatic, {
    root: "/public",
    prefix: "/",
  });

  fastify.setNotFoundHandler((request, reply) => {
    return reply.sendFile("index.html");
  });
} else {
  fastify.register(cors, {
    origin: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  });
}

fastify.listen({ port: 8080, host: "0.0.0.0" }).then(() => {
  console.log("PgView is running on http://0.0.0.0:8080");
});
