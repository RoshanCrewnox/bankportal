import React, { useContext } from 'react';
import { ThemeContext } from '../../common/ThemeContext';
import {
  Database, Type, Hash, ToggleLeft, Braces, List,
  AlignLeft, Calendar, Link2
} from 'lucide-react';

const NODE_PALETTE = [
  {
    type: 'entityNode',
    label: 'Entity',
    description: 'Root schema entity',
    icon: <Database className="w-4 h-4" />,
    accentClass: 'text-primary-orange bg-primary-orange/10 border-primary-orange/30',
    defaultData: { label: 'NewEntity', fieldType: 'entity', required: false },
  },
  {
    type: 'fieldNode',
    label: 'String',
    description: 'Text value',
    icon: <Type className="w-4 h-4" />,
    accentClass: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    defaultData: { label: 'field', fieldType: 'string', required: false },
  },
  {
    type: 'fieldNode',
    label: 'Number',
    description: 'Numeric value',
    icon: <Hash className="w-4 h-4" />,
    accentClass: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    defaultData: { label: 'field', fieldType: 'number', required: false },
  },
  {
    type: 'fieldNode',
    label: 'Integer',
    description: 'Whole number',
    icon: <Hash className="w-4 h-4" />,
    accentClass: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    defaultData: { label: 'field', fieldType: 'integer', required: false },
  },
  {
    type: 'fieldNode',
    label: 'Boolean',
    description: 'True/false flag',
    icon: <ToggleLeft className="w-4 h-4" />,
    accentClass: 'text-green-400 bg-green-500/10 border-green-500/20',
    defaultData: { label: 'field', fieldType: 'boolean', required: false },
  },
  {
    type: 'objectNode',
    label: 'Object',
    description: 'Nested object',
    icon: <Braces className="w-4 h-4" />,
    accentClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    defaultData: { label: 'object', fieldType: 'object', required: false },
  },
  {
    type: 'fieldNode',
    label: 'Array',
    description: 'List of values',
    icon: <List className="w-4 h-4" />,
    accentClass: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    defaultData: { label: 'field', fieldType: 'array', required: false },
  },
  {
    type: 'fieldNode',
    label: 'Enum',
    description: 'Fixed set of values',
    icon: <AlignLeft className="w-4 h-4" />,
    accentClass: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    defaultData: { label: 'field', fieldType: 'enum', required: false, enumValues: [] },
  },
  {
    type: 'fieldNode',
    label: 'Date',
    description: 'Date/time value',
    icon: <Calendar className="w-4 h-4" />,
    accentClass: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
    defaultData: { label: 'field', fieldType: 'date', required: false },
  },
  {
    type: 'fieldNode',
    label: 'Reference',
    description: 'Link to another entity',
    icon: <Link2 className="w-4 h-4" />,
    accentClass: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    defaultData: { label: 'field', fieldType: 'reference', required: false },
  },
];

const SchemaNodeSidebar = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const onDragStart = (event, paletteItem) => {
    event.dataTransfer.setData('application/schemaflow-node', JSON.stringify(paletteItem));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={`
        w-52 h-full flex flex-col overflow-hidden z-10 border-r
        ${isDark ? 'bg-secondary-dark-bg border-white/10' : 'bg-white border-gray-200'}
      `}
    >
      {/* Header */}
      <div className={`px-4 py-3 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
        <h3 className={`text-xs font-bold ${isDark ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
          Node palette
        </h3>
        <p className={`text-[10px] mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Drag onto canvas
        </p>
      </div>

      {/* Node list */}
      <div className="flex flex-col gap-1.5 p-3 overflow-y-auto flex-1">
        {NODE_PALETTE.map((item) => (
          <div
            key={`${item.type}-${item.label}`}
            draggable
            onDragStart={(e) => onDragStart(e, item)}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-lg border cursor-grab active:cursor-grabbing
              transition-all duration-150 select-none
              ${isDark
                ? 'bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/10'
                : 'bg-gray-50 border-gray-100 hover:border-gray-300 hover:bg-white hover:shadow-sm'}
            `}
          >
            <div className={`p-1.5 rounded-md border ${item.accentClass}`}>
              {item.icon}
            </div>
            <div className="min-w-0">
              <div className={`text-xs font-semibold leading-tight ${isDark ? 'text-white' : 'text-gray-700'}`}>
                {item.label}
              </div>
              <div className={`text-[10px] leading-tight mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer tip */}
      <div className={`px-4 py-3 border-t ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
        <p className={`text-[10px] italic ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
          Click any node on canvas to edit its details
        </p>
      </div>
    </div>
  );
};

export default SchemaNodeSidebar;
