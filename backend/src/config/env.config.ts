import { container } from "tsyringe";
import { DB_CONFIG } from "./tokens.config.js";
import { DBConfig } from "../types/dbConfig.js";

export const initEnv = () => {
  const missing = [
    "PGVIEW_DB_NAME",
    "PGVIEW_DB_USER",
    "PGVIEW_DB_PASSWORD",
  ].filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`Missing required env variables: ${missing.join(", ")}`);
    process.exit(1);
  }

  if (!process.env.PGVIEW_DB_HOST) {
    console.warn("PGVIEW_DB_HOST is not set, defaulting to localhost");
  }
  if (!process.env.PGVIEW_DB_PORT) {
    console.warn("PGVIEW_DB_PORT is not set, defaulting to 5432");
  }

  container.register<DBConfig>(DB_CONFIG, {
    useValue: {
      host: process.env.PGVIEW_DB_HOST || "localhost",
      port: parseInt(process.env.PGVIEW_DB_PORT || "5432"),
      name: process.env.PGVIEW_DB_NAME!,
      user: process.env.PGVIEW_DB_USER!,
      password: process.env.PGVIEW_DB_PASSWORD!,
    },
  });
};
