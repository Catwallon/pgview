import { Pool } from "pg";
import { singleton } from "tsyringe";
import { TableResponse } from "../types/table.response.js";

@singleton()
export class TableService {
  async getAll(dbName: string): Promise<TableResponse[]> {
    const pool = new Pool({
      host: process.env.PGVIEW_DB_HOST || "localhost",
      port: parseInt(process.env.PGVIEW_DB_PORT || "5432"),
      user: process.env.PGVIEW_DB_USER,
      password: process.env.PGVIEW_DB_PASSWORD,
      database: dbName,
    });

    const res = await pool.query(
      `SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE';`,
    );

    return res.rows.map((row) => ({ name: row.table_name }));
  }
}
