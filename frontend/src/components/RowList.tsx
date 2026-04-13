import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTable } from "@/hooks/useTable";
import { useRows } from "@/hooks/useRows";
import { useAppStore } from "@/stores/useAppStore";
import { useUIStore } from "@/stores/useUIStore";
import { formatDisplayValue } from "@/utils/formatDisplayValue";
import { getRowId } from "@/utils/getRowId";
import { Key } from "lucide-react";

export function RowList() {
  const setOpenRowDialog = useUIStore((state) => state.setOpenRowDialog);
  const setRowDialogMode = useUIStore((state) => state.setRowDialogMode);
  const dbName = useAppStore((state) => state.dbName);
  const tableName = useAppStore((state) => state.tableName);
  const setRow = useAppStore((state) => state.setRow);
  const page = useAppStore((state) => state.page);
  const query = useAppStore((state) => state.query);
  const { data: table, isPlaceholderData: isTablePlaceholder } = useTable(
    dbName,
    tableName,
  );
  const { data: rows, isPlaceholderData: isRowPlaceholder } = useRows(
    dbName,
    tableName,
    page,
    query,
  );

  const isEmpty = (value: unknown) => {
    return String(value).length === 0;
  };

  const isNull = (value: unknown) => {
    return value === null;
  };

  return (
    <div className="flex flex-col h-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className={isTablePlaceholder ? "opacity-50" : ""}>
            {table?.columns &&
              table.columns.map((col) => (
                <TableHead key={col.name} className="cursor-default bg-gray-50">
                  <span>{col.name}</span>
                  <div className="flex items-center gap-1">
                    <p className="text-[9px] text-muted-foreground italic">
                      {col.type}
                    </p>
                    {col.isPrimaryKey && (
                      <Key className="w-2.75 h-2.75 text-muted-foreground" />
                    )}
                  </div>
                </TableHead>
              ))}
          </TableRow>
        </TableHeader>
        {table && rows && (
          <TableBody>
            {rows.items.map((row) => (
              <TableRow
                key={JSON.stringify(row)}
                className={isRowPlaceholder ? "opacity-50" : ""}
                onClick={() => {
                  if (window.getSelection()?.toString()) return;
                  setRow(getRowId(table, row));
                  setRowDialogMode("edit");
                  setOpenRowDialog(true);
                }}
              >
                {Object.entries(row).map(([key, value]) => (
                  <TableCell key={key}>
                    <p
                      className={
                        isEmpty(value) || isNull(value)
                          ? "text-muted-foreground italic"
                          : ""
                      }
                    >
                      {isEmpty(value)
                        ? "empty"
                        : isNull(value)
                          ? "null"
                          : table?.columns &&
                            formatDisplayValue(
                              table.columns.find((col) => col.name === key),
                              value,
                            )}
                    </p>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {rows && rows.items.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-xl text-gray-500">Table is empty</p>
        </div>
      )}
    </div>
  );
}
