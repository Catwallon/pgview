import { Pool } from "pg";
import type { DatabaseResponse } from "@pgview/shared-types";
import { inject, singleton } from "tsyringe";
import { ClientService } from "./client.service.js";

@singleton()
export class DatabaseService {
  constructor(@inject(ClientService) private clientService: ClientService) {}

  async getAll(): Promise<DatabaseResponse[]> {
    const client = this.clientService.get("postgres");

    const res = await client.query(
      "SELECT datname FROM pg_database WHERE datistemplate = false;",
    );

    return res.rows.map((row) => ({ name: row.datname }));
  }
}
