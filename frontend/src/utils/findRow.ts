import type { RowResponse } from "@pgview/shared-types";

export function findRow(
  rows: RowResponse[],
  rowId: Record<string, string>,
): RowResponse | undefined {
  return rows.find((row) => {
    return Object.entries(rowId).every(([key, value]) => row[key] === value);
  });
}
