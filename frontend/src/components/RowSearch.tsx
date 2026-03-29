import { Input } from "@/components/ui/input";
import { useAppStore } from "@/stores/useAppStore";
import { useEffect, useState } from "react";

export function RowSearch() {
  const query = useAppStore((state) => state.query);
  const setQuery = useAppStore((state) => state.setQuery);

  const [localQuery, setLocalQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(localQuery);
    }, 150);

    return () => clearTimeout(timer);
  }, [localQuery, setQuery]);

  return (
    <div className="flex gap-2">
      <Input
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder="Search..."
        className="w-150"
      />
    </div>
  );
}
