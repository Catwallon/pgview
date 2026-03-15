import { Pool } from "pg";
import { singleton } from "tsyringe";
import { ColumnResponse } from "../types/column.response.js";

@singleton()
export class ColumnService {
  async getAll(dbName: string, tableName: string): Promise<ColumnResponse[]> {
    const pool = new Pool({
      host: process.env.PGVIEW_DB_HOST || "localhost",
      port: parseInt(process.env.PGVIEW_DB_PORT || "5432"),
      user: process.env.PGVIEW_DB_USER,
      password: process.env.PGVIEW_DB_PASSWORD,
      database: dbName,
    });

    const res = await pool.query(
      `SELECT 
    a.attname                        AS column_name,
    t.typname                        AS data_type,
    NOT a.attnotnull                 AS nullable
  FROM pg_catalog.pg_attribute a
  JOIN pg_catalog.pg_type t  ON t.oid = a.atttypid
  JOIN pg_catalog.pg_class c ON c.oid = a.attrelid
  WHERE c.relname = $1
    AND a.attnum > 0
    AND NOT a.attisdropped
  ORDER BY a.attnum;`,
      [tableName],
    );

    return res.rows.map((row) => ({
      name: row.column_name,
      type: row.data_type,
      nullable: row.nullable,
    }));
  }
}
