import { TableSummaryResponse, TableFullResponse } from "@pgview/shared-types";
import { inject, singleton } from "tsyringe";
import { ClientService } from "./client.service.js";

@singleton()
export class TableService {
  constructor(@inject(ClientService) private clientService: ClientService) {}

  async getAll(dbName: string): Promise<TableSummaryResponse[]> {
    const client = this.clientService.get(dbName);

    const res = await client.query(
      `SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE';`,
    );

    return res.rows.map((row) => ({ name: row.table_name }));
  }

  async get(dbName: string, tableName: string): Promise<TableFullResponse> {
    const client = this.clientService.get(dbName);

    const res = await client.query(
      `SELECT 
    a.attname                       AS column_name,
    t.typname                       AS data_type,
    NOT a.attnotnull                AS nullable,
    a.atttypmod                     AS type_mod,
    pg_get_expr(d.adbin, d.adrelid) AS column_default,
    EXISTS (
      SELECT 1 FROM pg_index i
      WHERE i.indrelid = a.attrelid
        AND i.indisprimary
        AND a.attnum = ANY(i.indkey)
    )                               AS is_primary_key
  FROM pg_catalog.pg_attribute a
  JOIN pg_catalog.pg_type t  ON t.oid = a.atttypid
  JOIN pg_catalog.pg_class c ON c.oid = a.attrelid
  LEFT JOIN pg_catalog.pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
  WHERE c.relname = $1
    AND a.attnum > 0
    AND NOT a.attisdropped
  ORDER BY a.attnum;`,
      [tableName],
    );

    return {
      name: tableName,
      columns: res.rows.map((row) => ({
        name: row.column_name,
        type: this.getType(row.data_type, row.column_default),
        length: this.getLength(row.data_type, row.type_mod),
        precision: this.getPrecision(row.data_type, row.type_mod),
        scale: this.getScale(row.data_type, row.type_mod),
        isNullable: row.nullable,
        isPrimaryKey: row.is_primary_key,
        isArray: row.data_type.startsWith("_"),
      })),
    };
  }

  private getType(dataType: string, columnDefault: string | null): string {
    dataType = dataType.replace(/^_/, "");
    if (columnDefault?.startsWith("nextval(")) {
      switch (dataType) {
        case "int2":
          return "serial2";
        case "int4":
          return "serial4";
        case "int8":
          return "serial8";
      }
    }
    return dataType;
  }

  private getLength(dataType: string, typmod: number): number | undefined {
    if (typmod < 0) return undefined;
    dataType = dataType.replace(/^_/, "");
    switch (dataType) {
      case "bpchar":
      case "varchar":
      case "numeric":
        return typmod - 4;
      case "bit":
      case "varbit":
        return typmod;
      default:
        return undefined;
    }
  }

  private getPrecision(dataType: string, typmod: number): number | undefined {
    if (dataType === "numeric" && typmod > 0) {
      return ((typmod - 4) >> 16) & 0xffff;
    }
    return undefined;
  }

  private getScale(dataType: string, typmod: number): number | undefined {
    if (dataType === "numeric" && typmod > 0) {
      return (typmod - 4) & 0xffff;
    }
    return undefined;
  }
}
