import React, { useState, useContext, useMemo } from 'react';
import { Save, AlertCircle, Trash2, Shield, Lock, FileText, Info } from 'lucide-react';
import Drawer from '../../common/Drawer';
import Button from '../../common/Button';
import { ThemeContext } from '../../common/ThemeContext';
import CustomSelect from '../../OpenBanking/CustomSelect';
import { MASKING_ALGORITHMS } from '../../../utils/maskingConstants';

const SectionHeader = ({ icon: Icon, title, isDark }) => (
  <div className={`flex items-center gap-2 mb-4 mt-6 first:mt-0 pb-2 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
    <Icon size={14} className="text-primary-orange" />
    <span className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{title}</span>
  </div>
);

const FieldDetailsDrawer = ({ isOpen, onClose, field, mode = 'view', onUpdate }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [formData, setFormData] = useState(() => field ? {
    ...field,
    masking_algo: field.masking_algo || '',
    encryption_algo: field.encryption_algo || '',
    is_sensetive: field.is_sensetive ?? false,
    is_required: field.is_required ?? field.required ?? false,
    data_type: field.data_type ?? field.type ?? 'string',
    clasification: field.clasification ?? 'Public',
    status: field.status ?? 'Required Configuration',
    version: field.version ?? '1.0.0'
  } : {});
  const [activeDropdown, setActiveDropdown] = useState(null); // 'masking' or 'encryption'
  const isEdit = mode === 'edit';

  const maskingOptions = useMemo(() => MASKING_ALGORITHMS.filter(a => a.type === 'Masking' || a.type === 'Hashing'), []);
  const encryptionOptions = useMemo(() => MASKING_ALGORITHMS.filter(a => a.type === 'Encryption'), []);

  const getAlgoName = (id) => MASKING_ALGORITHMS.find(a => a.id === id)?.name || id;

  const handleChange = (key, value) => {
    if (!isEdit) return;
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onUpdate({
      ...formData,
      status: 'Provisioned',
      updated_at: new Date().toISOString()
    });
    onClose();
  };

  const inputClass = `w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary-orange outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
    isDark ? 'bg-secondary-dark-bg/50 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900 shadow-sm'
  }`;
  const labelClass = `text-xs font-semibold tracking-wider block mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`;

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`${isEdit ? 'Edit' : 'View'} Field Details`} width="800px">
      <div className={`p-6 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar ${isDark ? 'text-white' : 'text-gray-800'}`}>
        
        {/* Identity & Origin */}
        <section>
          <SectionHeader icon={Info} title="Identity & Context" isDark={isDark} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="field-name" className={labelClass}>Field Name</label>
              <input 
                id="field-name" 
                value={formData.field_name || ''} 
                onChange={(e) => handleChange('field_name', e.target.value)}
                readOnly={!isEdit} 
                className={inputClass} 
              />
            </div>
            <div>
              <label htmlFor="cdm-name" className={labelClass}>CDM Name</label>
              <input 
                id="cdm-name" 
                value={formData.cdm_name || ''} 
                onChange={(e) => handleChange('cdm_name', e.target.value)}
                readOnly={!isEdit} 
                className={inputClass} 
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="field-path" className={labelClass}>Field Path</label>
              <input 
                id="field-path"
                value={formData.field_path || ''} 
                onChange={(e) => handleChange('field_path', e.target.value)}
                readOnly={!isEdit} 
                className={inputClass} 
                placeholder="e.g. user.profile.email"
              />
            </div>
          </div>
        </section>

        {/* Core Configuration */}
        <section>
          <SectionHeader icon={FileText} title="Core Configuration" isDark={isDark} />
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="data-type" className={labelClass}>Data Type</label>
              <select 
                id="data-type"
                value={formData.data_type || ''} 
                onChange={(e) => handleChange('data_type', e.target.value)}
                disabled={!isEdit} 
                className={inputClass}
              >
                {['string', 'number', 'boolean', 'date', 'object', 'array'].map(t => (
                  <option key={t} value={t} className={isDark ? "bg-[#2f3349]" : ""}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="field-version" className={labelClass}>Version</label>
              <input 
                id="field-version"
                value={formData.version || ''} 
                onChange={(e) => handleChange('version', e.target.value)}
                readOnly={!isEdit} 
                className={inputClass} 
              />
            </div>
            <div className="col-span-3">
              <label htmlFor="field-description" className={labelClass}>Description</label>
              <textarea 
                id="field-description"
                rows={2}
                value={formData.desc || ''} 
                onChange={(e) => handleChange('desc', e.target.value)}
                readOnly={!isEdit} 
                className={`${inputClass} resize-none`}
                placeholder="Describe the purpose of this field..."
              />
            </div>
            <div>
              <label htmlFor="default-value" className={labelClass}>Default Value</label>
              <input 
                id="default-value"
                value={formData.default_value || ''} 
                onChange={(e) => handleChange('default_value', e.target.value)}
                readOnly={!isEdit} 
                className={inputClass} 
              />
            </div>
            <div className="col-span-2">
              <label htmlFor="validation-rule" className={labelClass}>Validation Rule (Regex)</label>
              <input 
                id="validation-rule"
                value={formData.validation_rule || ''} 
                onChange={(e) => handleChange('validation_rule', e.target.value)}
                readOnly={!isEdit} 
                className={inputClass}
                placeholder="e.g. ^[a-zA-Z0-9]+$"
              />
            </div>
          </div>
        </section>

        {/* Security & Data Privacy */}
        <section>
          <SectionHeader icon={Shield} title="Security & Data Privacy" isDark={isDark} />
          <div className={`p-6 rounded-2xl border space-y-6 ${
            isDark ? 'bg-primary-orange/5 border-primary-orange/10' : 'bg-orange-50/30 border-orange-100'
          }`}>
            {/* Checkbox row */}
            <div className="flex items-center gap-12">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={formData.is_required || false} 
                  onChange={(e) => handleChange('is_required', e.target.checked)}
                  disabled={!isEdit}
                  className={`w-4 h-4 rounded text-primary-orange accent-primary-orange ${isDark ? 'border-white/10' : 'border-gray-300'}`}
                />
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Mandatory Field</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={formData.is_sensetive || false} 
                  onChange={(e) => handleChange('is_sensetive', e.target.checked)}
                  disabled={!isEdit}
                  className={`w-4 h-4 rounded text-primary-orange accent-primary-orange ${isDark ? 'border-white/10' : 'border-gray-300'}`}
                />
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>PII / Sensitive Data</span>
              </label>
            </div>

            {/* Dropdown row */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t dark:border-white/5 border-gray-100">
              <div>
                <label className={labelClass}>Masking Policy</label>
                {isEdit ? (
                  <CustomSelect 
                    value={getAlgoName(formData.masking_algo) || "Not Masked"}
                    options={["Not Masked", ...maskingOptions.map(a => a.name)]}
                    onChange={(name) => {
                      const algo = maskingOptions.find(a => a.name === name);
                      handleChange('masking_algo', algo ? algo.id : '');
                    }}
                    isOpen={activeDropdown === 'masking'}
                    onToggle={() => setActiveDropdown(activeDropdown === 'masking' ? null : 'masking')}
                    isDark={isDark}
                  />
                ) : (
                  <div className={inputClass}>{getAlgoName(formData.masking_algo) || "None"}</div>
                )}
              </div>
              <div>
                <label className={labelClass}>Encryption Policy</label>
                {isEdit ? (
                  <CustomSelect 
                    value={getAlgoName(formData.encryption_algo) || "Not Encrypted"}
                    options={["Not Encrypted", ...encryptionOptions.map(a => a.name)]}
                    onChange={(name) => {
                      const algo = encryptionOptions.find(a => a.name === name);
                      handleChange('encryption_algo', algo ? algo.id : '');
                    }}
                    isOpen={activeDropdown === 'encryption'}
                    onToggle={() => setActiveDropdown(activeDropdown === 'encryption' ? null : 'encryption')}
                    isDark={isDark}
                  />
                ) : (
                  <div className={inputClass}>{getAlgoName(formData.encryption_algo) || "None"}</div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="classification" className={labelClass}>Classification</label>
              <select 
                id="classification"
                value={formData.clasification || ''} 
                onChange={(e) => handleChange('clasification', e.target.value)}
                disabled={!isEdit} 
                className={inputClass}
              >
                {['Public', 'Internal', 'Confidential', 'Restricted'].map(c => (
                  <option key={c} value={c} className={isDark ? "bg-[#2f3349]" : ""}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="consent-scope" className={labelClass}>Consent Scope</label>
              <input 
                id="consent-scope"
                value={formData.consent_scope || ''} 
                onChange={(e) => handleChange('consent_scope', e.target.value)}
                readOnly={!isEdit} 
                className={inputClass}
                placeholder="e.g. user:email_read"
              />
            </div>
            <div>
              <label htmlFor="semantic-type" className={labelClass}>Semantic Type</label>
              <input 
                id="semantic-type"
                value={formData.semantic_type || ''} 
                onChange={(e) => handleChange('semantic_type', e.target.value)}
                readOnly={!isEdit} 
                className={inputClass}
                placeholder="e.g. Email Address, SSN"
              />
            </div>
          </div>
        </section>

        {/* Audit Metadata */}
        <section className={`opacity-60 transition-all ${isDark ? 'grayscale-[0.5]' : 'grayscale-0'}`}>
          <SectionHeader icon={Lock} title="Audit Metadata" isDark={isDark} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="created-at" className={labelClass}>Created At</label>
              <input id="created-at" value={formData.createdAt || formData.creteat_at || ''} readOnly className={inputClass} />
            </div>
            <div>
              <label htmlFor="created-by" className={labelClass}>Created By</label>
              <input id="created-by" value={formData.created_by || 'Current User'} readOnly className={inputClass} />
            </div>
            <div>
              <label htmlFor="updated-at" className={labelClass}>Updated At</label>
              <input id="updated-at" value={formData.updatedAt || formData.updated_at || ''} readOnly className={inputClass} />
            </div>
            <div>
              <label htmlFor="updated-by" className={labelClass}>Updated By</label>
              <input id="updated-by" value={formData.updated_by || 'Current User'} readOnly className={inputClass} />
            </div>
          </div>
        </section>

        {isEdit && (
          <div className={`flex justify-end pt-6 border-t gap-3 ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
             <Button variant="ghost" onClick={onClose}>Cancel</Button>
             <Button variant="primary" icon={<Save size={16} />} onClick={handleSave}>Update configuration</Button>
          </div>
        )}
      </div>
    </Drawer>
  );
};

export default FieldDetailsDrawer;
