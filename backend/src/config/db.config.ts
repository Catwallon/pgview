import { container } from "tsyringe";
import { DB_CONFIG } from "./tokens.config.js";
import { DBConfig } from "../types/dbConfig.js";
import { Args } from "../types/args.type.js";

function parseDatabaseUrl(url: string): DBConfig {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch (error) {
    console.error("Invalid database URL");
    process.exit(1);
  }

  return {
    host: parsed.hostname,
    port: parseInt(parsed.port),
    dbName: parsed.pathname.slice(1),
    user: parsed.username,
    password: parsed.password,
  };
}

export const resolveDBConfig = (args: Args) => {
  const urlConfig = args.url
    ? parseDatabaseUrl(args.url)
    : process.env.PGVIEW_URL
      ? parseDatabaseUrl(process.env.PGVIEW_URL)
      : null;

  if (urlConfig) {
    container.register<DBConfig>(DB_CONFIG, { useValue: urlConfig });
    return;
  }

  const config = {
    host: args.host ?? process.env.PGVIEW_HOST ?? "localhost",
    port: parseInt(args.port ?? process.env.PGVIEW_PORT ?? "5432"),
    dbName: args.dbname ?? process.env.PGVIEW_DBNAME!,
    user: args.user ?? process.env.PGVIEW_USER!,
    password: args.password ?? process.env.PGVIEW_PASSWORD!,
  };

  const missing = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error(`Missing required parameters: ${missing.join(", ")}`);
    process.exit(1);
  }

  if (!args.host && !process.env.PGVIEW_HOST) {
    console.warn("Host is not set, defaulting to localhost");
  }

  if (!args.port && !process.env.PGVIEW_PORT) {
    console.warn("Port is not set, defaulting to 5432");
  }

  container.register<DBConfig>(DB_CONFIG, {
    useValue: config,
  });
};
