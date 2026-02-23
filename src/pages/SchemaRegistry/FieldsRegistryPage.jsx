import React, { useContext, useState, useReducer, useEffect, useMemo, useRef } from 'react';
import { Database, Plus, Search, Filter, Eye, Pencil, Layers, FolderPlus, Save, X } from 'lucide-react';
import { ThemeContext } from '../../components/common/ThemeContext';
import Button from '../../components/common/Button';
import DataTable from '../../components/common/DataTable';
import AddFieldsForm from '../../components/SchemaRegistry/FieldsRegistry/AddFieldsForm';
import FieldDetailsDrawer from '../../components/SchemaRegistry/FieldsRegistry/FieldDetailsDrawer';
import GroupingForm from '../../components/SchemaRegistry/FieldsRegistry/GroupingForm';
import CustomSelect from '../../components/OpenBanking/CustomSelect';

const initialDrawerState = { isOpen: false, selectedField: null, mode: 'view' };

function drawerReducer(state, action) {
  switch (action.type) {
    case 'OPEN':
      return { isOpen: true, selectedField: action.payload.field, mode: action.payload.mode };
    case 'CLOSE':
      return { ...state, isOpen: false };
    case 'TOGGLE_INNER':
      return { ...state, internalDropdown: state.internalDropdown === action.id ? null : action.id };
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
  
  // Popover state for individual field grouping
  const [groupPopover, setGroupPopover] = useState({ isOpen: false, field: null, position: { top: 0, left: 0 } });
  const [selectedTempGroup, setSelectedTempGroup] = useState('');
  const [isSavingGroup, setIsSavingGroup] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target)) {
        setGroupPopover({ isOpen: false, field: null });
      }
    };
    if (groupPopover.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [groupPopover.isOpen]);

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

  const assignFieldToGroup = (field, groupName) => {
    setIsSavingGroup(true);
    const updatedFields = fields.map(f => 
      f.field_uuid === field.field_uuid 
        ? { ...f, group_name: groupName, status: 'Provisioned', updated_at: new Date().toISOString() } 
        : f
    );
    localStorage.setItem('CDM_FIELD_REGISTRY', JSON.stringify(updatedFields));
    setFields(updatedFields);
    setGroupPopover({ isOpen: false, field: null });
    setIsSavingGroup(false);
  };

  const existingGroups = useMemo(() => {
    const DEFAULT_GROUPS = ['Identity Fields', 'Financial Data', 'Technical Metadata', 'Regulatory & Compliance', 'Customer Profile'];
    const groups = new Set(DEFAULT_GROUPS);
    fields.forEach(f => {
      if (f.group_name) groups.add(f.group_name);
    });
    return Array.from(groups);
  }, [fields]);

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

  const headers = [
    { label: 'Field Name', key: 'field_name' }, 
    { label: 'Source CDM', key: 'cdm_name' }, 
    { label: 'Data Type', key: 'type' }, 
    { label: 'Status', key: 'status' }, 
    { label: 'Version', key: 'version' },
    { label: 'Created By', key: 'created_by' },
    { label: 'Created At', key: 'created_at' },
    { label: 'Last Updated', key: 'updated_at' }, 
    { label: 'Actions', key: null }
  ];

  const renderRow = (item) => {
    const isThisGroupOpen = groupPopover.isOpen && groupPopover.field?.field_uuid === item.field_uuid;
    
    return (
      <>
        <td className="px-6 py-4">
          <div className="font-medium text-gray-900 dark:text-white">{item.field_name || item.name}</div>
          {item.group_name && (
            <div className="mt-1">
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${isDark ? 'bg-primary-orange/10 border-primary-orange/20 text-primary-orange' : 'bg-orange-50 border-orange-100 text-primary-orange'}`}>
                {item.group_name}
              </span>
            </div>
          )}
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
        <td className="px-6 py-4">
          <span className="text-xs text-gray-400 font-mono italic">
            {item.version || 'v1.0.0'}
          </span>
        </td>
        <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
          {item.created_by || 'Admin'}
        </td>
        <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400">
          {item.created_at || (item.updated_at ? new Date(item.updated_at).toLocaleDateString() : '2/23/2026')}
        </td>
        <td className="px-6 py-4 text-xs text-gray-500 dark:text-gray-400 relative">
          {item.updated_at ? new Date(item.updated_at).toLocaleDateString() : '2/23/2026'}
          {isThisGroupOpen && (
            <div 
              ref={popoverRef}
              className="absolute top-12 right-0 w-80 bg-white dark:bg-secondary-dark-bg border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl p-6 space-y-6 z-100 animate-in fade-in zoom-in duration-200 text-left not-italic"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-primary-orange uppercase tracking-widest">Assign to Group</span>
                <button onClick={() => setGroupPopover({ isOpen: false, field: null })} className="text-gray-400 hover:text-red-500 transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-6">
                <CustomSelect 
                  label="Select Category"
                  value={selectedTempGroup || item.group_name || 'Choose a group'}
                  options={existingGroups}
                  isOpen={drawerState.internalDropdown === item.field_uuid}
                  onToggle={() => dispatchDrawer({ type: 'TOGGLE_INNER', id: item.field_uuid })}
                  onChange={setSelectedTempGroup}
                  isDark={isDark}
                />
                <button 
                  onClick={() => assignFieldToGroup(item, selectedTempGroup)}
                  disabled={!selectedTempGroup || isSavingGroup}
                  className="w-full py-3 bg-primary-orange text-white rounded-xl text-sm font-semibold shadow-lg shadow-primary-orange/20 hover:brightness-110 active:scale-[0.98] transition-all tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                >
                  <Save size={18} />
                  {isSavingGroup ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </div>
          )}
        </td>
      </>
    );
  };

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
      icon: FolderPlus,
      onClick: (item) => {
        setGroupPopover({ isOpen: true, field: item });
        setSelectedTempGroup(item.group_name || '');
      },
      title: "Add to Group",
      className: "text-gray-400 hover:text-green-500"
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
          className={groupPopover.isOpen ? "overflow-visible! pb-80" : ""}
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
