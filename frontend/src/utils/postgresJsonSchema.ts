export function getJsonSchemaForPostgresType(
  colType: string,
  nullable: boolean,
): object {
  const schema = (() => {
    switch (colType) {
      case "smallint":
        return {
          type: "number",
          minimum: -32768,
          maximum: 32767,
          multipleOf: 1,
        };
      case "integer":
      case "int":
      case "int4":
        return {
          type: "number",
          minimum: -2147483648,
          maximum: 2147483647,
          multipleOf: 1,
        };
      case "bigint":
      case "int8":
        return { type: "number", multipleOf: 1 };
      case "serial":
        return {
          type: "number",
          minimum: 1,
          maximum: 2147483647,
          multipleOf: 1,
        };
      case "bigserial":
        return { type: "number", minimum: 1, multipleOf: 1 };
      case "numeric":
      case "decimal":
      case "real":
      case "float4":
      case "double precision":
      case "float8":
        return { type: "number" };
      case "money":
        return { type: "number" };
      case "text":
        return { type: "string" };
      case "char":
      case "character":
        return { type: "string", minLength: 1, maxLength: 1 };
      case "boolean":
      case "bool":
        return { type: "boolean" };
      case "date":
        return { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" };
      case "time":
      case "timetz":
        return {
          type: "string",
          pattern: "^\\d{2}:\\d{2}(:\\d{2}(\\.\\d+)?)?$",
        };
      case "timestamp":
      case "timestamptz":
        return {
          type: "string",
          pattern:
            "^\\d{4}-\\d{2}-\\d{2}[T ]\\d{2}:\\d{2}(:\\d{2}(\\.\\d+)?)?(Z|[+-]\\d{2}:\\d{2})?$",
        };
      case "interval":
        return { type: "string" };
      case "json":
      case "jsonb":
        return {};
      case "uuid":
        return {
          type: "string",
          pattern:
            "^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$",
        };
      case "inet":
        return {
          type: "string",
          pattern: "^(\\d{1,3}\\.){3}\\d{1,3}(\\/\\d{1,2})?$",
        };
      case "cidr":
        return {
          type: "string",
          pattern: "^(\\d{1,3}\\.){3}\\d{1,3}\\/\\d{1,2}$",
        };
      case "macaddr":
        return {
          type: "string",
          pattern: "^([0-9a-f]{2}:){5}[0-9a-f]{2}$",
        };
      case "bytea":
        return { type: "string", pattern: "^\\\\x[0-9a-fA-F]*$" };
      case "int[]":
      case "integer[]":
        return { type: "array", items: { type: "number", multipleOf: 1 } };
      case "text[]":
        return { type: "array", items: { type: "string" } };
      case "boolean[]":
        return { type: "array", items: { type: "boolean" } };
      case "jsonb[]":
      case "json[]":
        return { type: "array" };
      case "tsvector":
      case "tsquery":
        return { type: "string" };
      case "xml":
        return { type: "string", pattern: "^<[\\s\\S]*>$" };
      default:
        return { type: "string" };
    }
  })();

  if (!nullable) return schema;

  return {
    oneOf: [schema, { type: "null" }],
  };
}
