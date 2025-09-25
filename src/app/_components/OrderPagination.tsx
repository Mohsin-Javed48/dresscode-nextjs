"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface OrderPaginationProps {
  current: number;
  pages: number;
  total: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function OrderPagination({
  current,
  pages,
  total,
  onPageChange,
  isLoading = false,
}: OrderPaginationProps) {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, current - delta);
      i <= Math.min(pages - 1, current + delta);
      i++
    ) {
      range.push(i);
    }

    if (current - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (current + delta < pages - 1) {
      rangeWithDots.push("...", pages);
    } else if (pages > 1) {
      rangeWithDots.push(pages);
    }

    return rangeWithDots;
  };

  if (pages <= 1) return null;

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(current - 1)}
          disabled={current <= 1 || isLoading}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(current + 1)}
          disabled={current >= pages || isLoading}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{" "}
            <span className="font-medium">
              {total === 0 ? 0 : (current - 1) * 10 + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">{Math.min(current * 10, total)}</span>{" "}
            of <span className="font-medium">{total}</span> results
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => onPageChange(current - 1)}
              disabled={current <= 1 || isLoading}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {getVisiblePages().map((page, index) => (
              <button
                key={index}
                onClick={() => typeof page === "number" && onPageChange(page)}
                disabled={page === "..." || isLoading}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  page === current
                    ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                    : page === "..."
                      ? "bg-white border-gray-300 text-gray-500 cursor-default"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                } disabled:cursor-not-allowed`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => onPageChange(current + 1)}
              disabled={current >= pages || isLoading}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}
