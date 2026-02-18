import React from 'react';
import { Plus, Trash2, Database, ShieldCheck, Tag, Info, Zap } from 'lucide-react';

const FIELD_TYPES = ['string', 'number', 'boolean', 'date', 'add reference', 'object', 'array'];

const FieldRow = ({ 
  field, 
  index, 
  path = [], 
  onUpdate, 
  onRemove, 
  onAddNested, 
  isDark, 
  schemas,
  level = 0 
}) => {
  const currentPath = [...path, index];
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
            <label className={labelClass}>Field Name</label>
            <input 
              value={field.name} 
              onChange={(e) => onUpdate(currentPath, { name: e.target.value })}
              className={inputClass} 
              placeholder="e.g. id"
            />
          </div>
          <div className="w-[180px]">
            <label className={labelClass}>Data Type</label>
            <select 
              value={field.type} 
              onChange={(e) => onUpdate(currentPath, { type: e.target.value })}
              className={selectClass}
            >
              {FIELD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {field.type === 'number' && (
            <>
              <div className="w-[100px]">
                <label className={labelClass}>Min</label>
                <input type="number" placeholder="Min" value={field.min ?? ''} onChange={(e) => onUpdate(currentPath, { min: e.target.valueAsNumber })} className={inputClass} />
              </div>
              <div className="w-[100px]">
                <label className={labelClass}>Max</label>
                <input type="number" placeholder="Max" value={field.max ?? ''} onChange={(e) => onUpdate(currentPath, { max: e.target.valueAsNumber })} className={inputClass} />
              </div>
            </>
          )}

          <div className="flex items-center gap-4 pb-2">
            <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
              <input 
                type="checkbox" 
                checked={field.required} 
                onChange={(e) => onUpdate(currentPath, { required: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary-orange focus:ring-primary-orange accent-primary-orange"
              />
              <span className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Req</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer whitespace-nowrap">
              <input 
                type="checkbox" 
                checked={field.unique} 
                onChange={(e) => onUpdate(currentPath, { unique: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary-orange focus:ring-primary-orange accent-primary-orange"
              />
              <span className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Uni</span>
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
              <label className={labelClass}>Ref Schema</label>
              <select value={field.ref || ''} onChange={(e) => onUpdate(currentPath, { ref: e.target.value })} className={selectClass}>
                <option value="">Select</option>
                {schemas.map(s => <option key={s.cdm_uuid} value={s.cdm_name}>{s.cdm_name}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className={labelClass}>Ref Field</label>
              <input value={field.refField || ''} onChange={(e) => onUpdate(currentPath, { refField: e.target.value })} className={inputClass} placeholder="id" />
            </div>
          </div>
        )}
      </div>

      {isComplex && field.fields && field.fields.map((nestedField, nestedIndex) => (
        <FieldRow 
          key={nestedIndex}
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

const BuilderForm = ({ 
  schema, 
  onUpdate, 
  fields, 
  onFieldUpdate, 
  onAddField, 
  onRemoveField, 
  isDark, 
  schemas 
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onUpdate({ ...schema, [name]: value });
  };

  const inputClass = `w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange/30 transition-all ${
    isDark ? 'bg-darkbg border-white/10 text-white placeholder:text-gray-600' : 'bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 shadow-sm'
  }`;

  const selectClass = `${inputClass} appearance-auto ${
    isDark ? '[&>option]:bg-[#2f3349] [&>option]:text-white' : ''
  }`;

  const labelClass = `block text-xs font-semibold mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`;

  const sectionClass = `p-6 rounded-2xl border ${isDark ? 'bg-white/2 border-white/5' : 'bg-white border-gray-200 shadow-md'}`;

  return (
    <div className="space-y-6">
      {/* Schema Information */}
      <div className={sectionClass}>
        <div className="flex items-center gap-3 mb-6">
           <h3 className="text-sm font-semibold">Schema Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <label className={labelClass}>Schema Name</label>
            <input name="cdm_name" value={schema.cdm_name} onChange={handleChange} className={inputClass} placeholder="e.g. Customer Profile" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>CDM ID</label>
            <input name="cdm_id" value={schema.cdm_id} onChange={handleChange} className={inputClass} placeholder="CDM-101" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Version</label>
            <input name="version" value={schema.version} onChange={handleChange} className={inputClass} placeholder="1.0.0" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Domain</label>
            <input name="cdm_domain" value={schema.cdm_domain} onChange={handleChange} className={inputClass} placeholder="Retail Banking" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Status</label>
            <select name="status" value={schema.status} onChange={handleChange} className={selectClass}>
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
            </select>
          </div>
          <div className="md:col-span-12">
             <label className={labelClass}>Description</label>
             <input name="desc" value={schema.desc} onChange={handleChange} className={inputClass} placeholder="Briefly describe the purpose of this schema..." />
          </div>
        </div>
      </div>

      {/* Fields Definition */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold">Fields Definition</h3>
          <button 
            onClick={() => onAddField()}
            className="flex items-center gap-2 px-4 py-1.5 bg-primary-orange text-white rounded-lg text-xs font-bold shadow-lg shadow-primary-orange/20 hover:brightness-110 active:scale-95 duration-200"
          >
            <Plus size={16} />
            Add Field
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <FieldRow 
              key={index}
              field={field}
              index={index}
              onUpdate={onFieldUpdate}
              onRemove={onRemoveField}
              onAddNested={onAddField}
              isDark={isDark}
              schemas={schemas}
            />
          ))}
          
          {fields.length === 0 && (
            <div className="text-center py-10 opacity-50 italic text-sm">
              No fields defined yet. Click "Add Field" to start.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuilderForm;
