import { useEffect, useState } from "react";
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
import { Database, Table } from "lucide-react";
import { useAppStore } from "@/stores/useAppStore";
import { fetchGetDatabases, fetchGetTables } from "@/lib/api/database";

export function DatabaseTree() {
  const [databases, setDatabases] = useState<Array<{ name: string }>>([]);
  const [tables, setTables] = useState<Record<string, { name: string }[]>>({});

  const setTable = useAppStore((state) => state.setTable);

  useEffect(() => {
    fetchGetDatabases().then((databases) => setDatabases(databases));
  }, []);

  return (
    <TreeProvider>
      <TreeView>
        {databases.map((db) => (
          <TreeNode level={1} key={db.name} nodeId={db.name}>
            <TreeNodeTrigger
              onClick={() =>
                fetchGetTables(db.name).then((tables) => {
                  setTables((prev) => ({ ...prev, [db.name]: tables }));
                })
              }
            >
              <TreeExpander hasChildren />
              <TreeIcon icon={<Database />} />
              <TreeLabel>{db.name}</TreeLabel>
            </TreeNodeTrigger>
            <TreeNodeContent hasChildren>
              {tables[db.name]?.map((table) => (
                <TreeNode
                  isLast
                  level={2}
                  key={db.name + "-" + table.name}
                  nodeId={db.name + "-" + table.name}
                >
                  <TreeNodeTrigger
                    onClick={() => setTable(db.name, table.name)}
                  >
                    <TreeExpander />
                    <TreeIcon icon={<Table />} />
                    <TreeLabel>{table.name}</TreeLabel>
                  </TreeNodeTrigger>
                </TreeNode>
              ))}
            </TreeNodeContent>
          </TreeNode>
        ))}
      </TreeView>
    </TreeProvider>
  );
}
