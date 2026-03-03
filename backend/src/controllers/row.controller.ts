import { FastifyReply, FastifyRequest } from "fastify";
import { inject, singleton } from "tsyringe";
import { RowService } from "../services/row.service.js";

@singleton()
export class RowController {
  constructor(@inject(RowService) private rowService: RowService) {}

  async getAll(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { databaseName, tableName } = request.params as {
      databaseName: string;
      tableName: string;
    };

    const columns = await this.rowService.getMany(databaseName, tableName);

    reply.send(columns);
  }
}
