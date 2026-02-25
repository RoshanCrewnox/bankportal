import React, { useContext, useState } from 'react';
import { Plus, ArrowLeft, Save, Trash2, Database } from 'lucide-react';
import Button from '../../common/Button';
import { ThemeContext } from '../../common/ThemeContext';
import { useAddFields } from '../../../hooks/SchemaRegistry/useAddFields';
import MultiSelectDropdown from './MultiSelectDropdown';
import CustomSelect from '../../OpenBanking/CustomSelect';
import { ChevronDown, Check, X } from 'lucide-react';

const AddFieldsForm = ({ onSave, onCancel }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const {
    schemas,
    selectedItems,
    queuedFields,
    handleAddMore,
    handleRemoveRow,
    handleCdmChange,
    toggleFieldSelection,
    handleFinalSave,
    existingGroups,
    bulkGroup,
    setBulkGroup,
    applyToAll,
    setApplyToAll,
    removeSpecificField,
    updateFieldGroup
  } = useAddFields(onSave);

  const [activeDropdown, setActiveDropdown] = useState(null); // 'bulk' or key like 'cdmUuid-fieldName'

  const selectClass = `w-full ${isDark ? 'bg-secondary-dark-bg/50 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900 shadow-sm'} border rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary-orange outline-none transition-all appearance-none cursor-pointer bg-[right_1rem_center] bg-no-repeat pr-12 ${
    isDark 
      ? 'bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2024%2024%27%20stroke%3D%27%239ca3af%27%3E%3Cpath%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%272%27%20d%3D%27M19%209l-7%207-7-7%27/%3E%3C/svg%3E")] bg-[length:1rem]' 
      : 'bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2024%2024%27%20stroke%3D%27%236b7280%27%3E%3Cpath%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%272%27%20d%3D%27M19%209l-7%207-7-7%27/%3E%3C/svg%3E")] bg-[length:1rem]'
  }`;

  return (
    <div className={`space-y-6 animate-in slide-in-from-right duration-300 w-full ${isDark ? 'text-white' : 'text-gray-800'}`}>
      <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
        <div>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white tracking-tight' : 'text-gray-900 tracking-tight'}`}>Register Fields from CDM</h2>
          <p className="text-xs font-semibold text-gray-500 mt-0.5 tracking-wide">Configure multi-field registration sources</p>
        </div>
        <button onClick={onCancel} className={`flex items-center gap-2 px-4 py-2 border rounded-xl transition-all text-xs font-bold ${
          isDark ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900 shadow-sm'
        }`}>
          <ArrowLeft size={14} /> Back
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          {selectedItems.map((item, index) => {
            const selectedCdmUuids = selectedItems.map(i => i.cdm_uuid).filter(u => u && u !== item.cdm_uuid);
            return (
              <div key={item.id} className={`flex flex-col md:flex-row gap-4 p-6 rounded-2xl border relative group transition-all ${
                isDark ? 'bg-secondary-dark-bg/40 border-white/5 hover:border-white/10' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
              }`}>
                <div className="flex-1 space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 tracking-wider block ml-1">Source CDM</label>
                  <select 
                    value={item.cdm_uuid} 
                    onChange={(e) => handleCdmChange(index, e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select Schema...</option>
                    {schemas.map(s => (
                      <option 
                        key={s.cdm_uuid} 
                        value={s.cdm_uuid} 
                        disabled={selectedCdmUuids.includes(s.cdm_uuid)}
                        className={isDark ? "bg-[#2f3349]" : ""}
                      >
                        {s.cdm_name} (v{s.version})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-2 space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 tracking-wider block ml-1">
                    Select Fields {item.field_names.length > 0 && `(${item.field_names.length})`}
                  </label>
                  <MultiSelectDropdown
                    options={item.fieldsList}
                    selected={item.field_names}
                    onToggle={(f) => toggleFieldSelection(index, f)}
                    isDark={isDark}
                    placeholder={!item.cdm_uuid ? "Select CDM first..." : "Choose fields..."}
                  />
                </div>

                <div className="pt-5">
                  {selectedItems.length > 1 && (
                    <button 
                      onClick={() => handleRemoveRow(index)}
                      className={`p-3 rounded-xl transition-all ${
                        isDark ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-500 hover:bg-red-100'
                      }`}
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          
          <button 
            onClick={handleAddMore}
            className={`w-full py-4 border-2 border-dashed rounded-2xl transition-all flex items-center justify-center gap-2.5 text-xs font-semibold tracking-wide ${
              isDark ? 'border-white/5 text-gray-500 hover:border-primary-orange/30 hover:bg-primary-orange/5 hover:text-primary-orange' : 'border-gray-200 text-gray-400 hover:border-primary-orange/20 hover:bg-primary-orange/5 hover:text-primary-orange'
            }`}
          >
            <Plus size={14} /> Add Source
          </button>
        </div>

        {queuedFields.length > 0 && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-6 space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b pb-5 border-white/5 mx-1">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-primary-orange/20 text-primary-orange' : 'bg-orange-50 text-primary-orange'}`}>
                  <Database size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight text-white">Registration Queue</h3>
                   <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      {queuedFields.length} field{queuedFields.length > 1 ? 's' : ''} total
                    </span>
                    <span className="w-1 h-1 rounded-full bg-gray-600" />
                    <span className="text-[10px] font-medium text-primary-orange italic">Ready to provision</span>
                  </div>
                </div>
              </div>

              {/* Enhanced Bulk Grouping Section */}
              <div className={`px-5 py-3 rounded-2xl border flex items-center gap-6 transition-all ${isDark ? 'bg-white/3 border-white/5' : 'bg-gray-50/80 border-gray-200 shadow-sm'}`}>
                <div className="flex items-center gap-3 border-r pr-6 border-white/10">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2">Bulk Actions</span>
                  <div 
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all cursor-pointer select-none ${applyToAll ? 'border-primary-orange bg-primary-orange/10' : 'border-white/5 bg-white/5'}`} 
                    onClick={() => setApplyToAll(!applyToAll)}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${applyToAll ? 'bg-primary-orange border-primary-orange' : 'border-gray-600'}`}>
                      {applyToAll && <Check size={12} className="text-white" />}
                    </div>
                    <span className={`text-[11px] font-bold ${applyToAll ? 'text-primary-orange' : 'text-gray-400'}`}>Apply to all</span>
                  </div>
                </div>

                <div className="w-56">
                   <CustomSelect 
                      value={bulkGroup || "Set global group..."}
                      options={existingGroups}
                      onChange={setBulkGroup}
                      isOpen={activeDropdown === 'bulk'}
                      onToggle={() => setActiveDropdown(activeDropdown === 'bulk' ? null : 'bulk')}
                      disabled={!applyToAll}
                      isDark={isDark}
                   />
                </div>
              </div>
            </div>

            <div className={`rounded-3xl border ${isDark ? 'border-white/5 bg-white/2' : 'border-gray-100 bg-white shadow-lg'}`}>
              <div className="max-h-[500px] overflow-y-auto custom-scrollbar min-h-[300px] pb-32">
                <table className="w-full text-left border-separate border-spacing-0">
                  <thead className="sticky top-0 z-20">
                    <tr className={`${isDark ? 'bg-[#1e2235]' : 'bg-gray-50'} border-b border-white/5`}>
                      <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">CDM Source</th>
                      <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">Field Identifier</th>
                      <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">Type</th>
                      <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase">Category / Group</th>
                      <th className="px-8 py-5 text-[10px] font-black tracking-[0.2em] text-gray-500 uppercase text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/3">
                    {queuedFields.map((q, i) => {
                      const isActiveRow = activeDropdown === q.id;
                      return (
                        <tr key={i} className={`group hover:bg-white/4 transition-all duration-300 relative ${isActiveRow ? 'z-50' : 'z-0'}`}>
                          <td className="px-8 py-5 bg-inherit">
                            <span className="text-xs font-bold text-gray-400 dark:text-gray-500 tracking-tight">{q.cdm}</span>
                          </td>
                          <td className="px-8 py-5 bg-inherit">
                            <div className="flex items-center gap-2">
                               <div className="w-1.5 h-1.5 rounded-full bg-primary-orange/50 mt-0.5" />
                               <span className="text-sm font-bold text-gray-800 dark:text-gray-200 tracking-wide">{q.field}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 bg-inherit">
                            <span className="font-bold text-blue-500/80 dark:text-blue-400/80 tracking-widest text-[9px] uppercase px-2.5 py-1 rounded-md bg-blue-500/5 border border-blue-500/10">
                              {q.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 w-64 bg-inherit">
                            <div className={`p-1 rounded-xl transition-all ${applyToAll ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
                              <CustomSelect 
                                value={q.group || "Assign Category..."}
                                options={existingGroups}
                                onChange={(val) => updateFieldGroup(q.cdm_uuid, q.field, val)}
                                isOpen={activeDropdown === q.id}
                                onToggle={() => setActiveDropdown(activeDropdown === q.id ? null : q.id)}
                                disabled={applyToAll}
                                isDark={isDark}
                              />
                            </div>
                          </td>
                          <td className="px-8 py-5 text-center bg-inherit">
                            <button 
                              onClick={() => removeSpecificField(q.cdm_uuid, q.field)}
                              className={`p-2.5 rounded-xl transition-all flex items-center justify-center mx-auto ${
                                isDark 
                                  ? 'text-gray-600 hover:text-red-400 hover:bg-red-400/10' 
                                  : 'text-gray-300 hover:text-red-500 hover:bg-red-50'
                              }`}
                              title="Remove from registration"
                            >
                              <X size={18} className="transition-transform group-hover:scale-110" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`flex justify-end pt-8 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
        <Button 
          variant="primary" 
          size="lg"
          icon={<Save size={18} />} 
          onClick={handleFinalSave}
          className="px-10 py-4 text-xs font-black uppercase tracking-[0.15em] shadow-[0_12px_40px_rgba(237,127,24,0.3)] hover:shadow-[0_15px_45px_rgba(237,127,24,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 rounded-2xl"
          disabled={queuedFields.length === 0}
        >
          Provision Selected Fields
        </Button>
      </div>
    </div>
  );
};

export default AddFieldsForm;
