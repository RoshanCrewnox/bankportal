import React, { useContext, useState, useMemo } from 'react';
import { ThemeContext } from './ThemeContext';
import { ArrowUp, ArrowDown } from 'lucide-react';
import Pagination from './Pagination';
import EmptyState from './EmptyState';

const EMPTY_HEADERS = [];
const EMPTY_DATA = [];
const EMPTY_ACTIONS = [];

const DataTable = ({ 
  headers = EMPTY_HEADERS, 
  data = EMPTY_DATA, 
  renderRow, 
  actions = EMPTY_ACTIONS,
  emptyMessage = "No records found",
  emptyState = null, // { icon, title, description, action }
  pagination = null, // { currentPage, totalItems, onPageChange, itemsPerPage }
  className = "",
  tableClassName = ""
}) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const requestSort = (key) => {
    if (!key) return;
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];
        if (aVal === undefined || aVal === null) aVal = '';
        if (bVal === undefined || bVal === null) bVal = '';
        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  return (
    <div className={`overflow-x-auto rounded-xl border ${isDark ? 'border-white/10' : 'border-gray-200 bg-white shadow-sm'} ${className}`}>
      <table className={`w-full text-left ${tableClassName}`}>
        <thead>
          <tr className={`border-b ${isDark ? 'border-white/10 bg-darkbg' : 'border-gray-100 bg-gray-50'}`}>
            {headers.map((header, idx) => {
              const label = typeof header === 'object' ? header.label : header;
              const sortKey = typeof header === 'object' ? header.key : null;
              const isActions = label.toLowerCase() === 'actions';
              const isSortable = !isActions && sortKey;
              
              return (
                <th 
                  key={idx} 
                  className={`px-6 py-4 text-sm font-bold tracking-wider text-gray-900 dark:text-gray-100 ${isSortable ? 'cursor-pointer select-none hover:text-black dark:hover:text-white group transition-colors' : ''}`}
                  onClick={() => isSortable && requestSort(sortKey)}
                >
                  <div className="flex items-center">
                    {label}
                    {isSortable && (
                      <span className={`ml-1 flex flex-col items-center justify-center transition-opacity ${sortConfig.key === sortKey ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
                        <ArrowUp className={`w-3 h-3 ${sortConfig.key === sortKey && sortConfig.direction === 'asc' ? 'text-primary-orange' : 'text-gray-400'}`} />
                        <ArrowDown className={`w-3 h-3 -mt-1 ${sortConfig.key === sortKey && sortConfig.direction === 'desc' ? 'text-primary-orange' : 'text-gray-400'}`} />
                      </span>
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className={`divide-y ${isDark ? 'divide-white/5 bg-secondary-dark-bg/30' : 'divide-gray-100'}`}>
          {sortedData.map((item, index) => (
            <tr key={item.id || index} className="hover:bg-gray-50 dark:hover:bg-white/2 transition-colors group">
              {renderRow ? renderRow(item, index) : Object.entries(item).map(([key, val]) => (
                <td key={`${item.id}-${key}`} className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                  {val}
                </td>
              ))}
              
              {actions.length > 0 && (
                <td className="px-6 py-4 text-left">
                  <div className="flex items-center justify-start gap-2">
                    {actions.map((action, actionIdx) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={actionIdx}
                          onClick={() => action.onClick(item)}
                          className={`p-1.5 transition-colors ${action.className || 'text-gray-400 hover:text-primary-orange'}`}
                          title={action.title}
                        >
                          <Icon className="w-4 h-4" />
                        </button>
                      );
                    })}
                  </div>
                </td>
              )}
            </tr>
          ))}
          
          {sortedData.length === 0 && (
            <tr>
              <td colSpan={headers.length} className="px-6 py-6 transition-all duration-300">
                <EmptyState 
                  variant="table"
                  title={emptyState?.title || emptyMessage}
                  description={emptyState?.description}
                  icon={emptyState?.icon}
                  action={emptyState?.action}
                />
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {pagination && (
        <Pagination 
          currentPage={pagination.currentPage}
          totalItems={pagination.totalItems}
          itemsPerPage={pagination.itemsPerPage}
          onPageChange={pagination.onPageChange}
          isDark={isDark}
        />
      )}
    </div>
  );
};

export default DataTable;
