import { Pool } from "pg";
import { inject, singleton } from "tsyringe";
import { ColumnService } from "./column.service.js";
import { Pagination, RowResponse } from "@pgview/shared-types";
import { ClientService } from "./client.service.js";

@singleton()
export class RowService {
  constructor(
    @inject(ClientService) private clientService: ClientService,
    @inject(ColumnService) private columnService: ColumnService,
  ) {}

  async getMany(
    dbName: string,
    tableName: string,
    limit: number,
    page: number,
    query: string,
  ): Promise<Pagination<RowResponse>> {
    const client = this.clientService.get(dbName);

    const columns = await this.columnService.getAll(dbName, tableName);
    const whereClause = columns
      .map((c) => `${c.name}::text ILIKE $1`)
      .join(" OR ");

    const offset = (page - 1) * limit;

    const [rowsRes, countRes] = await Promise.all([
      client.query(
        `SELECT * FROM ${tableName} WHERE ${whereClause} ORDER BY id LIMIT ${limit} OFFSET ${offset};`,
        [`%${query}%`],
      ),
      client.query(`SELECT COUNT(*) FROM ${tableName} WHERE ${whereClause};`, [
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
    const client = this.clientService.get(dbName);

    const [rowsRes] = await Promise.all([
      client.query(
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
    const client = this.clientService.get(dbName);

    const [rowsRes] = await Promise.all([
      client.query(
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

  async delete(
    dbName: string,
    tableName: string,
    rowId: string,
  ): Promise<RowResponse> {
    const client = this.clientService.get(dbName);

    const [rowsRes] = await Promise.all([
      client.query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING *;`, [
        rowId,
      ]),
    ]);

    return rowsRes.rows[0];
  }
}
