import React, { useContext } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Database } from 'lucide-react';
import { ThemeContext } from '../../../common/ThemeContext';

const EntityNode = ({ data, selected }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <div
      className={`
        min-w-[160px] rounded-xl border-2 transition-all duration-200 shadow-lg
        ${selected
          ? 'border-primary-orange shadow-primary-orange/30 shadow-xl'
          : isDark
            ? 'border-white/20 shadow-black/40'
            : 'border-gray-300 shadow-gray-200'}
        ${isDark ? 'bg-secondary-dark-bg' : 'bg-white'}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 bg-primary-orange rounded-t-[10px]">
        <Database className="w-4 h-4 text-white shrink-0" />
        <span className="text-white font-bold text-sm truncate max-w-[120px]">
          {data.label || 'Entity'}
        </span>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        {data.description && (
          <p className="text-[11px] text-gray-400 mb-2 leading-relaxed line-clamp-2">
            {data.description}
          </p>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-orange/10 text-primary-orange border border-primary-orange/20">
            entity
          </span>
          {data.required && (
            <span className="text-primary-orange text-[10px] font-black">★ required</span>
          )}
        </div>
      </div>

      {/* Source handle (right) */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-primary-orange! border-2! border-white! dark:border-secondary-dark-bg!"
      />
    </div>
  );
};

export default EntityNode;
