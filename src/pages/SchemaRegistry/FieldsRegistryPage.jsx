import React, { useContext, useState, useReducer, useEffect, useMemo } from 'react';
import { Database, Plus, Search, Filter, Eye, Pencil, Layers } from 'lucide-react';
import { ThemeContext } from '../../components/common/ThemeContext';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import AddFieldsForm from '../../components/SchemaRegistry/FieldsRegistry/AddFieldsForm';
import FieldDetailsDrawer from '../../components/SchemaRegistry/FieldsRegistry/FieldDetailsDrawer';
import GroupingForm from '../../components/SchemaRegistry/FieldsRegistry/GroupingForm';

const initialDrawerState = { isOpen: false, selectedField: null, mode: 'view' };

function drawerReducer(state, action) {
  switch (action.type) {
    case 'OPEN':
      return { isOpen: true, selectedField: action.payload.field, mode: action.payload.mode };
    case 'CLOSE':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

const FieldsRegistryPage = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [view, setView] = useState('LIST');
  const [fields, setFields] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [drawerState, dispatchDrawer] = useReducer(drawerReducer, initialDrawerState);

  const loadFields = () => {
    const stored = JSON.parse(localStorage.getItem('CDM_FIELD_REGISTRY') || '[]');
    setFields(stored);
  };

  useEffect(() => {
    loadFields();
  }, []);

  const handleRegisterFields = (newFields) => {
    const existing = JSON.parse(localStorage.getItem('CDM_FIELD_REGISTRY') || '[]');
    const updated = [...existing];
    
    newFields.forEach(nf => {
      const idx = updated.findIndex(f => f.name === nf.field_name && f.cdm_uuid === nf.cdm_uuid);
      if (idx === -1) {
        updated.push(nf);
      }
    });

    localStorage.setItem('CDM_FIELD_REGISTRY', JSON.stringify(updated));
    setFields(updated);
    setView('LIST');
  };

  const handleUpdateField = (updatedField) => {
    const idx = fields.findIndex(f => f.field_uuid === updatedField.field_uuid);
    if (idx !== -1) {
      const newFields = [...fields];
      newFields[idx] = updatedField;
      localStorage.setItem('CDM_FIELD_REGISTRY', JSON.stringify(newFields));
      setFields(newFields);
    }
  };

  const handleApplyGroupConfig = ({ selectedFieldUuids, groupName, config }) => {
    const updatedFields = fields.map(field => {
      if (selectedFieldUuids.includes(field.field_uuid)) {
        return {
          ...field,
          ...config,
          group_name: groupName,
          status: 'Provisioned',
          updated_at: new Date().toISOString()
        };
      }
      return field;
    });

    localStorage.setItem('CDM_FIELD_REGISTRY', JSON.stringify(updatedFields));
    setFields(updatedFields);
    setView('LIST');
  };

  const filteredFields = useMemo(() => {
    return fields.filter(f => 
      f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.field_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.cdm_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [fields, searchTerm]);

  const headers = ['Field Name', 'Source CDM', 'Data Type', 'Status', 'Last Updated', 'Actions'];

  const renderRow = (item) => (
    <>
      <td className="px-6 py-4">
        <div className="font-medium text-gray-900 dark:text-white">{item.field_name || item.name}</div>
        <div className="text-[10px] text-gray-400 font-mono mt-0.5 opacity-60">ID: {item.field_uuid?.slice(0, 8) || 'PRE-REG'}</div>
      </td>
      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
        {item.cdm_name || 'Manual Entry'}
      </td>
      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
        <span className="px-2 py-1 rounded bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
          {item.type}
        </span>
      </td>
      <td className="px-6 py-4">
        {item.status === 'Provisioned' || item.status === 'Configured' ? (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-bold uppercase">
            Provisioned
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[10px] font-bold uppercase">
            Required Configuration
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 italic">
        {item.updatedAt || item.updated_at ? new Date(item.updatedAt || item.updated_at).toLocaleDateString() : 'N/A'}
      </td>
    </>
  );

  const openDrawer = (field, mode) => {
    dispatchDrawer({ type: 'OPEN', payload: { field, mode } });
  };

  const actions = [
    {
      icon: Eye,
      onClick: (item) => openDrawer(item, 'view'),
      title: "View Details",
      className: "text-gray-400 hover:text-blue-500"
    },
    {
      icon: Pencil,
      onClick: (item) => openDrawer(item, 'edit'),
      title: "Edit",
      className: "text-gray-400 hover:text-primary-orange"
    }
  ];

  if (view === 'ADD_FIELDS') {
    return (
      <div className="w-full">
        <AddFieldsForm onSave={handleRegisterFields} onCancel={() => setView('LIST')} />
      </div>
    );
  }

  if (view === 'GROUPING') {
    return (
      <div className="w-full">
        <GroupingForm 
          fields={fields} 
          onApply={handleApplyGroupConfig} 
          onCancel={() => setView('LIST')} 
        />
      </div>
    );
  }

  return (
    <div className={`space-y-6 animate-in fade-in duration-500 pb-10 ${isDark ? 'text-white' : 'text-gray-800'}`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Fields Registry</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage reusable data fields across your schema ecosystem.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border min-w-[280px] ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200 shadow-sm'}`}>
            <Search size={16} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by Name or Category" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full"
            />
          </div>
          <Button variant="secondary" icon={<Layers size={18} />} onClick={() => setView('GROUPING')}>
            Grouping
          </Button>
          <Button variant="primary" icon={<Plus size={18} />} onClick={() => setView('ADD_FIELDS')}>
            Add Fields
          </Button>
        </div>
      </div>

      {fields.length > 0 ? (
        <DataTable 
          headers={headers}
          data={filteredFields}
          renderRow={renderRow}
          actions={actions}
          emptyMessage="No fields match your search."
        />
      ) : (
        <div className={`mt-10 border rounded-xl p-20 flex flex-col items-center justify-center ${isDark ? 'border-white/5 bg-white/2' : 'border-gray-100 bg-gray-50/50'}`}>
           <div className="w-16 h-16 rounded-full bg-primary-orange/20 flex items-center justify-center mb-6">
              <Database size={32} className="text-primary-orange" />
           </div>
           <h2 className="text-xl font-bold mb-2">No Registered Fields Yet</h2>
           <p className="text-gray-500 text-sm max-w-sm text-center">Start registering common fields to ensure consistency across all your CDM schemas.</p>
        </div>
      )}

      <FieldDetailsDrawer 
        key={drawerState.selectedField?.field_uuid}
        isOpen={drawerState.isOpen}
        onClose={() => dispatchDrawer({ type: 'CLOSE' })}
        field={drawerState.selectedField}
        mode={drawerState.mode}
        onUpdate={handleUpdateField}
      />
    </div>
  );
};

export default FieldsRegistryPage;
