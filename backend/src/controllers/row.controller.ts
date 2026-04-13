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

  async get(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { dbName, tableName, rowId } = request.params as {
      dbName: string;
      tableName: string;
      rowId: string;
    };

    const row = await this.rowService.get(dbName, tableName, rowId);

    reply.send(row);
  }

  async editMany(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const { dbName, tableName } = request.params as {
      dbName: string;
      tableName: string;
    };

    const filters = request.query as Record<string, string>;

    const updateData = request.body as Record<string, string>;

    const row = await this.rowService.editMany(
      dbName,
      tableName,
      filters,
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

  async deleteMany(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    const { dbName, tableName } = request.params as {
      dbName: string;
      tableName: string;
    };

    const filters = request.query as Record<string, string>;

    const row = await this.rowService.deleteMany(dbName, tableName, filters);

    reply.send(row);
  }
}
