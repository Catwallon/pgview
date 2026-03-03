import { Pool } from "pg";
import { singleton } from "tsyringe";
import { RowResponse } from "../types/row.response.js";
import { ColumnResponse } from "../types/column.response.js";

@singleton()
export class ColumnService {
  async getAll(
    databaseName: string,
    tableName: string,
  ): Promise<ColumnResponse[]> {
    const pool = new Pool({
      host: process.env.PGVIEW_DB_HOST || "localhost",
      port: parseInt(process.env.PGVIEW_DB_PORT || "5432"),
      user: process.env.PGVIEW_DB_USER,
      password: process.env.PGVIEW_DB_PASSWORD,
      database: databaseName,
    });

    const res = await pool.query(
      `SELECT column_name
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position;`,
      [tableName],
    );

    return res.rows.map((row) => ({ name: row.column_name }));
  }
}
