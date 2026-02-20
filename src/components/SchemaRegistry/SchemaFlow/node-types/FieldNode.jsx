import React, { useContext } from 'react';
import { Handle, Position } from '@xyflow/react';
import { ThemeContext } from '../../../common/ThemeContext';

export const TYPE_COLORS = {
  string:    { bg: 'bg-blue-500/10',   text: 'text-blue-400',   border: 'border-blue-500/20' },
  number:    { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  integer:   { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/20' },
  boolean:   { bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/20' },
  object:    { bg: 'bg-amber-500/10',  text: 'text-amber-400',  border: 'border-amber-500/20' },
  array:     { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20' },
  enum:      { bg: 'bg-pink-500/10',   text: 'text-pink-400',   border: 'border-pink-500/20' },
  date:      { bg: 'bg-teal-500/10',   text: 'text-teal-400',   border: 'border-teal-500/20' },
  reference: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20' },
};

const FieldNode = ({ data, selected }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const typeKey = data.fieldType || 'string';
  const colors = TYPE_COLORS[typeKey] || TYPE_COLORS.string;

  return (
    <div
      className={`
        min-w-[150px] rounded-lg border transition-all duration-200
        ${selected
          ? `border-opacity-80 shadow-md ${colors.border} shadow-current/20`
          : isDark ? 'border-white/10' : 'border-gray-200'}
        ${isDark ? 'bg-secondary-dark-bg' : 'bg-white'}
        px-3 py-2.5 relative
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-2.5 h-2.5 bg-gray-400! border-2! border-white! dark:border-darkbg!"
      />

      <div className="flex items-center justify-between gap-2">
        <span className={`text-sm font-semibold truncate max-w-[100px] ${isDark ? 'text-white' : 'text-gray-800'}`}>
          {data.label || 'field'}
          {data.required && <span className="text-primary-orange ml-1 text-[10px]">★</span>}
        </span>
        <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-bold border ${colors.bg} ${colors.text} ${colors.border}`}>
          {typeKey}
        </span>
      </div>

      {data.description && (
        <p className="text-[10px] text-gray-400 mt-1 leading-relaxed line-clamp-1">
          {data.description}
        </p>
      )}

      {/* Show extra metadata hints */}
      {(data.minLength || data.maxLength || data.minimum !== undefined || data.maximum !== undefined) && (
        <div className="mt-1.5 flex gap-1 flex-wrap">
          {data.minLength && <span className="text-[9px] text-gray-500 bg-gray-100 dark:bg-white/5 px-1 py-0.5 rounded">min:{data.minLength}</span>}
          {data.maxLength && <span className="text-[9px] text-gray-500 bg-gray-100 dark:bg-white/5 px-1 py-0.5 rounded">max:{data.maxLength}</span>}
          {data.minimum !== undefined && <span className="text-[9px] text-gray-500 bg-gray-100 dark:bg-white/5 px-1 py-0.5 rounded">≥{data.minimum}</span>}
          {data.maximum !== undefined && <span className="text-[9px] text-gray-500 bg-gray-100 dark:bg-white/5 px-1 py-0.5 rounded">≤{data.maximum}</span>}
          {data.enumValues?.length > 0 && <span className="text-[9px] text-pink-400 bg-pink-500/10 border border-pink-500/20 px-1 py-0.5 rounded">{data.enumValues.length} values</span>}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="w-2.5 h-2.5 bg-gray-400! border-2! border-white! dark:border-darkbg!"
      />
    </div>
  );
};

export default FieldNode;
