import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRowStore } from "@/stores/useRowStore";
import { useTableStore } from "@/stores/useTableStore";

export function TableList({
  setOpenRowEditor,
}: {
  setOpenRowEditor: (v: boolean) => void;
}) {
  const columns = useTableStore((state) => state.columns);
  const rows = useTableStore((state) => state.rows);
  const setRow = useRowStore((state) => state.setRow);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.name}>{col.name}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
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
    </Table>
  );
}
