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
