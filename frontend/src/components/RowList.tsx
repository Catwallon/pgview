import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useColumns } from "@/hooks/useColumns";
import { useRows } from "@/hooks/useRows";
import { useAppStore } from "@/stores/useAppStore";
import { useUIStore } from "@/stores/useUIStore";
import { formatDisplayValue } from "@/utils/formatDisplayValue";

export function RowList() {
  const setOpenRowEditor = useUIStore((state) => state.setOpenRowEditor);
  const { data: columns } = useColumns();
  const { data: rows } = useRows();
  const setRow = useAppStore((state) => state.setRow);

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
          <TableRow>
            {columns &&
              columns.map((col) => (
                <TableHead key={col.name} className="cursor-default bg-gray-50">
                  <span>{col.name}</span>
                  <p
                    style={{ fontSize: "9px" }}
                    className="text-muted-foreground italic"
                  >
                    {col.type}
                  </p>
                </TableHead>
              ))}
          </TableRow>
        </TableHeader>
        {rows && rows.items.length != 0 && (
          <TableBody>
            {rows.items.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => {
                  setOpenRowEditor(true);
                  setRow(row);
                }}
              >
                {Object.entries(row).map(([key, value], index) => (
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
                          : columns &&
                            formatDisplayValue(columns[index], value)}
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
