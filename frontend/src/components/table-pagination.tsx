import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { useViewerStore } from "@/stores/useViewerStore";

export function TablePagination({
  visiblePageCount = 10,
}: {
  visiblePageCount: number;
}) {
  const currentPage = useViewerStore((state) => state.page);
  const totalPages = useViewerStore((state) => state.totalPages);
  const setPage = useViewerStore((state) => state.setPage);

  const half = Math.floor(visiblePageCount / 2);

  let startPage = currentPage - half;
  startPage = Math.max(1, startPage);
  startPage = Math.min(
    startPage,
    Math.max(1, totalPages - visiblePageCount + 1),
  );

  const pages = Array.from(
    { length: visiblePageCount },
    (_, i) => startPage + i,
  ).filter((p) => p <= totalPages);

  const showEllipsis = visiblePageCount > 1 && (pages.at(-1) ?? 0) < totalPages;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={() => setPage(currentPage - 1)} />
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
                isActive={currentPage === pageNumber}
                onClick={() => setPage(pageNumber)}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext onClick={() => setPage(currentPage + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
