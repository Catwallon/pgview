export function generateDefaultValueJsonFromColumns(
  columns: {
    name: string;
    type: string;
    nullable: boolean;
  }[],
): string {
  const result: Record<string, unknown> = {};

  for (const { name, type } of columns) {
    result[name] = getDefaultValueForPostgresType(type);
  }

  return JSON.stringify(result, null, 2);
}

function getDefaultValueForPostgresType(colType: string): unknown {
  switch (colType) {
    case "smallint":
    case "integer":
    case "int":
    case "int4":
    case "bigint":
    case "int8":
    case "serial":
    case "bigserial":
    case "numeric":
    case "decimal":
    case "real":
    case "float4":
    case "double precision":
    case "float8":
    case "money":
      return 0;

    case "text":
    case "interval":
    case "tsvector":
    case "tsquery":
    case "xml":
      return "";

    case "char":
    case "character":
      return " ";

    case "boolean":
    case "bool":
      return false;

    case "date":
      return "1970-01-01";

    case "time":
    case "timetz":
      return "00:00:00";

    case "timestamp":
    case "timestamptz":
      return "1970-01-01T00:00:00Z";

    case "json":
    case "jsonb":
      return {};

    case "uuid":
      return "00000000-0000-0000-0000-000000000000";

    case "inet":
      return "0.0.0.0";

    case "cidr":
      return "0.0.0.0/0";

    case "macaddr":
      return "00:00:00:00:00:00";

    case "bytea":
      return "\\x";

    case "int[]":
    case "integer[]":
      return [];

    case "text[]":
      return [];

    case "boolean[]":
      return [];

    case "jsonb[]":
    case "json[]":
      return [];

    default:
      return "";
  }
}
