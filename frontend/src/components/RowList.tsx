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
import { ChevronUp, Key } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const CELL_HEIGHT = 40;

export function RowList() {
  const setOpenRowDialog = useUIStore((state) => state.setOpenRowDialog);
  const setRowDialogMode = useUIStore((state) => state.setRowDialogMode);
  const dbName = useAppStore((state) => state.dbName);
  const tableName = useAppStore((state) => state.tableName);
  const setRow = useAppStore((state) => state.setRow);
  const page = useAppStore((state) => state.page);
  const limit = useAppStore((state) => state.limit);
  const setLimit = useAppStore((state) => state.setLimit);
  const query = useAppStore((state) => state.query);
  const ref = useRef<HTMLDivElement>(null);
  const sort = useAppStore((state) => state.sort);
  const setSort = useAppStore((state) => state.setSort);
  const [cellHeight, setCellHeight] = useState(CELL_HEIGHT);
  const { data: table, isPlaceholderData: isTablePlaceholder } = useTable(
    dbName,
    tableName,
  );
  const { data: rows, isPlaceholderData: isRowPlaceholder } = useRows(
    dbName,
    tableName,
    page,
    limit,
    query,
    sort ? sort : undefined,
  );

  const isEmpty = (value: unknown) => {
    return String(value).length === 0;
  };

  const isNull = (value: unknown) => {
    return value === null;
  };

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver((entries) => {
      const height = entries[0].contentRect.height - 1; // -1 for overflow margin
      const newLimit = Math.floor(height / CELL_HEIGHT) - 1; // -1 for header row
      setLimit(newLimit);
      setCellHeight(height / (newLimit + 1));
    });

    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, [setLimit]);

  return (
    <div
      ref={ref}
      className="flex flex-col h-full overflow-x-auto overflow-y-hidden "
    >
      <div className="border-b">
        <Table>
          <TableHeader>
            <TableRow className={isTablePlaceholder ? "opacity-50" : ""}>
              {table?.columns &&
                table.columns.map((col) => (
                  <TableHead
                    key={col.name}
                    style={{ height: `${cellHeight}px` }}
                    className="bg-gray-50 group cursor-pointer"
                    onClick={() => {
                      if (sort?.column === col.name) {
                        setSort(
                          sort.direction === "asc"
                            ? { column: col.name, direction: "desc" }
                            : sort.direction === "desc"
                              ? null
                              : { column: col.name, direction: "asc" },
                        );
                      } else {
                        setSort({ column: col.name, direction: "asc" });
                      }
                    }}
                  >
                    <div className="flex items-center w-full">
                      <div className="flex flex-col mr-4">
                        <span>{col.name}</span>
                        <div className="flex items-center gap-1">
                          <p className="text-[9px] text-muted-foreground italic">
                            {col.type}
                          </p>
                          {col.isPrimaryKey && (
                            <Key className="w-2.75 h-2.75 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                      <ChevronUp
                        className={cn(
                          "size-4 ml-auto transition-all group-hover:opacity-100",
                          sort?.column === col.name
                            ? sort?.direction === "desc"
                              ? "opacity-50 rotate-180"
                              : "opacity-50 rotate-0"
                            : "opacity-0",
                        )}
                      />
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
                    <TableCell height={cellHeight} key={key}>
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
      </div>
      {rows && rows.items.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-xl text-gray-500">Table is empty</p>
        </div>
      )}
    </div>
  );
}
