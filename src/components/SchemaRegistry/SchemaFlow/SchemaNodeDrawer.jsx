import React, { useState, useEffect, useContext } from 'react';
import { X, Plus, Trash2, ChevronDown } from 'lucide-react';
import { ThemeContext } from '../../common/ThemeContext';

// ── helpers ────────────────────────────────────────────────────
const FIELD_TYPES = [
  'string', 'number', 'integer', 'boolean',
  'object', 'array', 'enum', 'date', 'reference',
];

const STRING_FORMATS  = ['none', 'email', 'uri', 'uuid', 'hostname', 'ipv4', 'ipv6'];
const NUMBER_FORMATS  = ['none', 'float', 'double', 'int32', 'int64'];
const DATE_FORMATS    = ['ISO 8601', 'date-only', 'unix-timestamp'];
const ARRAY_ITEM_TYPES = ['string', 'number', 'integer', 'boolean', 'object', 'reference'];

// ── sub-components ─────────────────────────────────────────────
const Label = ({ children }) => (
  <p className="text-xs text-gray-400 font-semibold mb-1.5 ml-0.5">{children}</p>
);

const Input = ({ value, onChange, placeholder, type = 'text', min, max, step }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <input
      type={type}
      value={value ?? ''}
      onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
      placeholder={placeholder}
      min={min} max={max} step={step}
      className={`w-full px-3 py-2 text-sm rounded-lg border outline-none transition
        focus:ring-2 focus:ring-primary-orange/40 focus:border-primary-orange
        ${theme === 'dark'
          ? 'bg-darkbg border-white/10 text-white placeholder:text-gray-600'
          : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400'}`}
    />
  );
};

const Select = ({ value, onChange, options }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <div className="relative">
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3 py-2 pr-8 text-sm rounded-lg border outline-none appearance-none transition
          focus:ring-2 focus:ring-primary-orange/40 focus:border-primary-orange
          ${theme === 'dark'
            ? 'bg-darkbg border-white/10 text-white'
            : 'bg-gray-50 border-gray-200 text-gray-800'}`}
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
    </div>
  );
};

const Textarea = ({ value, onChange, placeholder, rows = 3 }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <textarea
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-3 py-2 text-sm rounded-lg border outline-none transition resize-none
        focus:ring-2 focus:ring-primary-orange/40 focus:border-primary-orange
        ${theme === 'dark'
          ? 'bg-darkbg border-white/10 text-white placeholder:text-gray-600'
          : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400'}`}
    />
  );
};

const Toggle = ({ value, onChange, label }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-sm text-gray-500 dark:text-gray-300">{label}</span>
    <button
      onClick={() => onChange(!value)}
      className={`w-9 h-5 rounded-full relative transition-colors ${value ? 'bg-primary-orange' : 'bg-gray-300 dark:bg-white/10'}`}
    >
      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${value ? 'left-[20px]' : 'left-[4px]'}`} />
    </button>
  </div>
);

const Section = ({ title, children }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`rounded-xl border p-4 space-y-4 ${theme === 'dark' ? 'border-white/10 bg-white/3' : 'border-gray-100 bg-gray-50/70'}`}>
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{title}</p>
      {children}
    </div>
  );
};

// ── main drawer ────────────────────────────────────────────────
const SchemaNodeDrawer = ({ node, onClose, onSave, onDelete }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [form, setForm] = useState({});
  const [enumInput, setEnumInput] = useState('');

  useEffect(() => {
    if (node) setForm({ ...node.data });
  }, [node]);

  if (!node) return null;

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const addEnum = () => {
    if (!enumInput.trim()) return;
    const current = form.enumValues || [];
    if (!current.includes(enumInput.trim())) {
      update('enumValues', [...current, enumInput.trim()]);
    }
    setEnumInput('');
  };

  const removeEnum = (v) => update('enumValues', (form.enumValues || []).filter(x => x !== v));

  const handleSave = () => {
    onSave(node.id, form);
    onClose();
  };

  const typeKey = form.fieldType || 'string';

  const TYPE_BADGE_COLORS = {
    string:    'bg-blue-500/20 text-blue-300',
    number:    'bg-purple-500/20 text-purple-300',
    integer:   'bg-violet-500/20 text-violet-300',
    boolean:   'bg-green-500/20 text-green-300',
    object:    'bg-amber-500/20 text-amber-300',
    array:     'bg-orange-500/20 text-orange-300',
    enum:      'bg-pink-500/20 text-pink-300',
    date:      'bg-teal-500/20 text-teal-300',
    reference: 'bg-indigo-500/20 text-indigo-300',
    entity:    'bg-primary-orange/20 text-primary-orange',
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer panel */}
      <div
        className={`relative w-[400px] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300
          ${isDark ? 'bg-secondary-dark-bg' : 'bg-white'}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
          <div>
            <h2 className={`text-base font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Edit node
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${TYPE_BADGE_COLORS[typeKey] || ''}`}>
                {typeKey}
              </span>
              <span className="text-[11px] text-gray-500 truncate max-w-[200px]">{form.label}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors group ${isDark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}
          >
            <X className="w-4 h-4 text-gray-400 group-hover:text-primary-orange transition-colors" />
          </button>
        </div>

        {/* Form body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* ── Common fields ── */}
          <Section title="General">
            <div>
              <Label>Field name</Label>
              <Input value={form.label} onChange={(v) => update('label', v)} placeholder="e.g. customerName" />
            </div>
            {node.type !== 'entityNode' && (
              <div>
                <Label>Field type</Label>
                <Select value={form.fieldType} onChange={(v) => update('fieldType', v)} options={FIELD_TYPES} />
              </div>
            )}
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(v) => update('description', v)} placeholder="Explain what this field represents..." />
            </div>
            <Toggle label="Required" value={!!form.required} onChange={(v) => update('required', v)} />
            <Toggle label="Nullable" value={!!form.nullable} onChange={(v) => update('nullable', v)} />
          </Section>

          {/* ── String ── */}
          {typeKey === 'string' && (
            <Section title="String constraints">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Min length</Label>
                  <Input type="number" value={form.minLength} onChange={(v) => update('minLength', v)} min={0} />
                </div>
                <div>
                  <Label>Max length</Label>
                  <Input type="number" value={form.maxLength} onChange={(v) => update('maxLength', v)} min={0} />
                </div>
              </div>
              <div>
                <Label>Pattern (regex)</Label>
                <Input value={form.pattern} onChange={(v) => update('pattern', v)} placeholder="^[a-zA-Z]+$" />
              </div>
              <div>
                <Label>Format</Label>
                <Select value={form.format || 'none'} onChange={(v) => update('format', v)} options={STRING_FORMATS} />
              </div>
              <div>
                <Label>Default value</Label>
                <Input value={form.defaultValue} onChange={(v) => update('defaultValue', v)} placeholder="Default string" />
              </div>
            </Section>
          )}

          {/* ── Number / Integer ── */}
          {(typeKey === 'number' || typeKey === 'integer') && (
            <Section title="Numeric constraints">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Minimum</Label>
                  <Input type="number" value={form.minimum} onChange={(v) => update('minimum', v)} />
                </div>
                <div>
                  <Label>Maximum</Label>
                  <Input type="number" value={form.maximum} onChange={(v) => update('maximum', v)} />
                </div>
              </div>
              <div>
                <Label>Multiple of</Label>
                <Input type="number" value={form.multipleOf} onChange={(v) => update('multipleOf', v)} placeholder="e.g. 5" step="any" />
              </div>
              <div>
                <Label>Format</Label>
                <Select value={form.format || 'none'} onChange={(v) => update('format', v)} options={NUMBER_FORMATS} />
              </div>
              <div>
                <Label>Default value</Label>
                <Input type="number" value={form.defaultValue} onChange={(v) => update('defaultValue', v)} />
              </div>
              <Toggle label="Exclusive minimum" value={!!form.exclusiveMinimum} onChange={(v) => update('exclusiveMinimum', v)} />
              <Toggle label="Exclusive maximum" value={!!form.exclusiveMaximum} onChange={(v) => update('exclusiveMaximum', v)} />
            </Section>
          )}

          {/* ── Boolean ── */}
          {typeKey === 'boolean' && (
            <Section title="Boolean">
              <Toggle label="Default value" value={!!form.defaultValue} onChange={(v) => update('defaultValue', v)} />
            </Section>
          )}

          {/* ── Object ── */}
          {typeKey === 'object' && (
            <Section title="Object settings">
              <div>
                <Label>Title</Label>
                <Input value={form.objectTitle} onChange={(v) => update('objectTitle', v)} placeholder="e.g. Address" />
              </div>
              <Toggle label="Additional properties allowed" value={!!form.additionalProperties} onChange={(v) => update('additionalProperties', v)} />
            </Section>
          )}

          {/* ── Array ── */}
          {typeKey === 'array' && (
            <Section title="Array constraints">
              <div>
                <Label>Items type</Label>
                <Select value={form.itemType || 'string'} onChange={(v) => update('itemType', v)} options={ARRAY_ITEM_TYPES} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Min items</Label>
                  <Input type="number" value={form.minItems} onChange={(v) => update('minItems', v)} min={0} />
                </div>
                <div>
                  <Label>Max items</Label>
                  <Input type="number" value={form.maxItems} onChange={(v) => update('maxItems', v)} min={0} />
                </div>
              </div>
              <Toggle label="Unique items only" value={!!form.uniqueItems} onChange={(v) => update('uniqueItems', v)} />
            </Section>
          )}

          {/* ── Enum ── */}
          {typeKey === 'enum' && (
            <Section title="Enum values">
              <div className="flex gap-2">
                <input
                  value={enumInput}
                  onChange={(e) => setEnumInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addEnum(); } }}
                  placeholder="Add a value..."
                  className={`flex-1 px-3 py-2 text-sm rounded-lg border outline-none transition
                    focus:ring-2 focus:ring-primary-orange/40 focus:border-primary-orange
                    ${isDark ? 'bg-darkbg border-white/10 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400'}`}
                />
                <button
                  onClick={addEnum}
                  className="px-3 py-2 bg-primary-orange text-white rounded-lg hover:bg-primary-orange/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {(form.enumValues || []).map((v) => (
                  <span
                    key={v}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-pink-500/10 text-pink-400 border border-pink-500/20"
                  >
                    {v}
                    <button onClick={() => removeEnum(v)} className="hover:text-red-400 transition-colors">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {(!form.enumValues || form.enumValues.length === 0) && (
                  <p className="text-xs text-gray-500 italic">No values added yet</p>
                )}
              </div>
            </Section>
          )}

          {/* ── Date ── */}
          {typeKey === 'date' && (
            <Section title="Date settings">
              <div>
                <Label>Date format</Label>
                <Select value={form.dateFormat || 'ISO 8601'} onChange={(v) => update('dateFormat', v)} options={DATE_FORMATS} />
              </div>
              <div>
                <Label>Example value</Label>
                <Input value={form.example} onChange={(v) => update('example', v)} placeholder="2024-01-01T00:00:00Z" />
              </div>
            </Section>
          )}

          {/* ── Reference ── */}
          {typeKey === 'reference' && (
            <Section title="Reference">
              <div>
                <Label>Target entity ($ref)</Label>
                <Input value={form.ref} onChange={(v) => update('ref', v)} placeholder="#/definitions/EntityName" />
              </div>
              <div>
                <Label>Relationship type</Label>
                <Select
                  value={form.relationshipType || 'one-to-one'}
                  onChange={(v) => update('relationshipType', v)}
                  options={['one-to-one', 'one-to-many', 'many-to-many']}
                />
              </div>
            </Section>
          )}
        </div>

        {/* Footer */}
        <div className={`px-6 py-4 border-t flex items-center gap-3 ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
          {node.type !== 'entityNode' && (
            <button
              onClick={() => onDelete?.(node.id)}
              className={`p-2.5 rounded-lg border transition-colors group
                ${isDark ? 'border-red-500/20 text-red-400 hover:bg-red-500/10' : 'border-red-200 text-red-500 hover:bg-red-50'}`}
              title="Delete node"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <div className="flex-1 flex gap-3">
            <button
              onClick={onClose}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border transition-colors
                ${isDark ? 'border-white/10 text-gray-300 hover:bg-white/5' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 bg-primary-orange text-white rounded-lg text-sm font-semibold hover:bg-primary-orange/90 transition-colors shadow-lg shadow-primary-orange/20 active:scale-95"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemaNodeDrawer;
