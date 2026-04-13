import { inject, singleton } from "tsyringe";
import { Pagination, RowResponse } from "@pgview/shared-types";
import { ClientService } from "./client.service.js";
import { TableService } from "./table.service.js";

@singleton()
export class RowService {
  constructor(
    @inject(ClientService) private clientService: ClientService,
    @inject(TableService) private tableService: TableService,
  ) {}

  async getMany(
    dbName: string,
    tableName: string,
    limit: number,
    page: number,
    query: string,
  ): Promise<Pagination<RowResponse>> {
    const client = this.clientService.get(dbName);

    const table = await this.tableService.get(dbName, tableName);
    const whereClause = table.columns
      .map((c) => `${c.name}::text ILIKE $1`)
      .join(" OR ");

    const offset = (page - 1) * limit;

    const [rowsRes, countRes] = await Promise.all([
      client.query(
        `SELECT * FROM ${tableName} WHERE ${whereClause} LIMIT ${limit} OFFSET ${offset};`,
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

  async get(
    dbName: string,
    tableName: string,
    rowId: string,
  ): Promise<RowResponse> {
    const client = this.clientService.get(dbName);

    const [rowsRes] = await Promise.all([
      client.query(`SELECT * FROM ${tableName} WHERE id = $1;`, [rowId]),
    ]);

    return rowsRes.rows[0];
  }

  async editMany(
    dbName: string,
    tableName: string,
    filters: Record<string, string>,
    updateData: Record<string, string>,
  ): Promise<RowResponse[]> {
    const client = this.clientService.get(dbName);

    const setClause = Object.keys(updateData)
      .map((k, i) => `"${k}" = $${i + 1}`)
      .join(", ");

    const whereClause = Object.keys(filters)
      .map((k, i) => `"${k}" = $${i + Object.keys(updateData).length + 1}`)
      .join(" AND ");

    const result = await client.query(
      `UPDATE "${tableName}" SET ${setClause} WHERE ${whereClause} RETURNING *;`,
      [...Object.values(updateData), ...Object.values(filters)],
    );

    return result.rows;
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

  async deleteMany(
    dbName: string,
    tableName: string,
    filters: Record<string, string>,
  ): Promise<RowResponse[]> {
    const client = this.clientService.get(dbName);

    const whereClause = Object.keys(filters)
      .map((k, i) => `"${k}" = $${i + 1}`)
      .join(" AND ");

    const rowsRes = await client.query(
      `DELETE FROM ${tableName} WHERE ${whereClause} RETURNING *;`,
      Object.values(filters),
    );

    return rowsRes.rows;
  }
}
