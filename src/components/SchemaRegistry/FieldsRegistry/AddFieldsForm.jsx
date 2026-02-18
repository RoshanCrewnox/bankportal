import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Plus, X, ArrowLeft, Save } from 'lucide-react';
import Button from '../../common/Button';
import { ThemeContext } from '../../common/ThemeContext';

const AddFieldsForm = ({ onSave, onCancel }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [schemas, setSchemas] = useState([]);
  const [selectedItems, setSelectedItems] = useState([{ cdm_uuid: '', field_name: '', fieldsList: [] }]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('schema_registry_schemas') || '[]');
    setSchemas(stored.map(s => ({
      ...s,
      parsedFields: JSON.parse(s.cdm_defination || '{}').properties || {}
    })));
  }, []);

  const handleAddMore = () => {
    setSelectedItems([...selectedItems, { cdm_uuid: '', field_name: '', fieldsList: [] }]);
  };

  const handleRemove = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleCdmChange = (index, uuid) => {
    const schema = schemas.find(s => s.cdm_uuid === uuid);
    const fields = schema ? Object.keys(schema.parsedFields) : [];
    
    const newItems = [...selectedItems];
    newItems[index] = { cdm_uuid: uuid, field_name: '', fieldsList: fields };
    setSelectedItems(newItems);
  };

  const handleFieldChange = (index, fieldName) => {
    const newItems = [...selectedItems];
    newItems[index].field_name = fieldName;
    setSelectedItems(newItems);
  };

  const handleFinalSave = () => {
    const validItems = selectedItems.filter(item => item.cdm_uuid && item.field_name);
    if (validItems.length === 0) return;

    const fieldsToRegister = validItems.map(item => {
      const schema = schemas.find(s => s.cdm_uuid === item.cdm_uuid);
      const fieldData = schema.parsedFields[item.field_name];
      
      return {
        field_uuid: crypto.randomUUID(),
        cdm_uuid: item.cdm_uuid,
        cdm_name: schema.cdm_name,
        field_name: item.field_name,
        type: fieldData.type,
        status: 'Required Configuration',
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };
    });

    onSave(fieldsToRegister);
  };

  const selectClass = `w-full ${isDark ? 'bg-secondary-dark-bg/50 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900 shadow-sm'} border rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary-orange outline-none transition-all appearance-none cursor-pointer bg-[right_0.75rem_center] bg-no-repeat pr-10 ${
    isDark 
      ? 'bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2024%2024%27%20stroke%3D%27%239ca3af%27%3E%3Cpath%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%272%27%20d%3D%27M19%209l-7%207-7-7%27/%3E%3C/svg%3E")] bg-[length:1rem]' 
      : 'bg-[url("data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20fill%3D%27none%27%20viewBox%3D%270%200%2024%2024%27%20stroke%3D%27%236b7280%27%3E%3Cpath%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%20stroke-width%3D%272%27%20d%3D%27M19%209l-7%207-7-7%27/%3E%3C/svg%3E")] bg-[length:1rem]'
  }`;

  return (
    <div className={`space-y-6 animate-in slide-in-from-right duration-300 w-full ${isDark ? 'text-white' : 'text-gray-800'}`}>
      <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
        <div>
          <h2 className={`text-xl font-bold ${isDark ? 'bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent' : 'text-gray-900'}`}>Register Fields from CDM</h2>
          <p className="text-xs text-gray-500 mt-1">Select and configure multiple fields from existing schemas.</p>
        </div>
        <button onClick={onCancel} className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all text-sm font-medium ${
          isDark ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}>
          <ArrowLeft size={16} /> Back to Registry
        </button>
      </div>

      <div className="space-y-4">
        {selectedItems.map((item, index) => (
          <div key={index} className={`flex items-end gap-6 p-6 rounded-xl border relative group transition-colors ${
            isDark ? 'bg-secondary-dark-bg/40 border-white/5 hover:border-white/10' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
          }`}>
            <div className="flex-1 space-y-2.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block ml-1">Select CDM</label>
              <select 
                value={item.cdm_uuid} 
                onChange={(e) => handleCdmChange(index, e.target.value)}
                className={selectClass}
              >
                <option value="">Choose CDM...</option>
                {schemas.map(s => (
                  <option key={s.cdm_uuid} value={s.cdm_uuid} className={isDark ? "bg-[#2f3349]" : ""}>{s.cdm_name} (v{s.version})</option>
                ))}
              </select>
            </div>

            <div className="flex-1 space-y-2.5">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block ml-1">Select Field</label>
              <select 
                disabled={!item.cdm_uuid}
                value={item.field_name}
                onChange={(e) => handleFieldChange(index, e.target.value)}
                className={selectClass}
              >
                <option value="">Choose Field...</option>
                {item.fieldsList.map(f => (
                  <option key={f} value={f} className={isDark ? "bg-[#2f3349]" : ""}>{f}</option>
                ))}
              </select>
            </div>

            {selectedItems.length > 1 && (
              <button 
                onClick={() => handleRemove(index)}
                className={`p-2.5 rounded-lg transition-all mb-0.5 ${
                  isDark ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-500 hover:bg-red-100'
                }`}
                title="Remove Selection"
              >
                <X size={18} />
              </button>
            )}
          </div>
        ))}

        <button 
          onClick={handleAddMore}
          className={`w-full py-4 border-2 border-dashed rounded-xl transition-all flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-wider ${
            isDark ? 'border-white/5 text-gray-500 hover:border-primary-orange/30 hover:bg-primary-orange/5 hover:text-primary-orange' : 'border-gray-200 text-gray-400 hover:border-primary-orange/20 hover:bg-primary-orange/5 hover:text-primary-orange'
          }`}
        >
          <Plus size={16} /> Add more field
        </button>
      </div>

      <div className={`flex justify-end pt-6 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
        <Button 
          variant="primary" 
          icon={<Save size={18} />} 
          onClick={handleFinalSave}
          className="px-8 py-6 text-base shadow-lg shadow-primary-orange/20"
          disabled={!selectedItems.some(i => i.cdm_uuid && i.field_name)}
        >
          Register Selected Fields
        </Button>
      </div>
    </div>
  );
};

export default AddFieldsForm;
