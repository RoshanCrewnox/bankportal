import React, { useMemo } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  Panel,
  ReactFlowProvider,
  Handle,
  Position
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Link, Activity } from 'lucide-react';

const SchemaNode = ({ data, isDark }) => (
  <div className={`bg-white dark:bg-[#1e1e2d] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden min-w-[220px] animate-in zoom-in duration-300`}>
    {/* Colored Header */}
    <div 
      className="px-4 py-2 text-center font-bold text-xs text-white tracking-wider shadow-inner relative" 
      style={{ backgroundColor: data.color || '#6366f1' }}
    >
      <Handle type="target" position={Position.Top} id="top" className="w-1.5! h-1.5! bg-white/50! border-none top-[-3px]!" />
      {data.label}
    </div>
    
    <div className="p-1 space-y-0.5">
      {data.fields.map((field, index) => (
        <div 
          key={field.name} 
          className="flex justify-between items-center py-1.5 px-3 border-b border-gray-50 dark:border-white/5 last:border-b-0 relative group"
        >
          {/* Target Handle for References to this field */}
          <Handle 
            type="target" 
            position={Position.Left} 
            id={`${field.name}-target`} 
            className="w-1.5! h-1.5! bg-primary-orange! border-none! left-[-4px]! opacity-0! group-hover:opacity-100! transition-opacity" 
          />
          
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-indigo-400 shadow-[0_0_5px_rgba(99,102,241,0.5)]" />
            <span className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{field.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 tracking-tight font-mono">
               {field.type === 'add reference' ? `${field.ref.substring(0,8)}...` : field.type.substring(0,6)}
            </span>
            {field.required && (
              <span className="text-xs font-bold text-primary-orange bg-primary-orange/10 px-1 rounded-sm">REQ</span>
            )}
            {field.type === 'add reference' && (
              <Link size={8} className="text-blue-500" />
            )}
          </div>

          <Handle 
            type="source" 
            position={Position.Right} 
            id={`${field.name}-source`} 
            className="w-1.5! h-1.5! bg-primary-orange! border-none! right-[-4px]! opacity-100! shadow-[0_0_5px_rgba(255,107,0,0.5)]" 
          />
        </div>
      ))}
    </div>
    <Handle type="source" position={Position.Bottom} id="bottom" className="w-1.5! h-1.5! bg-white/50! border-none bottom-[-3px]!" />
  </div>
);

const nodeTypes = {
  schemaNode: (props) => <SchemaNode {...props} isDark={props.data.isDark} />
};

const COLORS = ['#d946ef', '#10b981', '#6366f1', '#f59e0b', '#ef4444', '#06b6d4'];

const FlowPreview = ({ schema, fields, isDark }) => {
  // Get all schemas from local storage to show connections
  const allSchemas = useMemo(() => {
    try {
      const stored = localStorage.getItem('CDM_SCHEMAS');
      const parsed = stored ? JSON.parse(stored) : [];
      
      const exists = parsed.find(s => s.cdm_uuid === schema.cdm_uuid);
      if (!exists && schema.cdm_name) {
          return [...parsed, { ...schema, fields }]; 
      }
      return parsed.map(s => s.cdm_uuid === schema.cdm_uuid ? { ...s, ...schema, fields } : s);
    } catch (e) {
      return [schema];
    }
  }, [schema, fields]);

  const { nodes, edges } = useMemo(() => {
    const numColumns = 3;
    const newNodes = allSchemas.filter(s => s.cdm_name).map((s, index) => {
      const color = COLORS[index % COLORS.length];
      const column = index % numColumns;
      const row = Math.floor(index / numColumns);
      
      return {
        id: s.cdm_uuid || `virtual-${index}`,
        type: 'schemaNode',
        position: {
          x: column * 350,
          y: row * 300,
        },
        data: { 
          label: s.cdm_name, 
          fields: s.fields || [],
          isDark,
          color
        },
      };
    });

    const newEdges = [];
    allSchemas.forEach(s => {
      const sourceId = s.cdm_uuid || allSchemas.indexOf(s).toString();
      const sourceFields = s.fields || [];
      
      sourceFields.forEach(field => {
        if (field.type === 'add reference' && field.ref) {
          const targetSchema = allSchemas.find(ts => ts.cdm_name === field.ref);
          if (targetSchema) {
            const targetId = targetSchema.cdm_uuid || allSchemas.indexOf(targetSchema).toString();
            const targetHandleId = field.refField ? `${field.refField}-target` : 'top';
            
            newEdges.push({
              id: `e-${sourceId}-${targetId}-${field.name}`,
              source: sourceId,
              sourceHandle: `${field.name}-source`,
              target: targetId,
              targetHandle: targetHandleId,
              animated: true,
              style: { stroke: COLORS[allSchemas.indexOf(s) % COLORS.length], strokeWidth: 1.5, opacity: 0.6 },
              type: 'smoothstep',
            });
          }
        }
      });
    });

    return { nodes: newNodes, edges: newEdges };
  }, [allSchemas, isDark]);

  return (
    <div className={`w-full h-full min-h-[700px] overflow-hidden ${isDark ? 'bg-[#0f0f1a]' : 'bg-gray-50'}`}>
      <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            colorMode={isDark ? 'dark' : 'light'}
            className="transition-all duration-1000"
          >
            <Background 
              variant="dots" 
              gap={16} 
              size={1} 
              color={isDark ? '#333' : '#ddd'} 
            />
            <Controls className="bg-white! dark:bg-secondary-dark-bg! border-none! shadow-2xl! opacity-50! hover:opacity-100! transition-opacity" />
          </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default FlowPreview;
