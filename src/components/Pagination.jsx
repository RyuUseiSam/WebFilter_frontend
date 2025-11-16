import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  total,
  hasNext,
  hasPrev,
  onPageChange,
  onPageSizeChange,
  mode = 'whitelist' // 'whitelist' or 'blacklist' for color theming
}) => {
  const pageSizeOptions = [10, 25, 50, 100];

  // Calculate the range of items being displayed
  const startItem = totalPages > 0 ? (currentPage - 1) * pageSize + 1 : 0;
  const endItem = Math.min(currentPage * pageSize, total);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 7; // Total number of page buttons to show

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of middle section
      let startPage = Math.max(2, currentPage - 2);
      let endPage = Math.min(totalPages - 1, currentPage + 2);

      // Adjust if we're near the start
      if (currentPage <= 3) {
        endPage = 5;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('...');
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  // Theme colors based on mode
  const colorClasses = mode === 'whitelist'
    ? {
        primary: 'text-green-600',
        bg: 'bg-green-600',
        hoverBg: 'hover:bg-green-50',
        activeBg: 'bg-green-100',
        border: 'border-green-600',
        focusRing: 'focus:ring-green-300'
      }
    : {
        primary: 'text-red-600',
        bg: 'bg-red-600',
        hoverBg: 'hover:bg-red-50',
        activeBg: 'bg-red-100',
        border: 'border-red-600',
        focusRing: 'focus:ring-red-300'
      };

  return (
    <div className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Results Info */}
        <div className="text-sm text-gray-700">
          顯示第 <span className="font-semibold">{startItem}</span> 至{' '}
          <span className="font-semibold">{endItem}</span> 筆，共{' '}
          <span className="font-semibold">{total}</span> 筆記錄
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2 mr-4">
            <label htmlFor="pageSize" className="text-sm text-gray-700 whitespace-nowrap">
              每頁顯示:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* First Page Button */}
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={!hasPrev}
            className={`p-2 rounded-lg border transition-all duration-200 ${
              !hasPrev
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : `border-gray-300 text-gray-700 ${colorClasses.hoverBg} hover:border-gray-400`
            }`}
            title="第一頁"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Previous Page Button */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!hasPrev}
            className={`p-2 rounded-lg border transition-all duration-200 ${
              !hasPrev
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : `border-gray-300 text-gray-700 ${colorClasses.hoverBg} hover:border-gray-400`
            }`}
            title="上一頁"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Numbers */}
          <div className="hidden sm:flex items-center gap-1">
            {pageNumbers.map((pageNum, index) => {
              if (pageNum === '...') {
                return (
                  <span key={`ellipsis-${index}`} className="px-3 py-1.5 text-gray-500">
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => onPageChange(pageNum)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    currentPage === pageNum
                      ? `${colorClasses.bg} text-white shadow-sm`
                      : `text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-300`
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          {/* Current Page Indicator (Mobile) */}
          <div className="sm:hidden px-3 py-1.5 text-sm font-medium text-gray-700">
            {currentPage} / {totalPages}
          </div>

          {/* Next Page Button */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!hasNext}
            className={`p-2 rounded-lg border transition-all duration-200 ${
              !hasNext
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : `border-gray-300 text-gray-700 ${colorClasses.hoverBg} hover:border-gray-400`
            }`}
            title="下一頁"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Last Page Button */}
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={!hasNext}
            className={`p-2 rounded-lg border transition-all duration-200 ${
              !hasNext
                ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                : `border-gray-300 text-gray-700 ${colorClasses.hoverBg} hover:border-gray-400`
            }`}
            title="最後一頁"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
