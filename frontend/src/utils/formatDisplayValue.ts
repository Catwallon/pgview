import type { TableFullResponse } from "@pgview/shared-types";

const MAX_LENGTH = 36;

export function formatDisplayValue(
  col: TableFullResponse["columns"][number] | undefined,
  value: unknown,
): string {
  switch (col?.type) {
    case "int8":
    case "serial8":
    case "bit":
    case "varbit":
    case "bool":
    case "box":
    case "bytea":
    case "cidr":
    case "circle":
    case "date":
    case "float8":
    case "inet":
    case "int4":
    case "interval":
    case "line":
    case "lseg":
    case "macaddr":
    case "macaddr8":
    case "money":
    case "numeric":
    case "path":
    case "pg_lsn":
    case "pg_snapshot":
    case "point":
    case "polygon":
    case "float4":
    case "int2":
    case "serial2":
    case "serial4":
    case "time":
    case "timetz":
    case "timestamp":
    case "timestamptz":
    case "tsquery":
    case "tsvector":
    case "txid_snapshot":
    case "uuid":
    case "xml":
    case "bpchar":
    case "varchar":
    case "text": {
      const str = String(value);
      return str.length > MAX_LENGTH ? str.slice(0, MAX_LENGTH) + "..." : str;
    }
    case "json":
    case "jsonb": {
      const str = JSON.stringify(value).replace(/\n/g, " ");
      return str.length > MAX_LENGTH ? str.slice(0, MAX_LENGTH) + "..." : str;
    }
    default:
      return String(value);
  }
}
