import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAppStore } from "@/stores/useAppStore";

export function RowList({
  setOpenRowEditor,
}: {
  setOpenRowEditor: (v: boolean) => void;
}) {
  const columns = useAppStore((state) => state.columns);
  const rows = useAppStore((state) => state.rows);
  const setRow = useAppStore((state) => state.setRow);

  return (
    <div className="flex flex-col h-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
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
        {rows.length != 0 && (
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => {
                  setOpenRowEditor(true);
                  setRow(row);
                }}
              >
                {Object.entries(row).map(([key, value]) => (
                  <TableCell key={key}>{String(value)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
      {rows.length === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-xl text-gray-500">Table is empty</p>
        </div>
      )}
    </div>
  );
}
