import { Pool } from "pg";
import { singleton } from "tsyringe";
import type { ColumnResponse } from "@pgview/shared-types";
import { get } from "http";

@singleton()
export class ColumnService {
  async getAll(dbName: string, tableName: string): Promise<ColumnResponse[]> {
    const pool = new Pool({
      host: process.env.PGVIEW_DB_HOST || "localhost",
      port: parseInt(process.env.PGVIEW_DB_PORT || "5432"),
      user: process.env.PGVIEW_DB_USER,
      password: process.env.PGVIEW_DB_PASSWORD,
      database: dbName,
    });

    const res = await pool.query(
      `SELECT 
    a.attname                       AS column_name,
    t.typname                       AS data_type,
    NOT a.attnotnull                AS nullable,
    a.atttypmod                     AS type_mod,
    pg_get_expr(d.adbin, d.adrelid) AS column_default
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

    return res.rows.map((row) => ({
      name: row.column_name,
      type: this.getType(row.data_type, row.column_default),
      length: this.getLength(row.data_type, row.type_mod),
      precision: this.getPrecision(row.data_type, row.type_mod),
      scale: this.getScale(row.data_type, row.type_mod),
      nullable: row.nullable,
    }));
  }

  private getType(dataType: string, columnDefault: string | null): string {
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
