import React, { useState, useCallback, useRef, useContext, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ThemeContext } from '../../common/ThemeContext';
import EntityNode from './node-types/EntityNode';
import FieldNode   from './node-types/FieldNode';
import ObjectNode  from './node-types/ObjectNode';
import SchemaNodeSidebar from './SchemaNodeSidebar';
import SchemaNodeDrawer  from './SchemaNodeDrawer';

// ── custom node types ─────────────────────────────────────────
const nodeTypes = { entityNode: EntityNode, fieldNode: FieldNode, objectNode: ObjectNode };

let nodeIdCounter = 200;

// ── convert ReactFlow nodes → schema JSON (like fieldsToDefinition) ──
const nodesToDefinition = (nodes, edges) => {
  const result = {};
  // Find which nodes are roots (have entity type or no incoming edges)
  const hasIncoming = new Set(edges.map(e => e.target));

  const buildField = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return null;
    const d = node.data;
    const fieldType = d.fieldType || 'string';

    const fieldObj = { type: fieldType };
    if (d.required)  fieldObj.required  = true;
    if (d.nullable)  fieldObj.nullable  = true;
    if (d.description) fieldObj.description = d.description;

    // Type-specific extras
    if (fieldType === 'string') {
      if (d.minLength)  fieldObj.minLength  = d.minLength;
      if (d.maxLength)  fieldObj.maxLength  = d.maxLength;
      if (d.pattern)    fieldObj.pattern    = d.pattern;
      if (d.format && d.format !== 'none') fieldObj.format = d.format;
      if (d.defaultValue !== undefined) fieldObj.default = d.defaultValue;
    }
    if (fieldType === 'number' || fieldType === 'integer') {
      if (d.minimum !== undefined) fieldObj.minimum = d.minimum;
      if (d.maximum !== undefined) fieldObj.maximum = d.maximum;
      if (d.multipleOf) fieldObj.multipleOf = d.multipleOf;
      if (d.format && d.format !== 'none') fieldObj.format = d.format;
      if (d.exclusiveMinimum) fieldObj.exclusiveMinimum = true;
      if (d.exclusiveMaximum) fieldObj.exclusiveMaximum = true;
    }
    if (fieldType === 'boolean') {
      if (d.defaultValue !== undefined) fieldObj.default = d.defaultValue;
    }
    if (fieldType === 'object') {
      const childEdges = edges.filter(e => e.source === nodeId);
      if (childEdges.length > 0) {
        fieldObj.properties = {};
        childEdges.forEach(e => {
          const child = nodes.find(n => n.id === e.target);
          if (child) {
            fieldObj.properties[child.data.label || 'field'] = buildField(e.target);
          }
        });
      }
      if (d.additionalProperties) fieldObj.additionalProperties = true;
    }
    if (fieldType === 'array') {
      fieldObj.items = { type: d.itemType || 'string' };
      if (d.minItems !== undefined) fieldObj.minItems = d.minItems;
      if (d.maxItems !== undefined) fieldObj.maxItems = d.maxItems;
      if (d.uniqueItems) fieldObj.uniqueItems = true;
    }
    if (fieldType === 'enum') {
      if (d.enumValues?.length > 0) fieldObj.enum = d.enumValues;
    }
    if (fieldType === 'date') {
      if (d.dateFormat) fieldObj.format = d.dateFormat;
    }
    if (fieldType === 'reference') {
      if (d.ref) fieldObj.$ref = d.ref;
      if (d.relationshipType) fieldObj.relation = d.relationshipType;
    }
    return fieldObj;
  };

  // For each entity node, collect its direct children as top-level fields
  nodes.filter(n => n.type === 'entityNode').forEach(entity => {
    const childEdges = edges.filter(e => e.source === entity.id);
    childEdges.forEach(e => {
      const child = nodes.find(n => n.id === e.target);
      if (child) {
        result[child.data.label || 'field'] = buildField(e.target);
      }
    });
    // Also any standalone fields with no parent entity treated as top-level
  });

  // Standalone nodes (no incoming edges, not entity) as top-level
  nodes
    .filter(n => n.type !== 'entityNode' && !hasIncoming.has(n.id))
    .forEach(n => {
      result[n.data.label || 'field'] = buildField(n.id);
    });

  return result;
};

// ── blank canvas initial setup ────────────────────────────────
const makeInitialNodes = (schemaName) => [
  {
    id: 'entity-root',
    type: 'entityNode',
    position: { x: 100, y: 200 },
    data: { label: schemaName || 'Entity', fieldType: 'entity', description: '', required: false },
  },
];

// ── localStorage helpers ──────────────────────────────────────
const STORAGE_KEY = 'schema_registry_schemas';
const loadSchemas = () => {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
};
const persistSchemas = (arr) => localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

// ── SchemaFlowCanvas (inner) ──────────────────────────────────
const SchemaFlowCanvas = ({ schema, onBack, onSave, isDark }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(
    schema._flowNodes || makeInitialNodes(schema.cdm_name)
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(schema._flowEdges || []);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen]  = useState(false);
  const [rfInstance, setRfInstance]      = useState(null);
  const wrapperRef = useRef(null);

  const onConnect     = useCallback((p) => setEdges(eds => addEdge({ ...p, animated: false }, eds)), [setEdges]);
  const onNodeClick   = useCallback((_, node) => { setSelectedNode(node); setIsDrawerOpen(true); }, []);
  const onSaveNode    = useCallback((id, data) => {
    setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, ...data } } : n));
    setSelectedNode(null);
  }, [setNodes]);
  const onDeleteNode  = useCallback((id) => {
    setNodes(nds => nds.filter(n => n.id !== id));
    setEdges(eds => eds.filter(e => e.source !== id && e.target !== id));
    setSelectedNode(null);
    setIsDrawerOpen(false);
  }, [setNodes, setEdges]);

  const onDragOver = useCallback(e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }, []);
  const onDrop = useCallback(e => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('application/schemaflow-node');
    if (!raw || !rfInstance) return;
    const item = JSON.parse(raw);
    const pos  = rfInstance.screenToFlowPosition({ x: e.clientX, y: e.clientY });
    setNodes(nds => [...nds, {
      id: `node-${++nodeIdCounter}`,
      type: item.type,
      position: pos,
      data: { ...item.defaultData, label: item.label.toLowerCase() },
    }]);
  }, [rfInstance, setNodes]);

  const handleSave = () => {
    const definition = nodesToDefinition(nodes, edges);
    onSave({ ...schema, cdm_defination: JSON.stringify(definition), _flowNodes: nodes, _flowEdges: edges });
  };

  const edgeOpts = {
    style: { stroke: isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.13)', strokeWidth: 1.5 },
  };

  return (
    <div className="flex flex-col h-full">
      {/* Canvas toolbar */}
      <div className={`flex items-center justify-between px-5 py-2.5 border-b shrink-0
        ${isDark ? 'bg-secondary-dark-bg border-white/10' : 'bg-white border-gray-200'}`}
      >
        <div className="flex items-center gap-3">
          <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {schema.cdm_name || 'Schema'}
          </span>
          {schema.version && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
              v{schema.version}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors
              ${isDark ? 'text-gray-300 hover:bg-white/5 border border-white/10' : 'text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 bg-primary-orange text-white rounded-lg text-sm font-bold
              hover:bg-primary-orange/90 transition-colors shadow-lg shadow-primary-orange/20 active:scale-95"
          >
            Save schema
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex flex-1 overflow-hidden">
        <SchemaNodeSidebar />
        <div ref={wrapperRef} className="flex-1 h-full">
          <ReactFlow
            nodes={nodes} edges={edges}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            onConnect={onConnect} onNodeClick={onNodeClick}
            onInit={setRfInstance} onDrop={onDrop} onDragOver={onDragOver}
            nodeTypes={nodeTypes} fitView defaultEdgeOptions={edgeOpts}
            proOptions={{ hideAttribution: true }}
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1}
              color={isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.09)'} />
            <Controls
              className={isDark ? 'bg-secondary-dark-bg! border-white/10! [&>button]:border-white/10! [&>button]:bg-secondary-dark-bg! [&>button]:text-gray-300! [&>button:hover]:bg-white/5!' : ''}
            />
            <MiniMap
              nodeColor={n => {
                if (n.type === 'entityNode') return '#f97316';
                if (n.type === 'objectNode') return '#f59e0b';
                const map = { string:'#3b82f6',number:'#a855f7',integer:'#7c3aed',boolean:'#22c55e',array:'#f97316',enum:'#ec4899',date:'#14b8a6',reference:'#6366f1' };
                return map[n.data?.fieldType] || '#6b7280';
              }}
              className={isDark ? 'bg-secondary-dark-bg! border-white/10! [&>svg]:rounded-lg' : 'bg-white! border-gray-200! [&>svg]:rounded-lg'}
            />
            <Panel position="top-right">
              <div className={`rounded-xl border px-3 py-2 text-[10px] space-y-1 shadow-lg
                ${isDark ? 'bg-secondary-dark-bg border-white/10 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}
              >
                <p className="font-bold uppercase tracking-wider mb-1.5">Legend</p>
                {[['bg-primary-orange','Entity'],['bg-amber-500','Object'],['bg-blue-500','String'],
                  ['bg-purple-500','Number'],['bg-green-500','Boolean'],['bg-pink-500','Enum'],
                  ['bg-teal-500','Date'],['bg-indigo-500','Reference']].map(([c,l]) => (
                  <div key={l} className="flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${c}`} />
                    <span>{l}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>

      {isDrawerOpen && selectedNode && (
        <SchemaNodeDrawer
          node={selectedNode}
          onClose={() => { setIsDrawerOpen(false); setSelectedNode(null); }}
          onSave={onSaveNode}
          onDelete={onDeleteNode}
        />
      )}
    </div>
  );
};

export default SchemaFlowCanvas;
