import type { TableFullResponse } from "@pgview/shared-types";
import { formatDisplayType } from "./formatDisplayType";

type Schema = {
  type: string;
  properties: {
    [k: string]: Property;
  };
  required: string[];
  additionalProperties: boolean;
};

type Type = "string" | "number" | "boolean" | "object" | "array" | "null";

type Property = {
  title?: string;
  description?: string;
  type?: Type | Type[];
  pattern?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  items?: Property;
  oneOf?: Property[];
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

function propertyFromColumn(
  col: TableFullResponse["columns"][number],
): Property {
  let property = columnToProperty(col);

  if (col.isArray) {
    property = wrapPropertyInArray(property);
  }

  if (col.isNullable) {
    return { oneOf: [property, { type: "null" } satisfies Property] };
  }

  return property;
}

function wrapPropertyInArray(property: Property): Property {
  const { title, description, ...rest } = property;
  return {
    title,
    description: description ? `array of ${description}` : "array",
    type: "array",
    items: {
      ...rest,
    },
  };
}

function columnToProperty(col: TableFullResponse["columns"][number]): Property {
  const { type, length, precision = 1, scale = 1 } = col;

  switch (type) {
    case "int8":
      return {
        title: formatDisplayType(col),
        description: "signed 8 byte integer",
        type: "string",
        pattern: "^-?[0-9]{1,19}$",
      };
    case "serial8":
      return {
        title: formatDisplayType(col),
        description: "autoincrementing 8 byte integer",
        type: "string",
        pattern: "^-?[0-9]{1,19}$",
      };
    case "bit":
      return {
        title: formatDisplayType(col),
        description: `fixed-length ${length || 1} bit${length && length > 1 ? "s" : ""} string`,
        type: "string",
        pattern: `^[01]{${length || 1}}$`,
      };
    case "varbit":
      return {
        title: formatDisplayType(col),
        description: length
          ? `variable-length ${length} bit${length > 1 ? "s" : ""} string`
          : "variable-length bit string",
        type: "string",
        pattern: length ? `^[01]{1,${length}}$` : "^[01]+$",
      };
    case "bool":
      return {
        title: formatDisplayType(col),
        description: `logical Boolean (true/false)`,
        type: "boolean",
      };
    case "box":
      return {
        title: formatDisplayType(col),
        description: "rectangular box on a plane",
        type: "string",
        pattern: `^${POINT_REGEX},${POINT_REGEX}$`,
      };
    case "bytea":
      return {
        title: formatDisplayType(col),
        description: `binary data ("byte array")`,
        type: "string",
        pattern: `^\\\\x[0-9a-fA-F]*$`,
      };
    case "bpchar":
      return {
        title: formatDisplayType(col),
        description: `fixed-length ${length || 1} character${length && length > 1 ? "s" : ""} string`,
        type: "string",
        minLength: length || 1,
        maxLength: length || 1,
      };
    case "varchar":
      return {
        title: formatDisplayType(col),
        description: length
          ? `variable-length ${length} character${length && length > 1 ? "s" : ""} string`
          : "variable-length character string",
        type: "string",
        minLength: 0,
        maxLength: length,
      };
    case "cidr":
      return {
        title: formatDisplayType(col),
        description: "IPv4 or IPv6 network address",
        type: "string",
        pattern: `^(${IPV4_CIDR_REGEX}|${IPV6_CIDR_REGEX})$`,
      };
    case "circle":
      return {
        title: formatDisplayType(col),
        description: "circle on a plane",
        type: "string",
        pattern: `^<${POINT_REGEX},${FLOAT_REGEX}>$`,
      };
    case "date":
      return {
        title: formatDisplayType(col),
        description: "calendar date (year, month, day)",
        type: "string",
        pattern: `^${DATE_REGEX}${BC_REGEX}$`,
      };
    case "float8":
      return {
        title: formatDisplayType(col),
        description: "double precision floating-point number (8 bytes)",
        type: "number",
        minimum: -Number.MAX_VALUE,
        maximum: Number.MAX_VALUE,
      };
    case "inet":
      return {
        title: formatDisplayType(col),
        description: "IPv4 or IPv6 host address",
        type: "string",
        pattern: `^(${IPV4_INET_REGEX}|${IPV6_INET_REGEX})$`,
      };
    case "int4":
      return {
        title: formatDisplayType(col),
        description: "signed 4 byte integer",
        type: "number",
        minimum: -2147483648,
        maximum: 2147483647,
      };
    case "interval":
      return {
        title: formatDisplayType(col),
        description: "time span",
        type: "string",
        pattern: `^(${INTERVAL_VERBOSE_TIME_REGEX}|${INTERVAL_TIME_REGEX})$`,
      };
    case "json":
      return {
        title: formatDisplayType(col),
        description: "textual JSON data",
        type: ["object", "array", "string", "number", "boolean"],
      };
    case "jsonb":
      return {
        title: formatDisplayType(col),
        description: "binary JSON data, decomposed",
        type: ["object", "array", "string", "number", "boolean"],
      };
    case "line":
      return {
        title: formatDisplayType(col),
        description: "infinite line on a plane",
        type: "string",
        pattern: `^\\{${FLOAT_REGEX},${FLOAT_REGEX},${FLOAT_REGEX}\\}$`,
      };
    case "lseg":
      return {
        title: formatDisplayType(col),
        description: "line segment on a plane",
        type: "string",
        pattern: `^\\[${POINT_REGEX},${POINT_REGEX}\\]$`,
      };
    case "macaddr":
      return {
        title: formatDisplayType(col),
        description: "MAC (Media Access Control) address",
        type: "string",
        pattern: `^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$`,
      };
    case "macaddr8":
      return {
        title: formatDisplayType(col),
        description: "MAC (Media Access Control) address (EUI-64 format)",
        type: "string",
        pattern: `^([0-9a-fA-F]{2}:){7}[0-9a-fA-F]{2}$`,
      };
    case "money":
      return {
        title: formatDisplayType(col),
        description: "currency amount",
        type: "string",
        pattern: `^-?\\$[0-9]{1,3}(,[0-9]{3})*(\\.[0-9]{2})?$`,
      };
    case "numeric":
      return {
        title: formatDisplayType(col),
        description: "exact numeric of selectable precision",
        type: "string",
        pattern: `^-?[0-9]{1,${precision - scale}}(\\.[0-9]{1,${scale}})?$`,
      };
    case "path":
      return {
        title: formatDisplayType(col),
        description: "geometric path on a plane",
        type: "string",
        pattern: `^(\\(${POINTS_REGEX}\\)|\\[${POINTS_REGEX}\\])$`,
      };
    case "pg_lsn":
      return {
        title: formatDisplayType(col),
        description: "PostgreSQL Log Sequence Number",
        type: "string",
        pattern: `^[0-9a-fA-F]+\\/[0-9a-fA-F]+$`,
      };
    case "pg_snapshot":
      return {
        title: formatDisplayType(col),
        description: "user-level transaction ID snapshot",
        type: "string",
        pattern: `^[0-9]+:[0-9]+:([0-9]+(,[0-9]+)*)?$`,
      };
    case "point":
      return {
        type: "string",
        pattern: POINT_REGEX,
        title: formatDisplayType(col),
        description: "geometric point on a plane",
      };
    case "polygon":
      return {
        title: formatDisplayType(col),
        description: "closed geometric path on a plane",
        type: "string",
        pattern: `^\\(${POINT_REGEX}(,${POINT_REGEX})+\\)$`,
      };
    case "float4":
      return {
        title: formatDisplayType(col),
        description: "single precision floating-point number (4 bytes)",
        type: "number",
        minimum: -3.4028235e38,
        maximum: 3.4028235e38,
      };
    case "int2":
      return {
        title: formatDisplayType(col),
        description: "signed two-byte integer",
        type: "number",
        minimum: -32768,
        maximum: 32767,
      };
    case "serial2":
      return {
        description: "autoincrementing 2 byte integer",
        title: formatDisplayType(col),
        type: "number",
        minimum: -32768,
        maximum: 32767,
      };
    case "serial4":
      return {
        title: formatDisplayType(col),
        description: "autoincrementing 4 byte integer",
        type: "number",
        minimum: -2147483648,
        maximum: 2147483647,
      };
    case "text":
      return {
        title: formatDisplayType(col),
        description: "variable-length character string",
        type: "string",
      };
    case "time":
      return {
        title: formatDisplayType(col),
        description: "time of day (no time zone)",
        type: "string",
        pattern: `^${TIME_REGEX}$`,
      };
    case "timetz":
      return {
        title: formatDisplayType(col),
        description: "time of day with time zone",
        type: "string",
        pattern: `^${TIME_REGEX}${TZ_REGEX}$`,
      };
    case "timestamp":
      return {
        title: formatDisplayType(col),
        description: "date and time (no time zone)",
        type: "string",
        pattern: `^${DATE_REGEX} ${TIME_REGEX}(${BC_REGEX})?$`,
      };
    case "timestamptz":
      return {
        title: formatDisplayType(col),
        description: "date and time with time zone",
        type: "string",
        pattern: `^${DATE_REGEX} ${TIME_REGEX}${TZ_REGEX}(${BC_REGEX})?$`,
      };
    case "tsquery":
      return {
        title: formatDisplayType(col),
        description: "text search query",
        type: "string",
        pattern: `^.+$`,
      };
    case "tsvector":
      return {
        title: formatDisplayType(col),
        description: "text search document",
        type: "string",
        pattern: `^.+$`,
      };
    case "txid_snapshot":
      return {
        title: formatDisplayType(col),
        description: "transaction ID snapshot",
        type: "string",
        pattern: `^[0-9]+:[0-9]+:([0-9]+(,[0-9]+)*)?$`,
      };
    case "uuid":
      return {
        title: formatDisplayType(col),
        description: "universally unique identifier",
        type: "string",
        pattern: `^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$`,
      };
    case "xml":
      return {
        title: formatDisplayType(col),
        description: "XML data",
        type: "string",
        pattern: `^<[\\s\\S]+>$`,
      };
    default:
      return {
        title: formatDisplayType(col),
        type: "string",
      };
  }
}
