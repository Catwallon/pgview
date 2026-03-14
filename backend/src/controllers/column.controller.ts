import { FastifyReply, FastifyRequest } from "fastify";
import { ColumnService } from "../services/column.service.js";
import { inject, singleton } from "tsyringe";

@singleton()
export class ColumnController {
  constructor(@inject(ColumnService) private columnService: ColumnService) {}

  async getAll(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { dbName, tableName } = request.params as {
      dbName: string;
      tableName: string;
    };

    const columns = await this.columnService.getAll(dbName, tableName);

    reply.send(columns);
  }
}
