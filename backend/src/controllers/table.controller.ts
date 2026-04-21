import { FastifyReply, FastifyRequest } from "fastify";
import { TableService } from "../services/table.service.js";
import { inject, singleton } from "tsyringe";
import { Context } from "hono";

@singleton()
export class TableController {
  constructor(@inject(TableService) private tableService: TableService) {}

  async getAll(c: Context): Promise<Response> {
    const { dbName } = c.req.param() as { dbName: string };

    const tables = await this.tableService.getAll(dbName);

    return c.json(tables);
  }

  async get(c: Context): Promise<Response> {
    const { dbName, tableName } = c.req.param() as {
      dbName: string;
      tableName: string;
    };

    const table = await this.tableService.get(dbName, tableName);

    return c.json(table);
  }
}
