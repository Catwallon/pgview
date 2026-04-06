import { TableResponse } from "@pgview/shared-types";
import { Pool } from "pg";
import { inject, singleton } from "tsyringe";
import { ClientService } from "./client.service.js";

@singleton()
export class TableService {
  constructor(@inject(ClientService) private clientService: ClientService) {}

  async getAll(dbName: string): Promise<TableResponse[]> {
    const client = this.clientService.get(dbName);

    const res = await client.query(
      `SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE';`,
    );

    return res.rows.map((row) => ({ name: row.table_name }));
  }
}
