import { Pool } from "pg";
import { singleton } from "tsyringe";

@singleton()
export class ClientService {
  private clients: { [databaseName: string]: Pool } = {};

  get(dbName: string): Pool {
    if (!this.clients[dbName]) {
      const client = new Pool({
        host: process.env.PGVIEW_DB_HOST || "localhost",
        port: parseInt(process.env.PGVIEW_DB_PORT || "5432"),
        user: process.env.PGVIEW_DB_USER,
        password: process.env.PGVIEW_DB_PASSWORD,
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
