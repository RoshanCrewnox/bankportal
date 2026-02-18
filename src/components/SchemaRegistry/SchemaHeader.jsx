import React from 'react';
import { Search, Plus, RefreshCw } from 'lucide-react';

/**
 * Presentational component for Schema Registry Header
 */
const SchemaHeader = ({ 
  searchTerm, 
  setSearchTerm, 
  handleRefresh, 
  onRegister,
  isDark 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold">Schema Registry</h1>
        <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-sm`}>
          Manage and version your API schemas efficiently.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search schemas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 pr-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange/50 transition-all ${
              isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
            }`}
          />
        </div>
        
        <button 
          onClick={handleRefresh}
          className={`p-2 rounded-lg border transition-colors ${
            isDark ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white' : 'bg-white border-gray-200 text-gray-500 hover:text-primary-orange'
          }`}
          title="Refresh"
        >
          <RefreshCw className="w-5 h-5" />
        </button>

        <button 
          onClick={onRegister}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-orange hover:bg-primary-orange/90 rounded-lg shadow-lg shadow-primary-orange/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          Register Schema
        </button>
      </div>
    </div>
  );
};

export default SchemaHeader;
