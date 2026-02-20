import React, { useState, useContext, useEffect } from 'react';
import { Plus, Database, Eye, Edit3, Trash2, GitBranch, Info } from 'lucide-react';
import { ThemeContext } from '../../components/common/ThemeContext';
import SchemaFlowCanvas from '../../components/SchemaRegistry/SchemaFlow/SchemaFlowCanvas';
import StatusBadge from '../../components/common/StatusBadge';

// ── localStorage helpers ──────────────────────────────────────
const STORAGE_KEY = 'schema_registry_schemas';
const loadSchemas  = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; } };
const saveSchemas  = (arr) => localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

const INITIAL_SCHEMA = {
  cdm_uuid:       '',
  cdm_name:       '',
  cdm_id:         '',
  version:        '1.0.0',
  tpp_uuid:       '',
  org_id:         '',
  cdm_domain:     '',
  cdm_defination: '{}',
  cdm_validation: '',
  status:         'Draft',
  desc:           '',
  _flowNodes:     null,
  _flowEdges:     null,
};

const formatDateTime = (d) => {
  if (!d) return '—';
  const dt = new Date(d);
  return `${dt.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:true})} ${dt.toLocaleDateString('en-US',{day:'2-digit',month:'short',year:'numeric'})}`;
};

// ── New Schema Modal ──────────────────────────────────────────
const NewSchemaModal = ({ isDark, onConfirm, onClose }) => {
  const [form, setForm] = useState({ cdm_name: '', version: '1.0.0', cdm_domain: '', desc: '', status: 'Draft' });
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const inputCls = `w-full px-3 py-2 text-sm rounded-lg border outline-none transition
    focus:ring-2 focus:ring-primary-orange/40 focus:border-primary-orange
    ${isDark ? 'bg-darkbg border-white/10 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400'}`;

  const labelCls = `block text-xs font-semibold mb-1.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-lg mx-4 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200
        ${isDark ? 'bg-secondary-dark-bg border border-white/10' : 'bg-white border border-gray-200'}`}
      >
        {/* Header */}
        <div className={`flex items-center gap-3 px-6 py-5 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
          <div className="p-2 rounded-xl bg-primary-orange/15 text-primary-orange">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>New schema flow</h2>
            <p className="text-xs text-gray-500">Set up schema metadata before designing</p>
          </div>
        </div>

        {/* Schema info — same fields as BuilderForm */}
        <div className="px-6 py-5 space-y-4">
          {/* Schema Information section */}
          <div className={`rounded-xl border p-4 ${isDark ? 'border-white/10 bg-white/3' : 'border-gray-100 bg-gray-50/70'}`}>
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-3.5 h-3.5 text-primary-orange" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Schema information</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className={labelCls}>Schema name <span className="text-primary-orange">*</span></label>
                <input value={form.cdm_name} onChange={e => upd('cdm_name', e.target.value)}
                  placeholder="e.g. Customer Profile" className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Description</label>
                <input value={form.desc} onChange={e => upd('desc', e.target.value)}
                  placeholder="Briefly describe this schema..." className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Version</label>
                <input value={form.version} onChange={e => upd('version', e.target.value)}
                  placeholder="1.0.0" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Domain</label>
                <input value={form.cdm_domain} onChange={e => upd('cdm_domain', e.target.value)}
                  placeholder="Retail Banking" className={inputCls} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Status</label>
                <div className="relative">
                  <select value={form.status} onChange={e => upd('status', e.target.value)} className={inputCls}>
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={`flex gap-3 px-6 py-4 border-t ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
          <button onClick={onClose}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-colors
              ${isDark ? 'border-white/10 text-gray-300 hover:bg-white/5' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            Cancel
          </button>
          <button
            disabled={!form.cdm_name.trim()}
            onClick={() => onConfirm(form)}
            className="flex-1 py-2.5 bg-primary-orange disabled:opacity-40 disabled:cursor-not-allowed text-white
              rounded-lg text-sm font-bold hover:bg-primary-orange/90 transition-colors shadow-lg shadow-primary-orange/20 active:scale-95">
            Open canvas
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────
const SchemaFlowPage = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [view,          setView]          = useState('LIST');   // 'LIST' | 'CANVAS'
  const [schemas,       setSchemas]       = useState([]);
  const [currentSchema, setCurrentSchema] = useState(null);
  const [showModal,     setShowModal]     = useState(false);

  useEffect(() => { setSchemas(loadSchemas()); }, []);

  // ── handlers ──
  const handleCreateNew = () => setShowModal(true);

  const handleModalConfirm = (form) => {
    const s = { ...INITIAL_SCHEMA, ...form, cdm_uuid: crypto.randomUUID(), createdAt: new Date().toISOString() };
    setCurrentSchema(s);
    setShowModal(false);
    setView('CANVAS');
  };

  const handleEdit = (schema) => { setCurrentSchema(schema); setView('CANVAS'); };

  const handleDelete = (uuid) => {
    if (!window.confirm('Delete this schema?')) return;
    const updated = schemas.filter(s => s.cdm_uuid !== uuid);
    saveSchemas(updated);
    setSchemas(updated);
  };

  const handleSave = (schemaData) => {
    const finalData = { ...schemaData, updatedAt: new Date().toISOString() };
    if (!finalData.createdAt) finalData.createdAt = finalData.updatedAt;
    const current = loadSchemas();
    const idx = current.findIndex(s => s.cdm_uuid === finalData.cdm_uuid);
    if (idx >= 0) current[idx] = { ...current[idx], ...finalData };
    else current.push(finalData);
    saveSchemas(current);
    setSchemas(loadSchemas());
    setView('LIST');
  };

  // ── CANVAS view ────────────────────────────────────────────
  if (view === 'CANVAS' && currentSchema) {
    return (
      <div className={`flex flex-col h-[calc(100vh-64px)] overflow-hidden ${isDark ? 'bg-darkbg' : 'bg-gray-50'}`}>
        <SchemaFlowCanvas
          schema={currentSchema}
          onBack={() => setView('LIST')}
          onSave={handleSave}
          isDark={isDark}
        />
      </div>
    );
  }

  // ── LIST view ──────────────────────────────────────────────
  return (
    <div className={`space-y-6 animate-in fade-in duration-500 pb-10 ${isDark ? 'text-white' : 'text-gray-800'}`}>
      {showModal && (
        <NewSchemaModal isDark={isDark} onConfirm={handleModalConfirm} onClose={() => setShowModal(false)} />
      )}

      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Schema flow</h1>
          <p className={`text-sm mt-0.5 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Visually design and manage schema structures as node graphs.
          </p>
        </div>
        <button
          onClick={handleCreateNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-orange text-white rounded-xl
            text-sm font-bold shadow-lg shadow-primary-orange/20 hover:bg-primary-orange/90 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add schema
        </button>
      </div>

      {/* Empty state */}
      {schemas.length === 0 ? (
        <div className={`mt-10 border rounded-2xl p-20 flex flex-col items-center justify-center
          ${isDark ? 'border-white/5 bg-white/2' : 'border-gray-100 bg-gray-50/50'}`}>
          <div className="w-16 h-16 rounded-full bg-primary-orange/20 flex items-center justify-center mb-6">
            <GitBranch className="w-8 h-8 text-primary-orange" />
          </div>
          <h2 className="text-xl font-bold mb-2">No schemas yet</h2>
          <p className={`text-sm text-center max-w-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Click "Add schema" to start designing your first schema visually as a node graph.
          </p>
        </div>
      ) : (
        // Schema card grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {schemas.map(schema => (
            <div
              key={schema.cdm_uuid}
              className={`group p-5 rounded-xl border transition-all duration-200 hover:shadow-lg
                ${isDark
                  ? 'bg-secondary-dark-bg border-white/10 hover:border-white/20'
                  : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm'}`}
            >
              {/* Row 1: Name + version | action icons */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-primary-orange truncate max-w-[150px]">
                    {schema.cdm_name || 'Untitled schema'}
                  </h3>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded shrink-0
                    ${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                    v{schema.version || '1'}
                  </span>
                </div>
                <div className="flex items-center gap-0.5">
                  <button
                    onClick={() => handleEdit(schema)}
                    title="View / Edit"
                    className={`p-1.5 rounded-md transition-colors
                      ${isDark ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleEdit(schema)}
                    title="Edit"
                    className={`p-1.5 rounded-md transition-colors
                      ${isDark ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(schema.cdm_uuid)}
                    title="Delete"
                    className={`p-1.5 rounded-md transition-colors
                      ${isDark ? 'text-gray-500 hover:text-red-400 hover:bg-red-500/5' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Description */}
              <p className={`text-xs mb-4 line-clamp-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {schema.desc || '—'}
              </p>

              {/* Domain chip */}
              {schema.cdm_domain && (
                <div className="mb-3">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium
                    ${isDark ? 'text-gray-400 border-white/10 bg-white/3' : 'text-gray-500 border-gray-200 bg-gray-50'}`}>
                    {schema.cdm_domain}
                  </span>
                </div>
              )}

              {/* Footer: date + status */}
              <div className="flex items-end justify-between">
                <div className={`text-[10px] leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <div>Last modified</div>
                  <div>By admin @ {formatDateTime(schema.updatedAt || schema.createdAt)}</div>
                </div>
                <StatusBadge status={schema.status || 'Draft'} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SchemaFlowPage;
