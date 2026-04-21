import "reflect-metadata";
import { DatabaseController } from "./controllers/database.controller.js";
import { container } from "tsyringe";
import { TableController } from "./controllers/table.controller.js";
import { RowController } from "./controllers/row.controller.js";
import { initEnv } from "./config/env.config.js";
import { Hono } from "hono";
import { cors } from "hono/cors";
import frontend from "../../frontend/dist/index.html";

console.log("Starting PGView...");

initEnv();

const app = new Hono();

if (process.env.NODE_ENV === "development") {
  app.get(
    "/*",
    cors({
      origin: "http://localhost:5173",
    }),
  );
}

app.get("/api/databases", async (c) => {
  return container.resolve(DatabaseController).getAll(c);
});

app.get("/api/databases/:dbName/tables", async (c) => {
  return container.resolve(TableController).getAll(c);
});

app.get("/api/databases/:dbName/tables/:tableName", async (c) => {
  return container.resolve(TableController).get(c);
});

app.get("/api/databases/:dbName/tables/:tableName/rows", async (c) => {
  return container.resolve(RowController).getAll(c);
});

app.post("/api/databases/:dbName/tables/:tableName/rows", async (c) => {
  return container.resolve(RowController).create(c);
});

app.put("/api/databases/:dbName/tables/:tableName/rows", async (c) => {
  return container.resolve(RowController).editMany(c);
});

app.delete("/api/databases/:dbName/tables/:tableName/rows", async (c) => {
  return container.resolve(RowController).deleteMany(c);
});

Bun.serve({
  port: 8080,
  routes: {
    "/*": frontend,
    "/api/*": app.fetch,
  },
});

console.log("PGView started on http://localhost:8080");
