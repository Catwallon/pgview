import { FastifyReply, FastifyRequest } from "fastify";
import { inject, singleton } from "tsyringe";
import { RowService } from "../services/row.service.js";

@singleton()
export class RowController {
  constructor(@inject(RowService) private rowService: RowService) {}

  async getAll(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { dbName, tableName } = request.params as {
      dbName: string;
      tableName: string;
    };

    const { limit, page } = request.query as {
      limit: number;
      page: number;
    };

    const columns = await this.rowService.getMany(
      dbName,
      tableName,
      limit,
      page,
    );

    reply.send(columns);
  }
}
