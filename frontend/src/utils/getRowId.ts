import type { RowResponse, TableFullResponse } from "@pgview/shared-types";

export function getRowId(
  table: TableFullResponse,
  row: RowResponse,
): Record<string, string> {
  const rowId = Object.fromEntries(
    table.columns
      .filter((col) => col.isPrimaryKey)
      .map((col) => [col.name, String(row[col.name])]),
  );

  return rowId;
}
