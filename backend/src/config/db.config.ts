import { container } from "tsyringe";
import { DB_CONFIG } from "./tokens.config.js";
import { DBConfig } from "../types/dbConfig.js";
import { parseArgs } from "util";

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
    name: parsed.pathname.slice(1),
    user: parsed.username,
    password: parsed.password,
  };
}

export const resolveDBConfig = () => {
  const { values } = parseArgs({
    options: {
      host: { type: "string" },
      port: { type: "string" },
      name: { type: "string" },
      user: { type: "string" },
      password: { type: "string" },
      url: { type: "string" },
    },
  });

  let config: DBConfig;

  if (values.url) {
    config = parseDatabaseUrl(values.url);
  } else {
    config = {
      host: values.host || process.env.PGVIEW_DB_HOST || "localhost",
      port: parseInt(values.port || process.env.PGVIEW_DB_PORT || "5432"),
      name: values.name || process.env.PGVIEW_DB_NAME!,
      user: values.user || process.env.PGVIEW_DB_USER!,
      password: values.password || process.env.PGVIEW_DB_PASSWORD!,
    };

    const missing = Object.entries(config)
      .filter(([_, value]) => !value)
      .map(([key]) => `DB_${key.toUpperCase()}`);

    if (missing.length > 0) {
      console.error(`Missing required parameters: ${missing.join(", ")}`);
      process.exit(1);
    }

    if (!values.host && !process.env.PGVIEW_DB_HOST) {
      console.warn("DB host is not set, defaulting to localhost");
    }

    if (!values.port && !process.env.PGVIEW_DB_PORT) {
      console.warn("DB port is not set, defaulting to 5432");
    }
  }

  container.register<DBConfig>(DB_CONFIG, {
    useValue: config,
  });
};
