import type { TableFullResponse } from "@pgview/shared-types";

export function formatDisplayType(
  col: TableFullResponse["columns"][number],
): string {
  return `${col.type}${col.length ? `(${col.length})` : ""}`;
}
