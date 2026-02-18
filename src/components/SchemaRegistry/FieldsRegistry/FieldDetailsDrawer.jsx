import React, { useState, useEffect, useContext } from 'react';
import { Save, AlertCircle, Trash2, Shield, Lock, FileText, Info } from 'lucide-react';
import Drawer from '../../common/Drawer';
import Button from '../../common/Button';
import { ThemeContext } from '../../common/ThemeContext';

const FieldDetailsDrawer = ({ isOpen, onClose, field, mode = 'view', onUpdate }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [formData, setFormData] = useState({});
  const isEdit = mode === 'edit';

  useEffect(() => {
    if (field) {
      setFormData({
        ...field,
        is_sensetive: field.is_sensetive ?? false,
        is_masked: field.is_masked ?? false,
        is_encrypted: field.is_encrypted ?? false,
        is_required: field.is_required ?? field.required ?? false,
        data_type: field.data_type ?? field.type ?? 'string',
        clasification: field.clasification ?? 'Public',
        status: field.status ?? 'Required Configuration',
        version: field.version ?? '1.0.0'
      });
    }
  }, [field]);

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
  const labelClass = `text-[11px] font-bold uppercase tracking-wider block mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`;
  const SectionHeader = ({ icon: Icon, title }) => (
    <div className={`flex items-center gap-2 mb-4 mt-6 first:mt-0 pb-2 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
      <Icon size={14} className="text-primary-orange" />
      <span className={`text-xs font-bold uppercase ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{title}</span>
    </div>
  );

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`${isEdit ? 'Edit' : 'View'} Field Details`} width="800px">
      <div className={`p-6 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto custom-scrollbar ${isDark ? 'text-white' : 'text-gray-800'}`}>
        
        {/* Identity & Origin */}
        <section>
          <SectionHeader icon={Info} title="Identity & Context" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Field Name</label>
              <input value={formData.field_name || ''} readOnly className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Field UUID</label>
              <input value={formData.field_uuid || ''} readOnly className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>CDM Name</label>
              <input value={formData.cdm_name || ''} readOnly className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>CDM UUID</label>
              <input value={formData.cdm_uuid || ''} readOnly className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Field Path</label>
              <input 
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
          <SectionHeader icon={FileText} title="Core Configuration" />
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Data Type</label>
              <select 
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
              <label className={labelClass}>Version</label>
              <input 
                value={formData.version || ''} 
                onChange={(e) => handleChange('version', e.target.value)}
                readOnly={!isEdit} 
                className={inputClass} 
              />
            </div>
            <div className="col-span-3">
              <label className={labelClass}>Description</label>
              <textarea 
                rows={2}
                value={formData.desc || ''} 
                onChange={(e) => handleChange('desc', e.target.value)}
                readOnly={!isEdit} 
                className={`${inputClass} resize-none`}
                placeholder="Describe the purpose of this field..."
              />
            </div>
            <div>
              <label className={labelClass}>Default Value</label>
              <input 
                value={formData.default_value || ''} 
                onChange={(e) => handleChange('default_value', e.target.value)}
                readOnly={!isEdit} 
                className={inputClass} 
              />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Validation Rule (Regex)</label>
              <input 
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
          <SectionHeader icon={Shield} title="Security & Data Privacy" />
          <div className={`grid grid-cols-2 gap-6 p-4 rounded-xl border ${
            isDark ? 'bg-primary-orange/5 border-primary-orange/10' : 'bg-orange-50/30 border-orange-100'
          }`}>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={formData.is_required || false} 
                  onChange={(e) => handleChange('is_required', e.target.checked)}
                  disabled={!isEdit}
                  className={`w-4 h-4 rounded text-primary-orange accent-primary-orange ${isDark ? 'border-white/10' : 'border-gray-300'}`}
                />
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Mandatory / Required</span>
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
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={formData.is_masked || false} 
                  onChange={(e) => handleChange('is_masked', e.target.checked)}
                  disabled={!isEdit}
                  className={`w-4 h-4 rounded text-primary-orange accent-primary-orange ${isDark ? 'border-white/10' : 'border-gray-300'}`}
                />
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Masked (eg: ****1234)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={formData.is_encrypted || false} 
                  onChange={(e) => handleChange('is_encrypted', e.target.checked)}
                  disabled={!isEdit}
                  className={`w-4 h-4 rounded text-primary-orange accent-primary-orange ${isDark ? 'border-white/10' : 'border-gray-300'}`}
                />
                <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Encrypted at Rest</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label className={labelClass}>Classification</label>
              <select 
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
              <label className={labelClass}>Consent Scope</label>
              <input 
                value={formData.consent_scope || ''} 
                onChange={(e) => handleChange('consent_scope', e.target.value)}
                readOnly={!isEdit} 
                className={inputClass}
                placeholder="e.g. user:email_read"
              />
            </div>
            <div>
              <label className={labelClass}>Semantic Type</label>
              <input 
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
          <SectionHeader icon={Lock} title="Audit Metadata" />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Created At</label>
              <input value={formData.createdAt || formData.creteat_at || ''} readOnly className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Created By</label>
              <input value={formData.created_by || 'Current User'} readOnly className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Updated At</label>
              <input value={formData.updatedAt || formData.updated_at || ''} readOnly className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Updated By</label>
              <input value={formData.updated_by || 'Current User'} readOnly className={inputClass} />
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
