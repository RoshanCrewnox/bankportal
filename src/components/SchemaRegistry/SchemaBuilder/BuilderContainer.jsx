import React, { useState, useMemo } from 'react';
import { Save, ArrowLeft, Code, Copy, Check, X } from 'lucide-react';
import BuilderForm from './BuilderForm';

/**
 * Orchestrator for the Schema Builder
 */
const BuilderContainer = ({ 
  schema, 
  onUpdate, 
  onSave, 
  onCancel, 
  fields,
  onFieldUpdate,
  onAddField,
  onRemoveField,
  showPreview,
  setShowPreview,
  isEditing,
  isDark,
  schemas
}) => {
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);

  // Recursive function to build JSON structure
  const buildJsonStructure = (fieldsArr) => {
    const properties = {};
    fieldsArr?.forEach(f => {
      if (!f.name) return;
      const fieldObj = { type: f.type === 'add reference' ? 'reference' : f.type };
      
      // Removed required, min, max as per request
      
      if (f.unique) fieldObj.unique = true;
      
      if (f.type === 'add reference') {
        if (f.ref) fieldObj.reference_schema = f.ref;
        if (f.refField) fieldObj.reference_field = f.refField;
      }
      if (f.type === 'object' && f.fields) {
        fieldObj.properties = buildJsonStructure(f.fields);
      }
      if (f.type === 'array') {
        if (f.fields && f.fields.length > 0) {
          fieldObj.items = {
            type: 'object',
            properties: buildJsonStructure(f.fields)
          };
        } else {
          fieldObj.items = { type: 'string' };
        }
      }
      properties[f.name] = fieldObj;
    });
    return properties;
  };

  // Build the JSON schema object from form data
  const jsonSchema = useMemo(() => {
    return buildJsonStructure(fields);
  }, [fields]);

  const jsonString = useMemo(() => JSON.stringify(jsonSchema, null, 2), [jsonSchema]);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Color map for types
  const typeColorMap = {
    string: 'text-green-400',
    number: 'text-blue-400',
    boolean: 'text-yellow-400',
    date: 'text-purple-400',
    'add reference': 'text-pink-400',
    'object': 'text-cyan-400',
    'array': 'text-orange-400',
  };

  return (
    <div className={` space-y-8 animate-in fade-in duration-500 pb-20 ${isDark ? 'text-white' : 'text-gray-800'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
        <div className="flex items-center gap-6">
          <button 
            onClick={onCancel}
            className="p-2 -ml-2 rounded-lg hover:bg-white/5 text-gray-400 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-lg font-bold">New Schema Definition</h2>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
              Configure CDM Structure
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowJson(!showJson)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-orange hover:bg-primary-orange/90 text-white rounded-lg font-bold shadow-xl shadow-primary-orange/20 transition-all active:scale-95"
          >
            <Code size={16} />
            JSON Schema
          </button>
          
          <button 
            onClick={() => onSave(schema)}
            className="flex items-center gap-2 px-6 py-2 bg-primary-orange hover:bg-primary-orange/90 text-white rounded-lg font-bold shadow-xl shadow-primary-orange/20 transition-all active:scale-95"
          >
            Save
          </button>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="max-w-6xl mx-auto space-y-10">
        <BuilderForm 
          schema={schema} 
          onUpdate={onUpdate} 
          fields={fields}
          onFieldUpdate={onFieldUpdate}
          onAddField={onAddField}
          onRemoveField={onRemoveField}
          isDark={isDark} 
          schemas={schemas}
        />
      </div>

      {/* JSON Schema Drawer */}
      {showJson && (
        <div
          className="fixed inset-0 z-50 flex justify-end"
          role="button"
          tabIndex={0}
          onClick={() => setShowJson(false)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowJson(false); }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div 
            className={`relative w-full max-w-xl h-full overflow-y-auto animate-in slide-in-from-right duration-300 shadow-2xl ${
              isDark ? 'bg-secondary-dark-bg' : 'bg-white'
            }`}
            role="button"
            tabIndex={0}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className={`sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b ${
              isDark ? 'bg-secondary-dark-bg border-white/5' : 'bg-white border-gray-200'
            }`}>
              <div>
                <h3 className="text-base font-bold">JSON Schema</h3>
                <p className="text-xs text-gray-500">Generated schema output</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    copied 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : isDark 
                        ? 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button 
                  onClick={() => setShowJson(false)}
                  className="p-2 rounded-lg hover:bg-white/5 text-gray-400 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Actual JSON */}
              <div>
                <h4 className="text-sm font-bold mb-1">Actual JSON</h4>
                <p className="text-xs text-gray-500 mb-3">Raw JSON output</p>
                <pre className={`p-4 rounded-xl text-sm font-mono overflow-x-auto ${
                  isDark ? 'bg-darkbg text-gray-300 border border-white/5' : 'bg-gray-50 text-gray-800 border border-gray-200'
                }`}>
                  {jsonString}
                </pre>
              </div>

              {/* Formatted View with Types */}
              <div>
                <h4 className="text-sm font-bold mb-1">Formatted View with Types</h4>
                <p className="text-xs text-gray-500 mb-3">Structure showing types next to each key</p>
                <div className={`p-4 rounded-xl font-mono text-sm overflow-x-auto ${
                  isDark ? 'bg-darkbg border border-white/5' : 'bg-gray-50 border border-gray-200'
                }`}>
                  {fields.length === 0 ? (
                    <span className="text-gray-500 italic">No fields defined yet</span>
                  ) : (
                    fields.map((field, i) => (
                      <div key={field.name || `field-${i}`} className="py-0.5">
                        <span className="text-gray-400">"</span>
                        <span className={isDark ? 'text-white' : 'text-gray-800'}>{field.name || 'unnamed'}</span>
                        <span className="text-gray-400">"</span>
                        <span className="text-gray-500">: </span>
                        <span className={typeColorMap[field.type] || 'text-gray-400'}>{field.type}</span>
                        {field.unique && <span className="text-yellow-400 ml-2 text-xs">• unique</span>}
                        {field.type === 'add reference' && field.ref && (
                          <span className="text-pink-400/70 ml-2 text-xs">→ {field.ref}{field.refField ? `.${field.refField}` : ''}</span>
                        )}
                        {i < fields.length - 1 && <span className="text-gray-500">,</span>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuilderContainer;
