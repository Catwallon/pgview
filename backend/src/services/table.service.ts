import { Pool } from "pg";
import { singleton } from "tsyringe";
import { TableResponse } from "../types/table.response.js";

@singleton()
export class TableService {
  async getAll(databaseName: string): Promise<TableResponse[]> {
    const pool = new Pool({
      user: "guest",
      host: "localhost",
      database: databaseName,
      password: "guest",
      port: 5432,
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
