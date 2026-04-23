import type { TableFullResponse } from "@catwallon/pgview-types";

const MAX_LENGTH = 36;

export function formatDisplayValue(
  col: TableFullResponse["columns"][number] | undefined,
  value: unknown,
): string {
  const type = col?.type;

  let valueStr;
  if (type === "json" || type === "jsonb") {
    valueStr = JSON.stringify(value);
  } else {
    valueStr = String(value);
    if (col?.isArray) {
      valueStr = `[${valueStr}]`;
    }
  }

  return valueStr.length > MAX_LENGTH
    ? valueStr.slice(0, MAX_LENGTH) + "..."
    : valueStr;
}
