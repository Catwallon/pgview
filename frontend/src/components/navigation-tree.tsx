import { useEffect, useState } from "react";
import {
  TreeExpander,
  TreeIcon,
  TreeLabel,
  TreeNode,
  TreeNodeTrigger,
  TreeProvider,
  TreeView,
} from "@/components/kibo-ui/tree";
import { Database } from "lucide-react";

export default function NavigationTree() {
  const [databases, setDatabases] = useState<Array<{ name: string }>>([]);

  useEffect(() => {
    async function fetchData() {
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

    fetchData();
  }, []);

  return (
    <TreeProvider>
      <TreeView>
        {databases.map((db, index) => (
          <TreeNode key={index} nodeId={db.name}>
            <TreeNodeTrigger>
              <TreeExpander hasChildren />
              <TreeIcon icon={<Database />} />
              <TreeLabel>{db.name}</TreeLabel>
            </TreeNodeTrigger>
          </TreeNode>
        ))}
      </TreeView>
    </TreeProvider>
  );
}
