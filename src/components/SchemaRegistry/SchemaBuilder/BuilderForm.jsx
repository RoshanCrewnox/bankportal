import React, { useMemo } from 'react';
import { Plus, Database, Info } from 'lucide-react';
import FieldRow from './FieldRow';
import MultiSelectDropdown from '../FieldsRegistry/MultiSelectDropdown';
import { getEnabledDomains, getAllEnabledSubdomains } from '../../../utils/domainConfig';

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

  const labelClass = `block text-xs tracking-wider font-semibold mb-1.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`;

  const handleToggle = (name, val) => {
    const current = Array.isArray(schema[name]) ? schema[name] : [];
    const updated = current.includes(val) 
      ? current.filter(v => v !== val) 
      : [...current, val];
    onUpdate({ ...schema, [name]: updated });
  };

  // Read enabled domains & subdomains from Domain Configuration (localStorage)
  const enabledDomains    = useMemo(() => getEnabledDomains(),    []);
  const enabledSubdomains = useMemo(() => getAllEnabledSubdomains(), []);

  const sectionClass = `relative p-8 rounded-3xl border transition-all duration-300 ${
    isDark 
      ? 'bg-[#2f3349]/50 border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.2)]' 
      : 'bg-white border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.04)]'
  }`;

  return (
    <div className="space-y-6">
      {/* Schema Information */}
      <div className={sectionClass}>
        <div className="flex items-center gap-3 mb-8">
          <div className={`p-2 rounded-xl ${isDark ? 'bg-primary-orange/20 text-primary-orange' : 'bg-primary-orange/10 text-primary-orange'}`}>
            <Info size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Schema Information</h3>
            <p className="text-xs text-gray-500 font-semibold tracking-widest">General Metadata</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4">
            <label htmlFor="schema-name" className={labelClass}>Schema Name</label>
            <input id="schema-name" name="cdm_name" value={schema.cdm_name} onChange={handleChange} className={inputClass} placeholder="e.g. Customer Profile" />
          </div>
          <div className="md:col-span-8">
             <label htmlFor="schema-desc" className={labelClass}>Description</label>
             <input id="schema-desc" name="desc" value={schema.desc} onChange={handleChange} className={inputClass} placeholder="Briefly describe the purpose of this schema..." />
          </div>
          
          <div className="md:col-span-3">
            <label htmlFor="schema-version" className={labelClass}>Version</label>
            <input id="schema-version" name="version" value={schema.version} onChange={handleChange} className={inputClass} placeholder="1.0.0" />
          </div>
          <div className="md:col-span-3">
            <label className={labelClass}>Domain</label>
            <MultiSelectDropdown 
              options={enabledDomains} 
              selected={schema.cdm_domain || []} 
              onToggle={(val) => handleToggle('cdm_domain', val)} 
              isDark={isDark} 
              placeholder="Select Domain" 
              itemType="Domain"
            />
          </div>
          <div className="md:col-span-3">
            <label className={labelClass}>Sub Domain</label>
            <MultiSelectDropdown 
              options={enabledSubdomains} 
              selected={schema.sub_domain || []} 
              onToggle={(val) => handleToggle('sub_domain', val)} 
              isDark={isDark} 
              placeholder="Select Sub Domain" 
              itemType="Sub Domain"
            />
          </div>
          <div className="md:col-span-3">
            <label htmlFor="schema-status" className={labelClass}>Status</label>
            <select id="schema-status" name="status" value={schema.status} onChange={handleChange} className={selectClass}>
              <option value="Draft">Draft</option>
              <option value="Active">Active</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fields Definition */}
      <div className={sectionClass}>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isDark ? 'bg-primary-orange/20 text-primary-orange' : 'bg-primary-orange/10 text-primary-orange'}`}>
              <Database size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Fields Definition</h3>
              <p className="text-xs text-gray-500 font-semibold tracking-widest">CDM Properties</p>
            </div>
          </div>
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
              key={field.id}
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
