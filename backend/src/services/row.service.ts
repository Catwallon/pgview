import { Pool } from "pg";
import { inject, singleton } from "tsyringe";
import { RowResponse } from "../types/row.response.js";
import { Pagination } from "../types/pagination.type.js";
import { ColumnService } from "./column.service.js";

@singleton()
export class RowService {
  constructor(@inject(ColumnService) private columnService: ColumnService) {}

  async getMany(
    dbName: string,
    tableName: string,
    limit: number,
    page: number,
    query: string,
  ): Promise<Pagination<RowResponse>> {
    const pool = new Pool({
      host: process.env.PGVIEW_DB_HOST || "localhost",
      port: parseInt(process.env.PGVIEW_DB_PORT || "5432"),
      user: process.env.PGVIEW_DB_USER,
      password: process.env.PGVIEW_DB_PASSWORD,
      database: dbName,
    });

    const columns = await this.columnService.getAll(dbName, tableName);
    const whereClause = columns
      .map((c) => `${c.name}::text ILIKE $1`)
      .join(" OR ");

    const offset = (page - 1) * limit;

    const [rowsRes, countRes] = await Promise.all([
      pool.query(
        `SELECT * FROM ${tableName} WHERE ${whereClause} ORDER BY id LIMIT ${limit} OFFSET ${offset};`,
        [`%${query}%`],
      ),
      pool.query(`SELECT COUNT(*) FROM ${tableName} WHERE ${whereClause};`, [
        `%${query}%`,
      ]),
    ]);

    return {
      items: rowsRes.rows,
      page,
      totalItems: parseInt(countRes.rows[0].count),
      totalPages: Math.ceil(parseInt(countRes.rows[0].count) / limit),
    };
  }

  async edit(
    dbName: string,
    tableName: string,
    rowId: string,
    updateData: Record<string, string>,
  ): Promise<RowResponse> {
    const pool = new Pool({
      host: process.env.PGVIEW_DB_HOST || "localhost",
      port: parseInt(process.env.PGVIEW_DB_PORT || "5432"),
      user: process.env.PGVIEW_DB_USER,
      password: process.env.PGVIEW_DB_PASSWORD,
      database: dbName,
    });

    const [rowsRes] = await Promise.all([
      pool.query(
        `UPDATE ${tableName} SET ${Object.keys(updateData)
          .map((k, i) => `${k} = $${i + 1}`)
          .join(
            ", ",
          )} WHERE id = $${Object.keys(updateData).length + 1} RETURNING *;`,
        [...Object.values(updateData), rowId],
      ),
    ]);

    return rowsRes.rows[0];
  }

  async create(
    dbName: string,
    tableName: string,
    createData: Record<string, string>,
  ): Promise<RowResponse> {
    const pool = new Pool({
      host: process.env.PGVIEW_DB_HOST || "localhost",
      port: parseInt(process.env.PGVIEW_DB_PORT || "5432"),
      user: process.env.PGVIEW_DB_USER,
      password: process.env.PGVIEW_DB_PASSWORD,
      database: dbName,
    });

    const [rowsRes] = await Promise.all([
      pool.query(
        `INSERT INTO ${tableName} (${Object.keys(createData).join(", ")}) VALUES (${Object.keys(
          createData,
        )
          .map((_, i) => `$${i + 1}`)
          .join(", ")}) RETURNING *;`,
        Object.values(createData),
      ),
    ]);

    return rowsRes.rows[0];
  }
}
