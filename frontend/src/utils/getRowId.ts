import type { RowResponse, TableFullResponse } from "@catwallon/pgview-types";

export function getRowId(
  table: TableFullResponse,
  row: RowResponse,
): Record<string, string> {
  return Object.fromEntries(
    table.columns
      .filter((col) => col.isPrimaryKey && col.name in row)
      .map((col) => [col.name, String(row[col.name])]),
  );
}
