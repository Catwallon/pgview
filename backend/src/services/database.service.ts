import { Pool } from "pg";
import type { DatabaseResponse } from "../types/database.response.js";
import { singleton } from "tsyringe";

@singleton()
export class DatabaseService {
  private pool = new Pool({
    user: "guest",
    host: "localhost",
    database: "postgres",
    password: "guest",
    port: 5432,
  });

  async getAll(): Promise<DatabaseResponse[]> {
    const res = await this.pool.query(
      "SELECT datname FROM pg_database WHERE datistemplate = false;",
    );

    return res.rows.map((row) => ({ name: row.datname }));
  }
}
