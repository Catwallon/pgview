import type { TableFullResponse } from "@pgview/shared-types";

export function formatDisplayType(
  col: TableFullResponse["columns"][number],
): string {
  let name = col.type;

  if (col.precision !== undefined && col.scale !== undefined) {
    name = `${name}(${col.precision},${col.scale})`;
  } else if (col.length) {
    name = `${name}(${col.length})`;
  }

  if (col.isArray) {
    name += "[]";
  }

  return name;
}
