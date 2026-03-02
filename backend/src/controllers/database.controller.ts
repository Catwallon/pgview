import { FastifyReply, FastifyRequest } from "fastify";
import { DatabaseService } from "../services/database.service.js";
import { inject, singleton } from "tsyringe";

@singleton()
export class DatabaseController {
  constructor(
    @inject(DatabaseService) private databaseService: DatabaseService,
  ) {}

  async getAll(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const dbs = await this.databaseService.getAll();
    reply.send(dbs);
  }
}
