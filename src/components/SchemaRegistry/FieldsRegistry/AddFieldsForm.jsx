import React, { useContext } from 'react';
import { Plus, ArrowLeft, Save, Trash2 } from 'lucide-react';
import Button from '../../common/Button';
import { ThemeContext } from '../../common/ThemeContext';
import { useAddFields } from '../../../hooks/SchemaRegistry/useAddFields';
import MultiSelectDropdown from './MultiSelectDropdown';

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
    handleFinalSave
  } = useAddFields(onSave);

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
          <p className="text-[10px] font-bold text-gray-500 mt-0.5 uppercase tracking-wide">Configure multi-field registration sources</p>
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
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block ml-1">Source CDM</label>
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
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block ml-1">
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
            className={`w-full py-4 border-2 border-dashed rounded-2xl transition-all flex items-center justify-center gap-2.5 text-[10px] font-bold uppercase tracking-wide ${
              isDark ? 'border-white/5 text-gray-500 hover:border-primary-orange/30 hover:bg-primary-orange/5 hover:text-primary-orange' : 'border-gray-200 text-gray-400 hover:border-primary-orange/20 hover:bg-primary-orange/5 hover:text-primary-orange'
            }`}
          >
            <Plus size={14} /> Add Source
          </button>
        </div>

        {queuedFields.length > 0 && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-6 space-y-4">
            <div className="flex items-baseline justify-between border-b pb-2 border-primary-orange/10 mx-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary-orange">Selected Fields</h3>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                {queuedFields.length} field{queuedFields.length > 1 ? 's' : ''} total
              </span>
            </div>

            <div className={`rounded-2xl border overflow-hidden ${isDark ? 'border-white/5 bg-white/2' : 'border-gray-100 bg-gray-50/10 shadow-inner'}`}>
              <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`${isDark ? 'bg-white/5' : 'bg-gray-50'} border-b border-gray-100 dark:border-white/5`}>
                      <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-wider text-gray-400">CDM Source</th>
                      <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-wider text-gray-400">Field Identifier</th>
                      <th className="px-6 py-4 text-[9px] font-bold uppercase tracking-wider text-gray-400 text-right">Data Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                    {queuedFields.map((q, i) => (
                      <tr key={i} className="text-[11px] group hover:bg-white/40 dark:hover:bg-white/2 transition-colors">
                        <td className="px-6 py-4 text-gray-400 dark:text-gray-400 font-bold uppercase tracking-tight w-1/3">{q.cdm}</td>
                        <td className="px-6 py-4 font-bold text-gray-800 dark:text-white uppercase tracking-wide">{q.field}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider text-[10px]">
                            {q.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`flex justify-end pt-6 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
        <Button 
          variant="primary" 
          icon={<Save size={16} />} 
          onClick={handleFinalSave}
          className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider shadow-[0_8px_20px_rgba(237,127,24,0.25)] hover:shadow-[0_12px_30px_rgba(237,127,24,0.35)] transition-all active:scale-95 rounded-xl"
          disabled={queuedFields.length === 0}
        >
          Register Selected Fields
        </Button>
      </div>
    </div>
  );
};

export default AddFieldsForm;
