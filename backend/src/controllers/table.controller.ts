import { FastifyReply, FastifyRequest } from "fastify";
import { TableService } from "../services/table.service.js";
import { inject, singleton } from "tsyringe";

@singleton()
export class TableController {
  constructor(@inject(TableService) private tableService: TableService) {}

  async getAll(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { databaseName } = request.params as { databaseName: string };

    const tables = await this.tableService.getAll(databaseName);

    reply.send(tables);
  }
}
