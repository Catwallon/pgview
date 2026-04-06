import "reflect-metadata";
import { fileURLToPath } from "url";
import Fastify from "fastify";
import fastifyStatic from "@fastify/static";
import path from "path";
import { exit } from "process";
import cors from "@fastify/cors";
import { errorHandler } from "./utils/errorHandler.util.js";
import { DatabaseController } from "./controllers/database.controller.js";
import { container } from "tsyringe";
import { TableController } from "./controllers/table.controller.js";
import { ColumnController } from "./controllers/column.controller.js";
import { RowController } from "./controllers/row.controller.js";
import { types } from "pg";
import { initEnv } from "./config/env.config.js";

console.log("Starting PgView...");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.NODE_ENV) {
  console.error("NODE_ENV is not set.");
  exit(1);
}

types.setTypeParser(17, (val) => val);
types.setTypeParser(600 as any, (val) => val);
types.setTypeParser(718, (val) => val);
types.setTypeParser(1082, (val) => val);
types.setTypeParser(1083, (val) => val);
types.setTypeParser(1114, (val) => val);
types.setTypeParser(1186, (val) => val);
types.setTypeParser(1184, (val) => val);
types.setTypeParser(1266, (val) => val);

initEnv();

const fastify = Fastify();

fastify.get("/api/databases", async (request, reply) => {
  return container.resolve(DatabaseController).getAll(request, reply);
});

fastify.get("/api/databases/:dbName/tables", async (request, reply) => {
  return container.resolve(TableController).getAll(request, reply);
});

fastify.get(
  "/api/databases/:dbName/tables/:tableName/columns",
  async (request, reply) => {
    return container.resolve(ColumnController).getAll(request, reply);
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
  "/api/databases/:dbName/tables/:tableName/rows/:rowId",
  async (request, reply) => {
    return container.resolve(RowController).edit(request, reply);
  },
);

fastify.delete(
  "/api/databases/:dbName/tables/:tableName/rows/:rowId",
  async (request, reply) => {
    return container.resolve(RowController).delete(request, reply);
  },
);

fastify.setErrorHandler(errorHandler);

if (process.env.NODE_ENV === "production") {
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, "../../frontend/dist"),
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
