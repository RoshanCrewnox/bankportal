import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import Pagination from './Pagination';

const EMPTY_HEADERS = [];
const EMPTY_DATA = [];
const EMPTY_ACTIONS = [];

const DataTable = ({ 
  headers = EMPTY_HEADERS, 
  data = EMPTY_DATA, 
  renderRow, 
  actions = EMPTY_ACTIONS,
  emptyMessage = "No records found",
  pagination = null // { currentPage, totalItems, onPageChange, itemsPerPage }
}) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <div className={`overflow-x-auto rounded-xl border ${isDark ? 'border-white/10' : 'border-gray-200 bg-white shadow-sm'}`}>
      <table className="w-full text-left">
        <thead>
          <tr className={`border-b ${isDark ? 'border-white/10 bg-darkbg' : 'border-gray-100 bg-gray-50'}`}>
            {headers.map((header) => (
              <th key={header} className="px-6 py-4 text-sm font-semibold text-gray-500 dark:text-gray-300 tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y ${isDark ? 'divide-white/5 bg-secondary-dark-bg/30' : 'divide-gray-100'}`}>
          {data.map((item, index) => (
            <tr key={item.id || index} className="hover:bg-gray-50 dark:hover:bg-white/2 transition-colors group">
              {renderRow ? renderRow(item, index) : Object.entries(item).map(([key, val]) => (
                <td key={`${item.id}-${key}`} className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                  {val}
                </td>
              ))}
              
              {actions.length > 0 && (
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
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
          
          {data.length === 0 && (
            <tr>
              <td colSpan={headers.length} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 italic text-sm">
                {emptyMessage}
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
