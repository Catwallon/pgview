import { FastifyReply, FastifyRequest } from "fastify";
import { ColumnService } from "../services/column.service.js";
import { inject, singleton } from "tsyringe";

@singleton()
export class ColumnController {
  constructor(@inject(ColumnService) private columnService: ColumnService) {}

  async getAll(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { databaseName, tableName } = request.params as {
      databaseName: string;
      tableName: string;
    };

    const columns = await this.columnService.getAll(databaseName, tableName);

    reply.send(columns);
  }
}
