import { FastifyReply, FastifyRequest } from "fastify";
import { inject, singleton } from "tsyringe";
import { RowService } from "../services/row.service.js";
import { Context } from "hono";

@singleton()
export class RowController {
  constructor(@inject(RowService) private rowService: RowService) {}

  async getAll(c: Context): Promise<Response> {
    const { dbName, tableName } = c.req.param() as {
      dbName: string;
      tableName: string;
    };

    const { limit, page, query, sort } = c.req.query();

    let parsedSort = undefined;
    if (sort) {
      const [column, direction] = sort.split(":");

      if (column && direction) {
        parsedSort = { column, direction: direction as "asc" | "desc" };
      }
    }

    const rows = await this.rowService.getMany(
      dbName,
      tableName,
      limit ? parseInt(limit) : 10,
      page ? parseInt(page) : 1,
      query,
      parsedSort,
    );

    return c.json(rows);
  }

  async get(c: Context): Promise<Response> {
    const { dbName, tableName, rowId } = c.req.param() as {
      dbName: string;
      tableName: string;
      rowId: string;
    };

    const row = await this.rowService.get(dbName, tableName, rowId);

    return c.json(row);
  }

  async editMany(c: Context): Promise<Response> {
    const { dbName, tableName } = c.req.param() as {
      dbName: string;
      tableName: string;
    };

    const filters = c.req.query() as Record<string, string>;

    const updateData = await c.req.json();

    const row = await this.rowService.editMany(
      dbName,
      tableName,
      filters,
      updateData,
    );

    return c.json(row);
  }

  async create(c: Context): Promise<Response> {
    const { dbName, tableName } = c.req.param() as {
      dbName: string;
      tableName: string;
    };

    const createData = await c.req.json();

    const row = await this.rowService.create(dbName, tableName, createData);

    return c.json(row);
  }

  async deleteMany(c: Context): Promise<Response> {
    const { dbName, tableName } = c.req.param() as {
      dbName: string;
      tableName: string;
    };

    const filters = c.req.query() as Record<string, string>;

    const row = await this.rowService.deleteMany(dbName, tableName, filters);

    return c.json(row);
  }
}
