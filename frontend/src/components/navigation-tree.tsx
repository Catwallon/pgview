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
import { useTableStore } from "@/stores/useTableStore";

export default function NavigationTree() {
  const [databases, setDatabases] = useState<Array<{ name: string }>>([]);
  const [tables, setTables] = useState<Record<string, { name: string }[]>>({});

  const setTable = useTableStore((state) => state.setTable);

  useEffect(() => {
    async function fetchDatabases() {
      try {
        const API_URL =
          import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

        const dataBasesRes = await fetch(`${API_URL}/api/databases`);

        setDatabases(await dataBasesRes.json());
      } catch (error) {
        console.error("Error fetching databases:", error);
      }
    }

    fetchDatabases();
  }, []);

  async function fetchTables(databaseName: string) {
    try {
      const API_URL =
        import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

      const tablesRes = await fetch(
        `${API_URL}/api/databases/${databaseName}/tables`,
      );

      const tables = await tablesRes.json();

      setTables((prev) => ({ ...prev, [databaseName]: tables }));
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
