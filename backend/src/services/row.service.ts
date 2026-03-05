import { Pool } from "pg";
import { singleton } from "tsyringe";
import { RowResponse } from "../types/row.response.js";
import { Pagination } from "../types/pagination.type.js";

@singleton()
export class RowService {
  async getMany(
    databaseName: string,
    tableName: string,
    limit: number,
    page: number,
  ): Promise<Pagination<RowResponse>> {
    const pool = new Pool({
      host: process.env.PGVIEW_DB_HOST || "localhost",
      port: parseInt(process.env.PGVIEW_DB_PORT || "5432"),
      user: process.env.PGVIEW_DB_USER,
      password: process.env.PGVIEW_DB_PASSWORD,
      database: databaseName,
    });

    const offset = (page - 1) * limit;

    const [rowsRes, countRes] = await Promise.all([
      pool.query(`SELECT * FROM ${tableName} LIMIT ${limit} OFFSET ${offset};`),
      pool.query(`SELECT COUNT(*) FROM ${tableName};`),
    ]);

    return {
      items: rowsRes.rows,
      page,
      totalItems: parseInt(countRes.rows[0].count),
      totalPages: Math.ceil(parseInt(countRes.rows[0].count) / limit),
    };
  }
}
