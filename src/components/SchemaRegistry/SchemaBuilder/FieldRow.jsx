import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const EMPTY_PATH = [];
const FIELD_TYPES = ['string', 'number', 'boolean', 'date', 'add reference', 'object', 'array'];

const FieldRow = ({ 
  field, 
  index, 
  path = EMPTY_PATH, 
  onUpdate, 
  onRemove, 
  onAddNested, 
  isDark, 
  schemas,
  level = 0 
}) => {
  const currentPath = [...path, index];
  const fieldId = `field-${currentPath.join('-')}`;
  const isComplex = field.type === 'object' || field.type === 'array';

  const inputClass = `w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange/30 transition-all ${
    isDark ? 'bg-darkbg border-white/10 text-white placeholder:text-gray-600' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 shadow-sm'
  }`;

  const selectClass = `${inputClass} appearance-none pr-10 cursor-pointer ${
    isDark 
      ? '[&>option]:bg-[#2f3349] [&>option]:text-white bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2024%2024%27%20stroke%3D%27%239ca3af%27%3E%3Cpath%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%272%27%20d%3D%27M19%209l-7%207-7-7%27/%3E%3C/svg%3E")] bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat' 
      : 'bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2024%2024%27%20stroke%3D%27%236b7280%27%3E%3Cpath%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%272%27%20d%3D%27M19%209l-7%207-7-7%27/%3E%3C/svg%3E")] bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat'
  }`;

  const labelClass = `block text-xs font-semibold mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`;

  return (
    <div className={`space-y-3 ${level > 0 ? 'ml-6 pl-4 border-l-2 border-primary-orange/10 mt-3' : ''}`}>
      <div className={`group p-4 rounded-xl border transition-all ${
        isDark ? 'bg-secondary-dark-bg/50 border-white/5' : 'bg-white border-gray-100 shadow-sm'
      }`}>
        <div className="flex items-end gap-3 flex-wrap md:flex-nowrap w-full">
          <div className="w-[180px]">
            <label htmlFor={`${fieldId}-name`} className={labelClass}>Field Name</label>
            <input 
              id={`${fieldId}-name`}
              value={field.name} 
              onChange={(e) => onUpdate(currentPath, { name: e.target.value })}
              className={inputClass} 
              placeholder="e.g. id"
            />
          </div>
          <div className="w-[180px]">
            <label htmlFor={`${fieldId}-type`} className={labelClass}>Data Type</label>
            <select 
              id={`${fieldId}-type`}
              value={field.type} 
              onChange={(e) => onUpdate(currentPath, { type: e.target.value })}
              className={selectClass}
            >
              {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-4 pb-2">
            <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
              <input 
                type="checkbox" 
                checked={field.unique} 
                onChange={(e) => onUpdate(currentPath, { unique: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary-orange focus:ring-primary-orange accent-primary-orange"
              />
              <span className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Unique</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap" title="Add to Fields Registry">
              <input 
                type="checkbox" 
                checked={field.inRegistry} 
                onChange={(e) => onUpdate(currentPath, { inRegistry: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary-orange focus:ring-primary-orange accent-primary-orange"
              />
              <span className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Add to Registry</span>
            </label>
          </div>

          <div className="flex items-center gap-1 pb-1 ml-auto">
            {isComplex && (
              <button 
                onClick={() => onAddNested(currentPath)}
                title="Add Nested Field"
                className="p-2 text-primary-orange hover:bg-primary-orange/10 rounded-lg transition-all"
              >
                <Plus size={16} />
              </button>
            )}
            <button 
              onClick={() => onRemove(currentPath)}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {field.type === 'add reference' && (
          <div className="flex gap-4 mt-3 pt-3 border-t border-white/5 animate-in slide-in-from-top-2 duration-300">
            <div className="flex-1">
              <label htmlFor={`${fieldId}-ref`} className={labelClass}>Ref Schema</label>
              <select id={`${fieldId}-ref`} value={field.ref || ''} onChange={(e) => onUpdate(currentPath, { ref: e.target.value })} className={selectClass}>
                <option value="">Select</option>
                {schemas.map(s => <option key={s.cdm_uuid} value={s.cdm_name}>{s.cdm_name}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor={`${fieldId}-ref-field`} className={labelClass}>Ref Field</label>
              <input id={`${fieldId}-ref-field`} value={field.refField || ''} onChange={(e) => onUpdate(currentPath, { refField: e.target.value })} className={inputClass} placeholder="id" />
            </div>
          </div>
        )}
      </div>

      {isComplex && field.fields && field.fields.map((nestedField, nestedIndex) => (
        <FieldRow 
          key={nestedField.id}
          field={nestedField}
          index={nestedIndex}
          path={currentPath}
          onUpdate={onUpdate}
          onRemove={onRemove}
          onAddNested={onAddNested}
          isDark={isDark}
          schemas={schemas}
          level={level + 1}
        />
      ))}
    </div>
  );
};

export default FieldRow;
