import { useRows } from "@/hooks/useRows";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../ui/pagination";
import { useAppStore } from "@/stores/useAppStore";

export function RowPagination({
  visiblePageCount = 10,
}: {
  visiblePageCount: number;
}) {
  const page = useAppStore((state) => state.page);
  const setPage = useAppStore((state) => state.setPage);

  const { data: rows } = useRows();
  if (!rows) return null;

  const half = Math.floor(visiblePageCount / 2);

  let startPage = page - half;
  startPage = Math.max(1, startPage);
  startPage = Math.min(
    startPage,
    Math.max(1, rows.totalPages - visiblePageCount + 1),
  );

  const pages = Array.from(
    { length: visiblePageCount },
    (_, i) => startPage + i,
  ).filter((p) => p <= rows.totalPages);

  const showEllipsis =
    visiblePageCount > 1 && (pages.at(-1) ?? 0) < rows.totalPages;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={
              page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
            }
            onClick={() => setPage(page - 1)}
          />
        </PaginationItem>
        {pages.map((pageNumber, index) => {
          const isLast = index === pages.length - 1;

          if (isLast && showEllipsis) {
            return (
              <PaginationItem key={index}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={page === pageNumber}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            className={
              page === rows.totalPages || rows.totalPages === 0
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            onClick={() => setPage(page + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
