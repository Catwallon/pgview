import { FastifyReply, FastifyRequest } from "fastify";
import { TableService } from "../services/table.service.js";
import { inject, singleton } from "tsyringe";

@singleton()
export class TableController {
  constructor(@inject(TableService) private tableService: TableService) {}

  async getAll(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { dbName } = request.params as { dbName: string };

    const tables = await this.tableService.getAll(dbName);

    reply.send(tables);
  }

  async get(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { dbName, tableName } = request.params as {
      dbName: string;
      tableName: string;
    };

    const table = await this.tableService.get(dbName, tableName);

    reply.send(table);
  }
}
