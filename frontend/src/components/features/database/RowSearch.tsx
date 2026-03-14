import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/stores/useAppStore";
import { useState } from "react";

export function RowSearch() {
  const [query, setQuery] = useState("");
  const setRowSearchQuery = useAppStore((state) => state.setRowSearchQuery);

  const handleSearch = () => {
    setRowSearchQuery(query);
  };

  return (
    <div className="flex gap-2">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
}
