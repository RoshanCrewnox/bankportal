import React, { useContext } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Braces } from 'lucide-react';
import { ThemeContext } from '../../../common/ThemeContext';

const ObjectNode = ({ data, selected }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  return (
    <div
      className={`
        min-w-[150px] rounded-xl border-2 transition-all duration-200 shadow-md
        ${selected
          ? 'border-amber-500 shadow-amber-500/20 shadow-lg'
          : isDark ? 'border-amber-500/30' : 'border-amber-300'}
        ${isDark ? 'bg-secondary-dark-bg' : 'bg-white'}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-amber-500/20 rounded-t-[10px] border-b border-amber-500/20">
        <Braces className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className={`text-sm font-bold truncate max-w-[110px] ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {data.label || 'object'}
          {data.required && <span className="text-primary-orange ml-1 text-[10px]">★</span>}
        </span>
        <span className="ml-auto shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
          object
        </span>
      </div>

      {/* Body */}
      <div className="px-3 py-2">
        {data.description && (
          <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-2 mb-1">{data.description}</p>
        )}
        {data.nullable && (
          <span className="text-[9px] text-gray-500 bg-gray-100 dark:bg-white/5 px-1.5 py-0.5 rounded">nullable</span>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5 h-2.5 bg-amber-400! border-2! border-white! dark:border-secondary-dark-bg!"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-2.5 h-2.5 bg-amber-400! border-2! border-white! dark:border-secondary-dark-bg!"
      />
    </div>
  );
};

export default ObjectNode;
