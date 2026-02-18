import React from 'react';
import { FileJson, MoreVertical, ExternalLink } from 'lucide-react';

/**
 * Presentational component for Schema Table
 */
const SchemaTable = ({ schemas, loading, isDark, borderClass, cardBgClass }) => {
  if (loading) {
    return (
      <div className={`rounded-2xl border ${borderClass} ${cardBgClass} p-8 flex justify-center`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-orange"></div>
      </div>
    );
  }

  if (schemas.length === 0) {
    return (
      <div className={`rounded-2xl border ${borderClass} ${cardBgClass} p-12 text-center`}>
        <p className="text-gray-500">No schemas found.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border ${borderClass} ${cardBgClass} overflow-hidden`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={isDark ? 'bg-white/5' : 'bg-gray-50'}>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Schema Name</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Version</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Format</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">Last Updated</th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/10">
            {schemas.map((schema) => (
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
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                    {schema.format}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    schema.status === 'Active' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-500' 
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-500'
                  }`}>
                    {schema.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{schema.lastUpdated}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
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
