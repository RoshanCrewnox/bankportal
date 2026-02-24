import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Search, Shield, Save, Activity, Lock, EyeOff, ShieldAlert, Check, ChevronDown, Filter, Info, User, Clock, AlertCircle } from 'lucide-react';
import { ThemeContext } from '../common/ThemeContext';
import CustomSelect from '../OpenBanking/CustomSelect';

const ACCESS_LEVELS = [
  { value: 'READ', label: 'Read Only', icon: Activity, color: 'text-green-500', bg: 'bg-green-500/10' },
  { value: 'MASKED', label: 'Masked', icon: EyeOff, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  { value: 'ENCRYPTED', label: 'Encrypted', icon: Lock, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { value: 'BLOCKED', label: 'Blocked', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10' }
];

const ProvisioningFieldsDrawer = ({ tpp, onClose }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [allFields, setAllFields] = useState([]);
  const [provisionedFields, setProvisionedFields] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState('All');

  useEffect(() => {
    const storedFields = JSON.parse(localStorage.getItem('CDM_FIELD_REGISTRY') || '[]');
    setAllFields(storedFields);

    const allProvisioning = JSON.parse(localStorage.getItem('TPP_FIELD_PROVISIONING') || '{}');
    const tppProvisioning = allProvisioning[tpp?.id] || [];
    setProvisionedFields(tppProvisioning);
  }, [tpp]);

  const groups = useMemo(() => {
    const set = new Set(['All']);
    allFields.forEach(f => { if (f.group_name) set.add(f.group_name); });
    return Array.from(set);
  }, [allFields]);

  const filteredFields = useMemo(() => {
    return allFields.filter(f => {
      const matchSearch = f.field_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         f.group_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchGroup = selectedGroup === 'All' || f.group_name === selectedGroup;
      return matchSearch && matchGroup;
    });
  }, [allFields, searchTerm, selectedGroup]);

  const handleToggleField = (field) => {
    const exists = provisionedFields.find(p => p.field_uuid === field.field_uuid);
    if (exists) {
      setProvisionedFields(provisionedFields.filter(p => p.field_uuid !== field.field_uuid));
    } else {
      setProvisionedFields([...provisionedFields, { 
        field_uuid: field.field_uuid, 
        enabled: true, 
        access_level: 'READ' 
      }]);
    }
  };

  const handleAccessChange = (fieldUuid, level) => {
    setProvisionedFields(provisionedFields.map(p => 
      p.field_uuid === fieldUuid ? { ...p, access_level: level } : p
    ));
    setOpenDropdownId(null);
  };

  const handleSave = () => {
    setIsSaving(true);
    const allProvisioning = JSON.parse(localStorage.getItem('TPP_FIELD_PROVISIONING') || '{}');
    allProvisioning[tpp.id] = provisionedFields;
    localStorage.setItem('TPP_FIELD_PROVISIONING', JSON.stringify(allProvisioning));
    
    setTimeout(() => {
      setIsSaving(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1e2132]">
      {/* Premium Header */}
      <div className={`p-8 border-b ${isDark ? 'border-white/5 bg-[#25293c]' : 'border-gray-100 bg-gray-50/50'}`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary-orange/20 flex items-center justify-center shadow-lg shadow-primary-orange/10 border border-primary-orange/20">
              <Shield className="w-7 h-7 text-primary-orange" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Field-Level Access Control</h3>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <User size={14} className="text-primary-orange" />
                  {tpp?.name}
                </span>
                <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                <span className="flex items-center gap-1.5 text-xs text-gray-400">
                   <Clock size={14} />
                   TPP ID: {tpp?.id}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">{provisionedFields.length} Fields Enabled</span>
          </div>
        </div>
      </div>

      {/* Modern Toolbar */}
      <div className={`p-6 space-y-4 border-b ${isDark ? 'border-white/5' : 'border-gray-50'}`}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search field registry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-[#25293c] border border-gray-100 dark:border-white/5 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary-orange/20 transition-all dark:text-white shadow-inner"
          />
        </div>

        {/* Group Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 mr-1">
            <Filter size={14} className="text-gray-400" />
          </div>
          {groups.map(group => (
            <button
              key={group}
              onClick={() => setSelectedGroup(group)}
              className={`px-4 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all border ${
                selectedGroup === group 
                  ? 'bg-primary-orange border-primary-orange text-white shadow-lg shadow-primary-orange/20 scale-105' 
                  : 'bg-white dark:bg-[#25293c] border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 hover:border-primary-orange/30'
              }`}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      {/* Premium Field Cards List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3 pb-32">
        {filteredFields.length > 0 ? (
          filteredFields.map((field) => {
            const config = provisionedFields.find(p => p.field_uuid === field.field_uuid);
            const isEnabled = !!config;
            const currentAccess = ACCESS_LEVELS.find(l => l.value === config?.access_level) || ACCESS_LEVELS[0];

            return (
              <div 
                key={field.field_uuid} 
                className={`group relative p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-6 ${
                  isEnabled 
                    ? 'bg-primary-orange/3 border-primary-orange/20 shadow-lg shadow-primary-orange/5' 
                    : 'bg-white dark:bg-[#25293c] border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900 dark:text-white truncate">{field.field_name}</span>
                    {isEnabled && <div className="p-0.5 rounded-full bg-green-500 ring-4 ring-green-500/10"><Check size={8} className="text-white" /></div>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] py-0.5 px-2 rounded bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">
                      {field.group_name || 'Uncategorized'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium truncate flex items-center gap-1">
                      <Info size={10} />
                      {field.type} • {field.cdm_name || 'Manual'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  {/* Access Level Controls */}
                  {isEnabled && (
                    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                      <div className={`p-2 rounded-xl ${currentAccess.bg} ${currentAccess.color} shadow-sm`}>
                        <currentAccess.icon size={18} />
                      </div>
                      <div className="w-44">
                        <CustomSelect 
                          value={currentAccess.label}
                          options={ACCESS_LEVELS.map(l => l.label)}
                          isOpen={openDropdownId === field.field_uuid}
                          onToggle={() => setOpenDropdownId(openDropdownId === field.field_uuid ? null : field.field_uuid)}
                          onChange={(label) => {
                            const found = ACCESS_LEVELS.find(l => l.label === label);
                            handleAccessChange(field.field_uuid, found.value);
                          }}
                          isDark={isDark}
                        />
                      </div>
                    </div>
                  )}

                  {/* High-End Toggle */}
                  <div className="flex flex-col items-center gap-1.5">
                    <button 
                      onClick={() => handleToggleField(field)}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ring-2 ring-inset ${
                        isEnabled ? 'bg-primary-orange ring-primary-orange/50 shadow-inner' : 'bg-gray-200 dark:bg-white/5 ring-gray-100 dark:ring-white/5'
                      }`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg transition-all duration-300 ${isEnabled ? 'left-7' : 'left-1'}`} />
                    </button>
                    <span className={`text-[8px] font-bold tracking-widest uppercase ${isEnabled ? 'text-primary-orange' : 'text-gray-400'}`}>
                      {isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-60">
            <div className="p-4 rounded-full bg-gray-100 dark:bg-white/5">
              <AlertCircle size={40} className="text-gray-400" />
            </div>
            <div>
              <p className="text-gray-900 dark:text-white font-bold">No fields found</p>
              <p className="text-gray-500 text-sm">Try adjusting your search or filters.</p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Footer */}
      <div className={`absolute bottom-0 left-0 right-0 p-8 pt-10 bg-linear-to-t ${isDark ? 'from-[#1e2132] via-[#1e2132] to-[#1e2132]/0' : 'from-white via-white to-white/0'} pointer-events-none`}>
        <div className="flex justify-end gap-3 pointer-events-auto">
          <button 
            onClick={onClose}
            className={`py-2 px-6 rounded-xl font-bold text-xs transition-all border ${
              isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-white border-gray-100 text-gray-600 hover:bg-gray-50'
            }`}
          >
            Discard Changes
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="py-2 px-6 rounded-xl bg-primary-orange text-white font-bold text-xs shadow-lg shadow-primary-orange/20 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Apply Access Rules
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProvisioningFieldsDrawer;
