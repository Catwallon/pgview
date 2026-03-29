import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppStore } from "@/stores/useAppStore";

export function RowSearch() {
  const query = useAppStore((state) => state.query);
  const setQuery = useAppStore((state) => state.setQuery);

  const handleSearch = () => {
    setQuery(query);
  };

  return (
    <div className="flex gap-2">
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="w-150"
      />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
}
