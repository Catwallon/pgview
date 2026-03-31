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

    const { limit, page, query } = request.query as {
      limit: number;
      page: number;
      query: string;
    };

    const rows = await this.rowService.getMany(
      dbName,
      tableName,
      limit,
      page,
      query,
    );

    reply.send(rows);
  }

  async edit(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { dbName, tableName, rowId } = request.params as {
      dbName: string;
      tableName: string;
      rowId: string;
    };

    const updateData = request.body as Record<string, string>;

    const row = await this.rowService.edit(
      dbName,
      tableName,
      rowId,
      updateData,
    );

    reply.send(row);
  }

  async create(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { dbName, tableName } = request.params as {
      dbName: string;
      tableName: string;
    };

    const createData = request.body as Record<string, string>;

    const row = await this.rowService.create(dbName, tableName, createData);

    reply.send(row);
  }

  async delete(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { dbName, tableName, rowId } = request.params as {
      dbName: string;
      tableName: string;
      rowId: string;
    };

    const row = await this.rowService.delete(dbName, tableName, rowId);

    reply.send(row);
  }
}
