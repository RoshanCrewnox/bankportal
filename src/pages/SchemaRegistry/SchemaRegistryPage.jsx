import React, { useContext } from 'react';
import { Plus, Database, Eye, Edit3, Trash2 } from 'lucide-react';
import { ThemeContext } from '../../components/common/ThemeContext';
import { useSchemaRegistry } from '../../hooks/useSchemaRegistry';
import BuilderContainer from '../../components/SchemaRegistry/SchemaBuilder/BuilderContainer';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';

const SchemaRegistryPage = () => {
  const { theme } = useContext(ThemeContext);
  const { 
    view, 
    setView, 
    schemas, 
    loading, 
    handleCreateNew, 
    handleEdit,
    handleDelete,
    currentSchema, 
    setCurrentSchema,
    fields,
    handleFieldUpdate,
    addNestedField,
    removeNestedField,
    handleSave,
    showPreview,
    setShowPreview,
    isEditing
  } = useSchemaRegistry();

  const isDark = theme === 'dark';

  if (view === 'BUILDER') {
    return (
      <div className="h-[calc(100vh-140px)] animate-in slide-in-from-right duration-500">
        <BuilderContainer 
          schema={currentSchema}
          onUpdate={setCurrentSchema}
          onSave={handleSave}
          onCancel={() => setView('LIST')}
          fields={fields}
          onFieldUpdate={handleFieldUpdate}
          onAddField={addNestedField}
          onRemoveField={removeNestedField}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          isEditing={isEditing}
          isDark={isDark}
          schemas={schemas}
        />
      </div>
    );
  }



  const formatDateTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const date = d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    return `${time} ${date}`;
  };

  return (
    <div className={` space-y-6 animate-in fade-in duration-500 pb-10 ${isDark ? 'text-white' : 'text-gray-800'}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Schema Registry</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Design and manage your Common Data Model schemas for consistent architectural governance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="primary" onClick={handleCreateNew} icon={<Plus size={18} />}>
            Onboard Schema
          </Button>
        </div>
      </div>

      {/* Content */}
      {schemas.length === 0 ? (
        /* Empty State */
        <div className={`mt-10 border rounded-xl p-20 flex flex-col items-center justify-center ${isDark ? 'border-white/5 bg-white/2' : 'border-gray-100 bg-gray-50/50'}`}>
           <div className="w-16 h-16 rounded-full bg-primary-orange/20 flex items-center justify-center mb-6">
              <Database size={32} className="text-primary-orange" />
           </div>
           <h2 className="text-xl font-bold mb-2">Ready to Architect?</h2>
           <p className="text-gray-500 text-sm max-w-sm text-center">Click "Onboard Schema" to begin building your Common Data Model with high-fidelity visual context.</p>
        </div>
      ) : (
        /* Schema Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {schemas.map((schema) => {
            return (
              <div 
                key={schema.cdm_uuid}
                className={`group p-5 rounded-xl border transition-all duration-200 hover:shadow-lg ${
                  isDark 
                    ? 'bg-secondary-dark-bg border-white/10 hover:border-white/15' 
                    : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'
                }`}
              >
                {/* Row 1: Name + Version | Icons */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-primary-orange">{schema.cdm_name || 'Untitled Schema'}</h3>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                      v-{schema.version || '1'}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => handleEdit(schema)}
                      className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
                      title="View"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => handleEdit(schema)}
                      className={`p-1.5 rounded-md transition-colors ${isDark ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
                      title="Edit"
                    >
                      <Edit3 size={15} />
                    </button>
                  </div>
                </div>

                {/* Row 2: Description */}
                <p className={`text-xs mb-4 line-clamp-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {schema.desc || 'No description'}
                </p>

                {/* Row 3: Last Modified | Status Badge */}
                <div className="flex items-end justify-between">
                  <div className={`text-[11px] leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    <div>Last Modified:</div>
                    <div>By admin @ {formatDateTime(schema.updatedAt || schema.createdAt)}</div>
                  </div>
                  <StatusBadge status={schema.status || 'Saved'} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SchemaRegistryPage;
