import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { Eye, Pencil } from 'lucide-react';

const DataTable = ({ 
  headers = [], 
  data = [], 
  renderRow, 
  actions = [],
  emptyMessage = "No records found"
}) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <div className={`overflow-x-auto rounded-xl border ${isDark ? 'border-white/10' : 'border-gray-200 bg-white'}`}>
      <table className="w-full text-left">
        <thead>
          <tr className={`border-b ${isDark ? 'border-white/10 bg-darkbg' : 'border-gray-100 bg-gray-50'}`}>
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y ${isDark ? 'divide-white/5 bg-secondary-dark-bg/30' : 'divide-gray-100'}`}>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-white/2 transition-colors group">
              {renderRow ? renderRow(item, index) : Object.values(item).map((val, i) => (
                <td key={i} className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                  {val}
                </td>
              ))}
              
              {actions.length > 0 && (
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
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
    </div>
  );
};

export default DataTable;
