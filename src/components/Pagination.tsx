"use client";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { useRouter } from "next/navigation";

type PaginationProps = {
  page: number;
  count: number;
};

const Pagination = ({ page, count }: PaginationProps) => {
  const hasPrev = page > 1;
  const hasNext = page < Math.ceil(count / ITEM_PER_PAGE);
  const router = useRouter();

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  };

  return (
    <div className="p-4 flex items-center justify-between text-gray-500">
      <button
        disabled={!hasPrev}
        onClick={() => changePage(page - 1)}
        className={`py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold ${
          !hasPrev && "disabled:opacity-50 disabled:cursor-not-allowed"
        }`}
      >
        Prev
      </button>
      <div className="flex items-center gap-2 text-sm">
        {Array.from(
          { length: Math.ceil(count / ITEM_PER_PAGE) },
          (_, index) => {
            const pageIndex = index + 1;
            return (
              <button
                onClick={() => changePage(pageIndex)}
                key={pageIndex}
                className={`px-2 rounded-sm ${pageIndex === page && "bg-sky"}`}
              >
                {pageIndex}
              </button>
            );
          }
        )}
      </div>
      <button
        disabled={!hasNext}
        onClick={() => changePage(page + 1)}
        className={`py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold ${
          !hasNext && "disabled:opacity-50 disabled:cursor-not-allowed"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
