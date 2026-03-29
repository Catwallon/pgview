import {
  TreeExpander,
  TreeIcon,
  TreeLabel,
  TreeNode,
  TreeNodeContent,
  TreeNodeTrigger,
  TreeProvider,
  TreeView,
} from "@/components/kibo-ui/tree";
import { Database, SquareDashed, Table } from "lucide-react";
import { useDatabases } from "@/hooks/useDatabases";
import { useTables } from "@/hooks/useTables";
import { useAppStore } from "@/stores/useAppStore";
import type { DatabaseResponse } from "@/types/database.response";

export function DatabaseTree() {
  const { data: databases } = useDatabases();

  return (
    <TreeProvider>
      <TreeView>
        {databases &&
          databases.map((db) => <DatabaseNode key={db.name} db={db} />)}
      </TreeView>
    </TreeProvider>
  );
}

function DatabaseNode({ db }: { db: DatabaseResponse }) {
  const setDatabase = useAppStore((state) => state.setDatabase);
  const setTable = useAppStore((state) => state.setTable);
  const { data: tables } = useTables(db.name);

  return (
    <TreeNode level={0} nodeId={db.name}>
      <TreeNodeTrigger>
        <TreeExpander hasChildren />
        <TreeIcon icon={<Database />} />
        <TreeLabel>{db.name}</TreeLabel>
      </TreeNodeTrigger>
      <TreeNodeContent hasChildren>
        {tables && tables.length > 0 ? (
          tables.map((table, i) => (
            <TreeNode
              isLast={i === tables.length - 1}
              level={1}
              key={db.name + "-" + table.name}
              nodeId={db.name + "-" + table.name}
            >
              <TreeNodeTrigger
                onClick={() => {
                  setDatabase(db.name);
                  setTable(table.name);
                }}
              >
                <TreeExpander />
                <TreeIcon icon={<Table />} />
                <TreeLabel>{table.name}</TreeLabel>
              </TreeNodeTrigger>
            </TreeNode>
          ))
        ) : (
          <TreeNode isLast level={1} nodeId={db.name + "-no-tables"}>
            <TreeNodeTrigger>
              <TreeExpander />
              <TreeIcon icon={<SquareDashed />} />
              <TreeLabel className="text-muted-foreground italic">
                No tables
              </TreeLabel>
            </TreeNodeTrigger>
          </TreeNode>
        )}
      </TreeNodeContent>
    </TreeNode>
  );
}
