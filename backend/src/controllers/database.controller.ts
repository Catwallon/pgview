import { Context } from "hono";
import { DatabaseService } from "../services/database.service.js";
import { inject, singleton } from "tsyringe";

@singleton()
export class DatabaseController {
  constructor(
    @inject(DatabaseService) private databaseService: DatabaseService,
  ) {}

  async getAll(c: Context): Promise<Response> {
    const dbs = await this.databaseService.getAll();

    return c.json(dbs);
  }
}
