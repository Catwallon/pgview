import type { TableFullResponse } from "@pgview/shared-types";

type Schema = {
  type: string;
  properties: {
    [k: string]: object;
  };
  required: string[];
  additionalProperties: boolean;
};

const FLOAT_REGEX = `[-+]?([0-9]*\\.?[0-9]+([eE][-+]?[0-9]+)?|[Nn][Aa][Nn]|[Ii][Nn][Ff][Ii][Nn][Ii][Tt][Yy]|[Ii][Nn][Ff])`;
const POINT_REGEX = `\\(${FLOAT_REGEX},${FLOAT_REGEX}\\)`;
const POINTS_REGEX = `${POINT_REGEX}(,${POINT_REGEX})*`;

const IPV4_REGEX = `(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)`;
const IPV4_MASK_REGEX = `(3[0-2]|[12]?[0-9])`;
const IPV4_CIDR_REGEX = `${IPV4_REGEX}\\/${IPV4_MASK_REGEX}`;
const IPV4_INET_REGEX = `${IPV4_REGEX}(\\/${IPV4_MASK_REGEX})?`;

const IPV6_SEG_REGEX = `[0-9a-fA-F]{1,4}`;
const IPV6_REGEX = `(${IPV6_SEG_REGEX}:){7}${IPV6_SEG_REGEX}|(${IPV6_SEG_REGEX}:){1,7}:|:((:${IPV6_SEG_REGEX}){1,7}|:)|(${IPV6_SEG_REGEX}:){1,6}:${IPV6_SEG_REGEX}`;
const IPV6_MASK_REGEX = `(12[0-8]|1[01][0-9]|[1-9]?[0-9])`;
const IPV6_CIDR_REGEX = `(${IPV6_REGEX})\\/${IPV6_MASK_REGEX}`;
const IPV6_INET_REGEX = `(${IPV6_REGEX})(\\/${IPV6_MASK_REGEX})?`;

const YEAR_REGEX = `[0-9]{1,7}`;
const MONTH_REGEX = `(0[1-9]|1[0-2])`;
const DAY_REGEX = `(0[1-9]|[12][0-9]|3[01])`;
const DATE_REGEX = `${YEAR_REGEX}-${MONTH_REGEX}-${DAY_REGEX}`;
const BC_REGEX = `( BC)?`;

const TIME_REGEX = `([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\\.[0-9]+)?`;
const TZ_REGEX = `([+-]([01][0-9]|2[0-3])(:[0-5][0-9])?)`;

const INTERVAL_TIME_REGEX = `-?[0-9]+:[0-9]{2}:[0-9]{2}(\\.[0-9]+)?`;
const INTERVAL_UNIT_REGEX = `-?[0-9]+ (year|mon|week|day)s?`;
const INTERVAL_VERBOSE_REGEX = `(${INTERVAL_UNIT_REGEX}( ${INTERVAL_UNIT_REGEX})*)`;
const INTERVAL_VERBOSE_TIME_REGEX = `${INTERVAL_VERBOSE_REGEX}( ${INTERVAL_TIME_REGEX})?`;

export function schemaFromColumns(
  columns: TableFullResponse["columns"],
): Schema {
  const schema: Schema = {
    type: "object",
    properties: {},
    required: [],
    additionalProperties: false,
  };

  for (const col of columns) {
    schema.properties[col.name] = propertyFromColumn(col);
    schema.required.push(col.name);
  }

  return schema;
}

function propertyFromColumn(col: TableFullResponse["columns"][number]): object {
  const property = getProperty(col);

  if (col.nullable) {
    return { oneOf: [property, { type: "null" }] };
  }

  return property;
}

function getProperty(col: TableFullResponse["columns"][number]): object {
  const { type, length, precision = 1, scale = 1 } = col;

  switch (type) {
    case "int8":
      return {
        title: "int8",
        description: "signed 8 byte integer",
        type: "string",
        pattern: "^-?[0-9]{1,19}$",
      };
    case "serial8":
      return {
        title: "serial8",
        description: "autoincrementing 8 byte integer",
        type: "string",
        pattern: "^-?[0-9]{1,19}$",
      };
    case "bit":
      return {
        title: length ? `bit(${length})` : "bit",
        description: `fixed-length ${length || 1} bit${length && length > 1 ? "s" : ""} string`,
        type: "string",
        pattern: `^[01]{${length || 1}}$`,
      };
    case "varbit":
      return {
        title: length ? `varbit(${length})` : "varbit",
        description: length
          ? `variable-length ${length} bit${length > 1 ? "s" : ""} string`
          : "variable-length bit string",
        type: "string",
        pattern: length ? `^[01]{1,${length}}$` : "^[01]+$",
      };
    case "bool":
      return {
        title: `bool`,
        description: `logical Boolean (true/false)`,
        type: "boolean",
      };
    case "box":
      return {
        title: "box",
        description: "rectangular box on a plane",
        type: "string",
        pattern: `^${POINT_REGEX},${POINT_REGEX}$`,
      };
    case "bytea":
      return {
        title: "bytea",
        description: `binary data ("byte array")`,
        type: "string",
        pattern: `^\\\\x[0-9a-fA-F]*$`,
      };
    case "bpchar":
      return {
        title: length ? `bpchar(${length})` : "bpchar",
        description: `fixed-length ${length || 1} character${length && length > 1 ? "s" : ""} string`,
        type: "string",
        minLength: length || 1,
        maxLength: length || 1,
      };
    case "varchar":
      return {
        title: length ? `varchar(${length})` : "varchar",
        description: length
          ? `variable-length ${length} character${length && length > 1 ? "s" : ""} string`
          : "variable-length character string",
        type: "string",
        minLength: 0,
        maxLength: length,
      };
    case "cidr":
      return {
        title: "cidr",
        description: "IPv4 or IPv6 network address",
        type: "string",
        pattern: `^(${IPV4_CIDR_REGEX}|${IPV6_CIDR_REGEX})$`,
      };
    case "circle":
      return {
        title: "circle",
        description: "circle on a plane",
        type: "string",
        pattern: `^<${POINT_REGEX},${FLOAT_REGEX}>$`,
      };
    case "date":
      return {
        title: "date",
        description: "calendar date (year, month, day)",
        type: "string",
        pattern: `^${DATE_REGEX}${BC_REGEX}$`,
      };
    case "float8":
      return {
        title: "float8",
        description: "double precision floating-point number (8 bytes)",
        type: "number",
        minimum: -Number.MAX_VALUE,
        maximum: Number.MAX_VALUE,
      };
    case "inet":
      return {
        title: "inet",
        description: "IPv4 or IPv6 host address",
        type: "string",
        pattern: `^(${IPV4_INET_REGEX}|${IPV6_INET_REGEX})$`,
      };
    case "int4":
      return {
        title: "int4",
        description: "signed 4 byte integer",
        type: "number",
        minimum: -2147483648,
        maximum: 2147483647,
      };
    case "interval":
      return {
        title: "interval",
        description: "time span",
        type: "string",
        pattern: `^(${INTERVAL_VERBOSE_TIME_REGEX}|${INTERVAL_TIME_REGEX})$`,
      };
    case "json":
      return {
        title: "json",
        description: "textual JSON data",
        type: ["object", "array", "string", "number", "boolean"],
      };
    case "jsonb":
      return {
        title: "jsonb",
        description: "binary JSON data, decomposed",
        type: ["object", "array", "string", "number", "boolean"],
      };
    case "line":
      return {
        title: "line",
        description: "infinite line on a plane",
        type: "string",
        pattern: `^\\{${FLOAT_REGEX},${FLOAT_REGEX},${FLOAT_REGEX}\\}$`,
      };
    case "lseg":
      return {
        title: "lseg",
        description: "line segment on a plane",
        type: "string",
        pattern: `^\\[${POINT_REGEX},${POINT_REGEX}\\]$`,
      };
    case "macaddr":
      return {
        title: "macaddr",
        description: "MAC (Media Access Control) address",
        type: "string",
        pattern: `^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$`,
      };
    case "macaddr8":
      return {
        title: "macaddr8",
        description: "MAC (Media Access Control) address (EUI-64 format)",
        type: "string",
        pattern: `^([0-9a-fA-F]{2}:){7}[0-9a-fA-F]{2}$`,
      };
    case "money":
      return {
        title: "money",
        description: "currency amount",
        type: "string",
        pattern: `^-?\\$[0-9]{1,3}(,[0-9]{3})*(\\.[0-9]{2})?$`,
      };
    case "numeric":
      return {
        title: `numeric(${precision}, ${scale})`,
        description: "exact numeric of selectable precision",
        type: "string",
        pattern: `^-?[0-9]{1,${precision - scale}}(\\.[0-9]{1,${scale}})?$`,
      };
    case "path":
      return {
        title: "path",
        description: "geometric path on a plane",
        type: "string",
        pattern: `^(\\(${POINTS_REGEX}\\)|\\[${POINTS_REGEX}\\])$`,
      };
    case "pg_lsn":
      return {
        title: "pg_lsn",
        description: "PostgreSQL Log Sequence Number",
        type: "string",
        pattern: `^[0-9a-fA-F]+\\/[0-9a-fA-F]+$`,
      };
    case "pg_snapshot":
      return {
        title: "pg_snapshot",
        description: "user-level transaction ID snapshot",
        type: "string",
        pattern: `^[0-9]+:[0-9]+:([0-9]+(,[0-9]+)*)?$`,
      };
    case "point":
      return {
        type: "string",
        pattern: POINT_REGEX,
        title: "point",
        description: "geometric point on a plane",
      };
    case "polygon":
      return {
        title: "polygon",
        description: "closed geometric path on a plane",
        type: "string",
        pattern: `^\\(${POINT_REGEX}(,${POINT_REGEX})+\\)$`,
      };
    case "float4":
      return {
        title: "float4",
        description: "single precision floating-point number (4 bytes)",
        type: "number",
        minimum: -3.4028235e38,
        maximum: 3.4028235e38,
      };
    case "int2":
      return {
        title: "int2",
        description: "signed two-byte integer",
        type: "number",
        minimum: -32768,
        maximum: 32767,
      };
    case "serial2":
      return {
        description: "autoincrementing 2 byte integer",
        title: "serial2",
        type: "number",
        minimum: -32768,
        maximum: 32767,
      };
    case "serial4":
      return {
        title: "serial4",
        description: "autoincrementing 4 byte integer",
        type: "number",
        minimum: -2147483648,
        maximum: 2147483647,
      };
    case "text":
      return {
        title: "text",
        description: "variable-length character string",
        type: "string",
      };
    case "time":
      return {
        title: "time",
        description: "time of day (no time zone)",
        type: "string",
        pattern: `^${TIME_REGEX}$`,
      };
    case "timetz":
      return {
        title: "timetz",
        description: "time of day with time zone",
        type: "string",
        pattern: `^${TIME_REGEX}${TZ_REGEX}$`,
      };
    case "timestamp":
      return {
        title: "timestamp",
        description: "date and time (no time zone)",
        type: "string",
        pattern: `^${DATE_REGEX} ${TIME_REGEX}(${BC_REGEX})?$`,
      };
    case "timestamptz":
      return {
        title: "timestamptz",
        description: "date and time with time zone",
        type: "string",
        pattern: `^${DATE_REGEX} ${TIME_REGEX}${TZ_REGEX}(${BC_REGEX})?$`,
      };
    case "tsquery":
      return {
        title: "tsquery",
        description: "text search query",
        type: "string",
        pattern: `^.+$`,
      };
    case "tsvector":
      return {
        title: "tsvector",
        description: "text search document",
        type: "string",
        pattern: `^.+$`,
      };
    case "txid_snapshot":
      return {
        title: "txid_snapshot",
        description: "transaction ID snapshot",
        type: "string",
        pattern: `^[0-9]+:[0-9]+:([0-9]+(,[0-9]+)*)?$`,
      };
    case "uuid":
      return {
        title: "uuid",
        description: "universally unique identifier",
        type: "string",
        pattern: `^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$`,
      };
    case "xml":
      return {
        title: "xml",
        description: "XML data",
        type: "string",
        pattern: `^<[\\s\\S]+>$`,
      };
    default:
      return {
        type: "string",
      };
  }
}
