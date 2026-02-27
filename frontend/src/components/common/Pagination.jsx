import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Pagination = ({ pagination, onPageChange }) => {
  const { page, pages } = pagination;

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= pages; i++) {
      if (
        i === 1 ||
        i === pages ||
        (i >= page - 2 && i <= page + 2)
      ) {
        pageNumbers.push(i);
      } else if (i === page - 3 || i === page + 3) {
        pageNumbers.push('...');
      }
    }
    return [...new Set(pageNumbers)];
  };

  return (
    <div className="px-6 py-4 flex items-center justify-between border-t">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page <span className="font-medium">{page}</span> of{' '}
            <span className="font-medium">{pages}</span>
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
            
            {renderPageNumbers().map((pageNum, index) => (
              <button
                key={index}
                onClick={() => typeof pageNum === 'number' && onPageChange(pageNum)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  page === pageNum
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            ))}
            
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === pages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;