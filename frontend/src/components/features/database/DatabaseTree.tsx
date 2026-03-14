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
import { API_URL } from "@/config/api.config";

export function DatabaseTree() {
  const [databases, setDatabases] = useState<Array<{ name: string }>>([]);
  const [tables, setTables] = useState<Record<string, { name: string }[]>>({});

  const setTable = useAppStore((state) => state.setTable);

  useEffect(() => {
    async function fetchDatabases() {
      try {
        const databases = await fetch(`${API_URL}/api/databases`).then((res) =>
          res.json(),
        );

        setDatabases(databases);
      } catch (error) {
        console.error("Error fetching databases:", error);
      }
    }

    fetchDatabases();
  }, []);

  async function fetchTables(dbName: string) {
    try {
      const API_URL =
        import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

      const tablesRes = await fetch(
        `${API_URL}/api/databases/${dbName}/tables`,
      );

      const tables = await tablesRes.json();

      setTables((prev) => ({ ...prev, [dbName]: tables }));
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  }

  return (
    <TreeProvider>
      <TreeView>
        {databases.map((db) => (
          <TreeNode level={1} key={db.name} nodeId={db.name}>
            <TreeNodeTrigger onClick={() => fetchTables(db.name)}>
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
