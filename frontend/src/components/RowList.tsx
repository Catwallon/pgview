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

export function RowList({
  setOpenRowEditor,
}: {
  setOpenRowEditor: (v: boolean) => void;
}) {
  const { data: columns } = useColumns();
  const { data: rows } = useRows();
  const setRow = useAppStore((state) => state.setRow);

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
                {Object.entries(row).map(([key, value]) => (
                  <TableCell key={key}>{String(value)}</TableCell>
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
