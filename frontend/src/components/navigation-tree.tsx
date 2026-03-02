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

export default function NavigationTree() {
  const [databases, setDatabases] = useState<Array<{ name: string }>>([]);
  const [tablesByDb, setTablesByDb] = useState<
    Record<string, { name: string }[]>
  >({});

  useEffect(() => {
    async function fetchDatabases() {
      try {
        const response = await fetch(
          import.meta.env.MODE === "development"
            ? "http://localhost:3000/api/databases"
            : "/api/databases",
        );

        setDatabases(await response.json());
      } catch (error) {
        console.error("Error fetching databases:", error);
      }
    }

    fetchDatabases();
  }, []);

  async function fetchTables(databaseName: string) {
    try {
      const response = await fetch(
        import.meta.env.MODE === "development"
          ? `http://localhost:3000/api/databases/${databaseName}/tables`
          : `/api/databases/${databaseName}/tables`,
      );

      const tables = await response.json();
      setTablesByDb((prev) => ({ ...prev, [databaseName]: tables }));
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
              {tablesByDb[db.name]?.map((table) => (
                <TreeNode
                  isLast
                  level={2}
                  key={db.name + "-" + table.name}
                  nodeId={db.name + "-" + table.name}
                >
                  <TreeNodeTrigger>
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
