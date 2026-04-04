import type { ColumnResponse } from "@pgview/shared-types";

export function defaultFromColumns(columns: ColumnResponse[]): string {
  const defaultJson: Record<string, unknown> = {};

  for (const col of columns) {
    defaultJson[col.name] = defaultFromColumn(col);
  }

  return JSON.stringify(defaultJson, null, 2);
}

function defaultFromColumn(col: ColumnResponse): unknown {
  if (col.nullable) {
    return null;
  }

  return getDefault(col);
}

function getDefault(col: ColumnResponse): unknown {
  const { type, length = 1 } = col;

  switch (type) {
    case "int8":
      return "0";
    case "serial8":
      return "0";
    case "bit":
      return "0".repeat(length);
    case "varbit":
      return "0";
    case "bool":
      return false;
    case "box":
      return "(0,0),(0,0)";
    case "bytea":
      return "\\x";
    case "bpchar":
      return " ".repeat(length);
    case "varchar":
      return "";
    case "cidr":
      return "0.0.0.0/0";
    case "circle":
      return "<(0,0),0>";
    case "date":
      return new Date().toISOString().split("T")[0];
    case "float8":
      return 0;
    case "inet":
      return "0.0.0.0/0";
    case "int4":
      return 0;
    case "interval":
      return "00:00:00";
    case "json":
      return {};
    case "jsonb":
      return {};
    case "line":
      return "{0,1,0}";
    case "lseg":
      return "[(-1,-1),(1,1)]";
    case "macaddr":
      return "00:00:00:00:00:00";
    case "macaddr8":
      return "00:00:00:00:00:00:00:00";
    case "money":
      return "$0";
    case "numeric":
      return "0";
    case "path":
      return "[(-1,-1),(1,1)]";
    case "pg_lsn":
      return "0/0";
    case "pg_snapshot":
      return "1:1:";
    case "point":
      return "(0,0)";
    case "polygon":
      return "((0,0),(0,0))";
    case "float4":
      return 0;
    case "int2":
      return 0;
    case "serial2":
      return 0;
    case "serial4":
      return 0;
    case "text":
      return "";
    case "time":
      return new Date().toTimeString().split(" ")[0];
    case "timetz":
      return new Date()
        .toTimeString()
        .replace(/(\d{2}:\d{2}:\d{2}).*([+-]\d{2})(\d{2}).*/, "$1$2:$3");
    case "timestamp":
      return new Date().toISOString().replace("T", " ").split(".")[0];
    case "timestamptz":
      return (
        new Date()
          .toISOString()
          .replace("T", " ")
          .replace("Z", "+00:00")
          .split(".")[0] + "+00:00"
      );
    case "tsquery":
      return "'word'";
    case "tsvector":
      return "'word':1";
    case "txid_snapshot":
      return "1:1:";
    case "uuid":
      return crypto.randomUUID();
    case "xml":
      return "<root></root>";
    default:
      return "";
  }
}
