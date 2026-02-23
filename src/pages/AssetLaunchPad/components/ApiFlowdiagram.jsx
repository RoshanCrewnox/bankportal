
import React, { useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Handle,
  Position,
  BaseEdge,
  getSmoothStepPath,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEffect } from 'react';
import {
  CheckCircle,
  Clock,
  Rocket,
  Layers,
  Users,
  Activity,
  Lock,
  Link,
} from "lucide-react";

import { PremiumNode, CircularNode } from './FlowNodes';
import { TubeEdge } from './FlowEdges';

const nodeTypes = {
  premium: PremiumNode,
  circular: CircularNode
};
const edgeTypes = { tube: TubeEdge };

// --- Main Flow Component Logic ---
const ApiFlowdiagramContent = ({ theme }) => {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState("API");
  const [nodeStyle, setNodeStyle] = useState("circular");
  const { fitView } = useReactFlow();

  // Handle Dynamic Responsiveness
  useEffect(() => {
    const handleResize = () => {
      fitView({ padding: 0.1, duration: 400 });
    };

    window.addEventListener('resize', handleResize);
    // Initial fit after mounting
    const timeout = setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, [fitView, activeTab, nodeStyle]);

  const nodes = useMemo(() => [
    {
      id: "create",
      type: nodeStyle,
      position: { x: 0, y: 180 },
      data: { id: "create", label: "Create", icon: CheckCircle, color: "text-green-500", glowColor: "#10b981", theme },
    },
    {
      id: "pending",
      type: nodeStyle,
      position: { x: 550, y: 100 },
      data: { id: "pending", label: "Pending Launch", icon: Clock, color: "text-amber-500", glowColor: "#f59e0b", theme },
    },
    {
      id: "launch",
      type: nodeStyle,
      position: { x: 1000, y: 180 },
      data: { id: "launch", label: "Launch", icon: Rocket, color: "text-orange-500", glowColor: "#f97316", theme },
    },
    {
      id: "attached",
      type: nodeStyle,
      position: { x: 1350, y: 100 },
      data: { id: "attached", label: "Attached", icon: Layers, color: "text-purple-500", glowColor: "#a855f7", theme },
      hidden: activeTab === 'Product',
    },
    {
      id: "subscribe",
      type: nodeStyle,
      position: { x: 1700, y: 180 },
      data: { id: "subscribe", label: "Subscribe", icon: Users, color: "text-pink-500", glowColor: "#ec4899", theme },
    },
    {
      id: "draft",
      type: nodeStyle,
      position: { x: 0, y: 480 },
      data: { id: "draft", label: "Draft", icon: Activity, color: "text-gray-400", glowColor: "#94a3b8", theme },
    },
    {
      id: "reject",
      type: nodeStyle,
      position: { x: 280, y: 480 },
      data: { id: "reject", label: "Reject", icon: Lock, color: "text-red-500", glowColor: "#ef4444", theme },
    },
    {
      id: "amend",
      type: nodeStyle,
      position: { x: 1050, y: 480 },
      data: { id: "amend", label: "Amend", icon: Link, color: "text-sky-400", glowColor: "#0ea5e9", theme },
    },
  ], [theme, activeTab, nodeStyle]);

  const edges = useMemo(() => {
    // 1. Common Workflow Edges (Available in all tabs)
    const commonEdges = [
      { id: 'create-pending', source: 'create', target: 'pending', sourceHandle: 'right-src', targetHandle: 'left', type: 'tube', data: { glowColor: '#10b981' } },
      { id: 'pending-launch', source: 'pending', target: 'launch', sourceHandle: 'right-src', targetHandle: 'left', type: 'tube', data: { glowColor: '#f59e0b' } },
      { id: 'pending-reject', source: 'pending', target: 'reject', sourceHandle: 'bottom-src', targetHandle: 'top', type: 'tube', data: { glowColor: '#f59e0b' } },
      { id: 'reject-draft', source: 'reject', target: 'draft', sourceHandle: 'left-src', targetHandle: 'right', type: 'tube', data: { glowColor: '#ef4444' } },
      { id: 'draft-create', source: 'draft', target: 'create', sourceHandle: 'top-src', targetHandle: 'bottom', type: 'tube', data: { glowColor: '#94a3b8' } },
      { id: 'launch-amend', source: 'launch', target: 'amend', sourceHandle: 'bottom-src', targetHandle: 'top', type: 'tube', data: { glowColor: '#f97316' } },
      { id: 'amend-pending', source: 'amend', target: 'pending', sourceHandle: 'left-src', targetHandle: 'bottom', type: 'tube', data: { glowColor: '#3b82f6' } },
    ];

    // 2. Tab Specific Routing Logic
    if (activeTab === 'API') {
      return [
        ...commonEdges,
        { id: 'launch-attached', source: 'launch', target: 'attached', sourceHandle: 'right-src', targetHandle: 'left', type: 'tube', data: { glowColor: '#f97316' } },
        { id: 'attached-subscribe', source: 'attached', target: 'subscribe', sourceHandle: 'right-src', targetHandle: 'left', type: 'tube', data: { glowColor: '#a855f7' } },
        { id: 'attached-amend', source: 'attached', target: 'amend', sourceHandle: 'bottom-src', targetHandle: 'right', type: 'tube', data: { glowColor: '#a855f7' } },
      ];
    } 
    
    if (activeTab === 'Meter') {
      return [
        ...commonEdges,
        { id: 'launch-attached', source: 'launch', target: 'attached', sourceHandle: 'right-src', targetHandle: 'left', type: 'tube', data: { glowColor: '#f97316' } },
        { id: 'attached-subscribe', source: 'attached', target: 'subscribe', sourceHandle: 'right-src', targetHandle: 'left', type: 'tube', data: { glowColor: '#a855f7' } },
      ];
    }

    if (activeTab === 'Product') {
      return [
        ...commonEdges,
        // Direct route: Launch -> Subscribe (Bypassing Attached)
        { id: 'launch-subscribe-direct', source: 'launch', target: 'subscribe', sourceHandle: 'right-src', targetHandle: 'left', type: 'tube', data: { glowColor: '#f97316' } },
      ];
    } 

    return [];
  }, [activeTab]);

  return (
    <div className="w-full relative transition-all duration-700 overflow-hidden bg-white dark:!bg-darkbg rounded-2xl p-6 shadow-lg" style={{ minHeight: '500px', height: '60vh', maxHeight: '650px' }}>
      <div className="flex flex-col gap-6 mb-2 mt-2 px-4">
        {/* Header and Style Switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">  
            {/* Tab Switcher */}
            <div className={`flex p-1 rounded-xl ${isDark ? "bg-white/5" : "bg-black/5"}`}>
              {["API", "Product", "Meter"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all duration-300 rounded-lg ${
                    activeTab === tab
                      ? "bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]"
                      : isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Style Selector */}
          <div className="flex items-center gap-4">
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? "text-gray-500" : "text-gray-400"}`}>Node Style:</span>
            <div className={`flex p-1 rounded-xl ${isDark ? "bg-white/5" : "bg-black/5"}`}>
              {[
                { id: "premium", label: "Premium Block" },
                { id: "circular", label: "Circular Glass" }
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setNodeStyle(style.id)}
                  className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all duration-300 rounded-lg ${
                    nodeStyle === style.id
                      ? "bg-orange-600 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]"
                      : isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="h-full w-full bg-transparent">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.1, minZoom: 0.1, maxZoom: 2.0 }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          zoomOnScroll={false}
          zoomOnDoubleClick={false}
          selectionOnDrag={false}
          panOnScroll={false}
          preventScrolling={false}
          colorMode={isDark ? 'dark' : 'light'}
          className="bg-transparent"
        >
          <Background variant="dots" gap={20} size={1} color={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} />
        </ReactFlow>
      </div>

      <style>{`
        .react-flow { background: transparent !important; }
        .react-flow__pane { background: transparent !important; cursor: default !important; }
        .react-flow__viewport { background: transparent !important; }
        .react-flow__background { background: transparent !important; }
        .react-flow__attribution { display: none !important; }
        .react-flow__node { cursor: default !important; }
      `}</style>
    </div>
  );
};

const ApiFlowdiagram = (props) => (
  <ReactFlowProvider>
    <ApiFlowdiagramContent {...props} />
  </ReactFlowProvider>
);

export default ApiFlowdiagram;
