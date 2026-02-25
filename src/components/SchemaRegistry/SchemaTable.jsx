import React, { useState, useMemo } from 'react';
import { FileJson, MoreVertical, ExternalLink, ArrowUp, ArrowDown, Database } from 'lucide-react';
import EmptyState from '../common/EmptyState';

/**
 * Presentational component for Schema Table
 */
const SchemaTable = ({ schemas, loading, isDark, borderClass, cardBgClass }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const sortedSchemas = useMemo(() => {
    let sortableItems = [...schemas];
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
  }, [schemas, sortConfig]);

  const SortIcon = ({ sortKey }) => (
    <span className={`ml-1 flex flex-col items-center justify-center transition-opacity ${sortConfig.key === sortKey ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'}`}>
      <ArrowUp className={`w-3 h-3 ${sortConfig.key === sortKey && sortConfig.direction === 'asc' ? 'text-primary-orange' : 'text-gray-400'}`} />
      <ArrowDown className={`w-3 h-3 -mt-1 ${sortConfig.key === sortKey && sortConfig.direction === 'desc' ? 'text-primary-orange' : 'text-gray-400'}`} />
    </span>
  );

  const HeaderCell = ({ label, sortKey, className = "" }) => (
    <th 
      className={`px-6 py-4 text-sm font-bold tracking-wider text-gray-900 dark:text-gray-100 cursor-pointer select-none group hover:text-black dark:hover:text-white transition-colors ${className}`}
      onClick={() => sortKey && requestSort(sortKey)}
    >
      <div className={`flex items-center ${className.includes('text-left') ? '' : ''}`}>
        {label}
        {sortKey && <SortIcon sortKey={sortKey} />}
      </div>
    </th>
  );

  if (loading) {
    return (
      <div className={`rounded-2xl border ${borderClass} ${cardBgClass} p-8 flex justify-center`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-orange"></div>
      </div>
    );
  }

  if (schemas.length === 0) {
    return (
      <div className={`rounded-2xl border ${borderClass} ${cardBgClass} overflow-hidden`}>
        <EmptyState 
          variant="table"
          icon={Database}
          title="No schemas found"
          description="There are currently no schemas associated with this view."
        />
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border ${borderClass} ${cardBgClass} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={isDark ? 'bg-white/5' : 'bg-gray-50'}>
              <HeaderCell label="Schema Name" sortKey="name" />
              <HeaderCell label="Version" sortKey="version" />
              <HeaderCell label="Format" sortKey="format" />
              <HeaderCell label="Status" sortKey="status" />
              <HeaderCell label="Last Updated" sortKey="lastUpdated" />
              <th className="px-6 py-4 text-sm font-bold tracking-wider text-gray-900 dark:text-gray-100 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/10">
            {sortedSchemas.map((schema) => (
              <tr key={schema.id} className={`hover:bg-primary-orange/5 transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary-orange/10 text-primary-orange">
                      <FileJson className="w-5 h-5" />
                    </div>
                    <span className="font-medium">{schema.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{schema.version}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-bold rounded ${isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    {schema.format}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    schema.status === 'Active' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-500' 
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-500'
                  }`}>
                    {schema.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{schema.lastUpdated}</td>
                <td className="px-6 py-4 text-left">
                  <div className="flex justify-start gap-2">
                    <button className="p-1 hover:text-primary-orange transition-colors" title="View Details">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:text-primary-orange transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SchemaTable;
