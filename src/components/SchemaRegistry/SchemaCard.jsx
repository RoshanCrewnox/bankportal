import React from 'react';
import { FileJson, Eye, Edit2, Trash2, Calendar, ShieldCheck } from 'lucide-react';

/**
 * Presentational component for a Schema Card
 */
const SchemaCard = ({ schema, onEdit, onView, onDelete, isDark }) => {
  return (
    <div className={`group relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl ${
      isDark 
        ? 'bg-secondary-dark-bg border-white/10 hover:border-primary-orange/30' 
        : 'bg-white border-gray-100 hover:border-primary-orange/20 shadow-sm'
    }`}>
      {/* Header Info */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary-orange/10 text-primary-orange">
            <FileJson size={20} />
          </div>
          <div>
            <h3 className={`font-bold text-lg leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {schema.cdm_name || 'Untitled Schema'}
            </h3>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {schema.cdm_id || 'NO ID'} • v{schema.version}
            </span>
          </div>
        </div>
        
        <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
          schema.status === 'Active' 
            ? 'bg-green-500/10 text-green-500' 
            : 'bg-yellow-500/10 text-yellow-500'
        }`}>
          {schema.status}
        </div>
      </div>

      {/* Description */}
      <p className={`text-sm mb-6 line-clamp-2 h-10 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
        {schema.desc || 'No description provided for this schema.'}
      </p>

      {/* Metadata Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <ShieldCheck size={14} className="text-primary-orange" />
          <span className="truncate">{schema.cdm_domain || 'Uncategorized'}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Calendar size={14} />
          <span>{new Date(schema.updated_at).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => onDelete(schema.cdm_uuid)}
          className={`p-2 rounded-lg transition-colors ${
            isDark ? 'text-gray-500 hover:text-red-400 hover:bg-white/5' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
          }`}
          title="Delete"
        >
          <Trash2 size={18} />
        </button>

        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(schema)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              isDark ? 'text-gray-300 hover:bg-white/5' : 'text-gray-600 hover:bg-gray-50'
            }`}
            title="Edit Fields"
          >
            <Edit2 size={16} />
            <span>Edit</span>
          </button>
          <button 
            onClick={() => onView(schema)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-primary-orange text-white hover:bg-primary-orange/90 shadow-lg shadow-primary-orange/10 transition-all"
            title="View Flow Diagram"
          >
            <Eye size={16} />
            <span>View</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchemaCard;
