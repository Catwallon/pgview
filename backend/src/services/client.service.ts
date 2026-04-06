import { Pool } from "pg";
import { inject, singleton } from "tsyringe";
import { DB_CONFIG } from "../config/tokens.config.js";
import type { DBConfig } from "../types/dbConfig.js";

@singleton()
export class ClientService {
  private clients: { [databaseName: string]: Pool } = {};

  constructor(@inject(DB_CONFIG) private readonly dbConfig: DBConfig) {}

  get(dbName: string): Pool {
    if (!this.clients[dbName]) {
      const client = new Pool({
        host: this.dbConfig.host,
        port: this.dbConfig.port,
        user: this.dbConfig.user,
        password: this.dbConfig.password,
        database: dbName,
      });

      client.on("error", (err) => {
        console.error(`Error on ${dbName} client:`, err);
        delete this.clients[dbName];
      });

      this.clients[dbName] = client;
    }

    return this.clients[dbName];
  }
}
