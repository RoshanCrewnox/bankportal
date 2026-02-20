import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalItems, 
  itemsPerPage = 10, 
  onPageChange,
  isDark
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
            currentPage === i
              ? 'bg-primary-orange text-white shadow-lg shadow-primary-orange/20'
              : `${isDark ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-100'}`
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className={`flex items-center justify-between px-6 py-4 border-t ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} records
        </span>
      </div>
      
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`p-1.5 rounded-lg transition-all ${
            currentPage === 1 
              ? 'opacity-30 cursor-not-allowed text-gray-400' 
              : `${isDark ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-100'}`
          }`}
        >
          <ChevronLeft size={16} />
        </button>
        
        <div className="flex items-center gap-1 mx-2">
          {renderPageNumbers()}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`p-1.5 rounded-lg transition-all ${
            currentPage === totalPages
              ? 'opacity-30 cursor-not-allowed text-gray-400' 
              : `${isDark ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-gray-600 hover:bg-gray-100'}`
          }`}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
