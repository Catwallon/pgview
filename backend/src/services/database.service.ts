import { Pool } from "pg";
import type { DatabaseResponse } from "../types/database.response.js";
import { singleton } from "tsyringe";

@singleton()
export class DatabaseService {
  async getAll(): Promise<DatabaseResponse[]> {
    const pool = new Pool({
      host: process.env.PGVIEW_DB_HOST || "localhost",
      port: parseInt(process.env.PGVIEW_DB_PORT || "5432"),
      user: process.env.PGVIEW_DB_USER,
      password: process.env.PGVIEW_DB_PASSWORD,
      database: process.env.PGVIEW_DB_NAME,
    });

    const res = await pool.query(
      "SELECT datname FROM pg_database WHERE datistemplate = false;",
    );

    return res.rows.map((row) => ({ name: row.datname }));
  }
}
