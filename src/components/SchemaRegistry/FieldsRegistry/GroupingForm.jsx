import React, { useState, useContext, useMemo } from 'react';
import { Save, Shield, FileText, Info, Layers, Check, ArrowLeft, Trash2, X } from 'lucide-react';
import Button from '../../common/Button';
import DataTable from '../../common/DataTable';
import { ThemeContext } from '../../common/ThemeContext';
import MultiSelectDropdown from './MultiSelectDropdown';

const SectionHeader = ({ icon: Icon, title, isDark }) => (
  <div className={`flex items-center gap-2 mb-4 mt-6 first:mt-0 pb-2 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
    <Icon size={14} className="text-primary-orange" />
    <span className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{title}</span>
  </div>
);

const GroupingForm = ({ fields, onApply, onCancel }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [groupName, setGroupName] = useState('');
  const [selectedFieldUuids, setSelectedFieldUuids] = useState([]);
  
  const [formData, setFormData] = useState({
    is_sensetive: false,
    is_masked: false,
    is_encrypted: false,
    is_required: false,
    data_type: 'string',
    clasification: 'Public',
    version: '1.0.0',
    desc: '',
    default_value: '',
    validation_rule: '',
    consent_scope: '',
    semantic_type: ''
  });

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    onApply({
      selectedFieldUuids,
      groupName,
      config: formData
    });
  };

  const inputClass = `w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-orange outline-none transition-all ${
    isDark ? 'bg-secondary-dark-bg/50 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900 shadow-sm'
  }`;
  const labelClass = `text-xs font-semibold tracking-wider block mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`;

  // Prepare options for MultiSelectDropdown
  const fieldOptions = useMemo(() => fields.map(f => f.field_name || f.name), [fields]);
  const selectedFields = useMemo(() => 
    fields.filter(f => selectedFieldUuids.includes(f.field_uuid)),
    [fields, selectedFieldUuids]
  );
  const selectedNames = useMemo(() => 
    selectedFields.map(f => f.field_name || f.name),
    [selectedFields]
  );

  const toggleField = (name) => {
    const field = fields.find(f => (f.field_name || f.name) === name);
    if (!field) return;
    
    setSelectedFieldUuids(prev => 
      prev.includes(field.field_uuid) 
        ? prev.filter(uuid => uuid !== field.field_uuid)
        : [...prev, field.field_uuid]
    );
  };

  const removeField = (uuid) => {
    setSelectedFieldUuids(prev => prev.filter(id => id !== uuid));
  };

  const tableHeaders = ['Field Name', 'Source CDM', 'Data Type', 'Action'];
  const renderRow = (item) => (
    <>
      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.field_name || item.name}</td>
      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">{item.cdm_name}</td>
      <td className="px-6 py-4">
        <span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
          {item.type || item.data_type}
        </span>
      </td>
    </>
  );

  const tableActions = [
    {
      icon: X,
      onClick: (item) => removeField(item.field_uuid),
      title: "Remove from Group",
      className: "text-red-400 hover:text-red-500"
    }
  ];

  return (
    <div className={`space-y-6 animate-in slide-in-from-right duration-300 w-full ${isDark ? 'text-white' : 'text-gray-800'}`}>
      <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
        <div>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white tracking-tight' : 'text-gray-900 tracking-tight'}`}>Bulk Field Grouping</h2>
          <p className="text-xs font-semibold text-gray-500 mt-0.5 tracking-wide">Apply common configuration to multiple fields</p>
        </div>
        <button onClick={onCancel} className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all text-xs font-bold ${
          isDark ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 shadow-sm'
        }`}>
          <ArrowLeft size={14} /> Back to Registry
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Selection & Table */}
        <div className="space-y-6">
          <section>
            <SectionHeader icon={Layers} title="Group Details & Field Selection" isDark={isDark} />
            <div className="space-y-4">
              <div>
                <label htmlFor="group-name" className={labelClass}>Group Name</label>
                <input 
                  id="group-name" 
                  value={groupName} 
                  onChange={(e) => setGroupName(e.target.value)}
                  className={inputClass} 
                  placeholder="e.g. Identity Fields Group"
                />
              </div>
              <div>
                <label className={labelClass}>Select Fields to Configure</label>
                <MultiSelectDropdown
                  options={fieldOptions}
                  selected={selectedNames}
                  onToggle={toggleField}
                  isDark={isDark}
                  placeholder="Search registered fields..."
                />
              </div>
            </div>
          </section>

          {selectedFields.length > 0 && (
            <section className="animate-in fade-in slide-in-from-top-2 duration-300">
              <SectionHeader icon={Info} title={`Selected Fields (${selectedFields.length})`} isDark={isDark} />
              <div className="max-h-[500px] overflow-y-auto">
                <DataTable 
                  headers={tableHeaders}
                  data={selectedFields}
                  renderRow={renderRow}
                  actions={tableActions}
                  emptyMessage="No fields selected"
                />
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Base Configuration */}
        <div className="space-y-6">
          <section className={`p-6 rounded-2xl border ${isDark ? 'bg-white/2 border-white/5' : 'bg-gray-50/50 border-gray-100'}`}>
            <SectionHeader icon={FileText} title="Common Configuration" isDark={isDark} />
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label htmlFor="data-type" className={labelClass}>Data Type</label>
                <select 
                  id="data-type"
                  value={formData.data_type} 
                  onChange={(e) => handleChange('data_type', e.target.value)}
                  className={inputClass}
                >
                  {['string', 'number', 'boolean', 'date', 'object', 'array'].map(t => (
                    <option key={t} value={t} className={isDark ? "bg-[#2f3349]" : ""}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label htmlFor="field-version" className={labelClass}>Version</label>
                <input 
                  id="field-version"
                  value={formData.version} 
                  onChange={(e) => handleChange('version', e.target.value)}
                  className={inputClass} 
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="group-description" className={labelClass}>Description</label>
                <textarea 
                  id="group-description"
                  rows={2}
                  value={formData.desc} 
                  onChange={(e) => handleChange('desc', e.target.value)}
                  className={`${inputClass} resize-none`}
                  placeholder="Describe the purpose of this group..."
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="default-value" className={labelClass}>Default Value</label>
                <input 
                  id="default-value"
                  value={formData.default_value} 
                  onChange={(e) => handleChange('default_value', e.target.value)}
                  className={inputClass} 
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="classification" className={labelClass}>Classification</label>
                <select 
                  id="classification"
                  value={formData.clasification} 
                  onChange={(e) => handleChange('clasification', e.target.value)}
                  className={inputClass}
                >
                  {['Public', 'Internal', 'Confidential', 'Restricted'].map(c => (
                    <option key={c} value={c} className={isDark ? "bg-[#2f3349]" : ""}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <SectionHeader icon={Shield} title="Security & Privacy" isDark={isDark} />
            <div className={`grid grid-cols-2 gap-4 p-4 rounded-xl border ${
              isDark ? 'bg-primary-orange/5 border-primary-orange/10' : 'bg-orange-50/30 border-orange-100'
            }`}>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.is_required} 
                    onChange={(e) => handleChange('is_required', e.target.checked)}
                    className="w-4 h-4 rounded text-primary-orange accent-primary-orange"
                  />
                  <span className="text-xs font-medium">Required</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.is_sensetive} 
                    onChange={(e) => handleChange('is_sensetive', e.target.checked)}
                    className="w-4 h-4 rounded text-primary-orange accent-primary-orange"
                  />
                  <span className="text-xs font-medium">Sensitive</span>
                </label>
              </div>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.is_masked} 
                    onChange={(e) => handleChange('is_masked', e.target.checked)}
                    className="w-4 h-4 rounded text-primary-orange accent-primary-orange"
                  />
                  <span className="text-xs font-medium">Masked</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={formData.is_encrypted} 
                    onChange={(e) => handleChange('is_encrypted', e.target.checked)}
                    className="w-4 h-4 rounded text-primary-orange accent-primary-orange"
                  />
                  <span className="text-xs font-medium">Encrypted</span>
                </label>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <label htmlFor="consent-scope" className={labelClass}>Consent Scope</label>
                <input 
                  id="consent-scope"
                  value={formData.consent_scope} 
                  onChange={(e) => handleChange('consent_scope', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. user:email_read"
                />
              </div>
              <div>
                <label htmlFor="semantic-type" className={labelClass}>Semantic Type</label>
                <input 
                  id="semantic-type"
                  value={formData.semantic_type} 
                  onChange={(e) => handleChange('semantic_type', e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Email Address, SSN"
                />
              </div>
            </div>

            <div className="mt-8">
              <Button 
                variant="primary" 
                icon={<Save size={18} />} 
                onClick={handleApply}
                className="w-full py-4 text-sm font-bold shadow-lg shadow-primary-orange/20"
                disabled={selectedFieldUuids.length === 0 || !groupName}
              >
                Register Group Configuration
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GroupingForm;
