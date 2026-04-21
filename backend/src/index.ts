import "reflect-metadata";
import { DatabaseController } from "./controllers/database.controller.js";
import { container } from "tsyringe";
import { TableController } from "./controllers/table.controller.js";
import { RowController } from "./controllers/row.controller.js";
import { initEnv } from "./config/env.config.js";
import { Hono } from "hono";
import { cors } from "hono/cors";

console.log("Starting PgView...");

initEnv();

const hono = new Hono();

if (process.env.NODE_ENV === "production") {
  const frontend = await Bun.file(
    new URL("./public/index.html", import.meta.url),
  ).text();

  hono.get("/", (c) => c.html(frontend));
} else {
  hono.get(
    "/*",
    cors({
      origin: "http://localhost:5173",
    }),
  );
}

hono.get("/api/databases", async (c) => {
  return container.resolve(DatabaseController).getAll(c);
});

hono.get("/api/databases/:dbName/tables", async (c) => {
  return container.resolve(TableController).getAll(c);
});

hono.get("/api/databases/:dbName/tables/:tableName", async (c) => {
  return container.resolve(TableController).get(c);
});

hono.get("/api/databases/:dbName/tables/:tableName/rows", async (c) => {
  return container.resolve(RowController).getAll(c);
});

hono.post("/api/databases/:dbName/tables/:tableName/rows", async (c) => {
  return container.resolve(RowController).create(c);
});

hono.put("/api/databases/:dbName/tables/:tableName/rows", async (c) => {
  return container.resolve(RowController).editMany(c);
});

hono.delete("/api/databases/:dbName/tables/:tableName/rows", async (c) => {
  return container.resolve(RowController).deleteMany(c);
});

export default {
  port: 8080,
  fetch: hono.fetch,
};
