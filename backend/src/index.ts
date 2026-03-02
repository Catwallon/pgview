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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.NODE_ENV) {
  console.error("NODE_ENV is not set.");
  exit(1);
}

const fastify = Fastify();

fastify.get("/api/databases", async (request, reply) => {
  return container.resolve(DatabaseController).getAll(request, reply);
});

fastify.get("/api/databases/:databaseName/tables", async (request, reply) => {
  return container.resolve(TableController).getAll(request, reply);
});

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
  });
}

fastify.listen({ port: 3000, host: "0.0.0.0" });
