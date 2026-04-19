import { Input } from "@/components/shadcn-ui/input";
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
    <div className="flex gap-2 w-full max-w-lg min-w-28">
      <Input
        value={localQuery ? localQuery : undefined}
        onChange={(e) =>
          setLocalQuery(e.target.value.length > 0 ? e.target.value : null)
        }
        placeholder="Search..."
      />
    </div>
  );
}
