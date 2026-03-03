import { Pool } from "pg";
import { singleton } from "tsyringe";
import { RowResponse } from "../types/row.response.js";

@singleton()
export class RowService {
  async getMany(
    databaseName: string,
    tableName: string,
  ): Promise<RowResponse[]> {
    const pool = new Pool({
      host: process.env.PGVIEW_DB_HOST || "localhost",
      port: parseInt(process.env.PGVIEW_DB_PORT || "5432"),
      user: process.env.PGVIEW_DB_USER,
      password: process.env.PGVIEW_DB_PASSWORD,
      database: databaseName,
    });

    const res = await pool.query(`SELECT * FROM ${tableName};`);

    return res.rows;
  }
}
