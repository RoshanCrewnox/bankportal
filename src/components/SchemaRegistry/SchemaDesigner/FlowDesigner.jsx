import React from 'react';
import { ArrowLeft, Share2, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

/**
 * Custom Flow Designer visualization for CDM Schemas
 */
const FlowDesigner = ({ schema, fields, onBack, isDark }) => {
  const propKeys = fields.map(f => f.name).filter(Boolean);

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-100 dark:border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Schema Visualizer
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
              {schema.cdm_name} • v{schema.version}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button className={`p-2 rounded-lg ${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
            <Share2 size={16} />
          </button>
          <div className={`h-8 w-px mx-2 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`} />
          <button className={`p-2 rounded-lg ${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
            <ZoomIn size={16} />
          </button>
          <button className={`p-2 rounded-lg ${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
            <ZoomOut size={16} />
          </button>
          <button className={`p-2 rounded-lg ${isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className={`flex-1 rounded-3xl relative overflow-hidden border ${
        isDark ? 'bg-[#1a1c2a] border-white/5' : 'bg-slate-50 border-gray-200'
      }`}>
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: `radial-gradient(${isDark ? '#4f46e5' : '#6366f1'} 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }} />

        {/* Central Schema Node */}
        <div className="absolute inset-0 flex items-center justify-center">
            {/* SVG connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {propKeys.map((key, i) => {
                    const angle = (i / propKeys.length) * 2 * Math.PI;
                    const r = 240;
                    const tx = 50 + (Math.cos(angle) * r) / (window.innerWidth/4); // Approximation for centering
                    const ty = 50 + (Math.sin(angle) * r) / (window.innerHeight/3);
                    return (
                        <line 
                            key={i}
                            x1="50%" y1="50%" 
                            x2={`${50 + Math.cos(angle) * 30}%`} y2={`${50 + Math.sin(angle) * 30}%`} 
                            stroke={isDark ? '#4f46e5' : '#6366f1'} 
                            strokeWidth="2"
                            strokeDasharray="4 4"
                            className="animate-pulse"
                        />
                    );
                })}
            </svg>

            {/* Main Node */}
            <div className={`z-10 p-1 rounded-2xl bg-linear-to-br from-primary-orange to-orange-600 shadow-2xl`}>
                <div className={`px-8 py-6 rounded-xl ${isDark ? 'bg-secondary-dark-bg' : 'bg-white'}`}>
                    <h3 className={`font-black text-center mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {schema.cdm_name}
                    </h3>
                    <p className="text-[10px] text-center text-primary-orange font-bold uppercase tracking-widest">
                        Core Schema
                    </p>
                </div>
            </div>

            {/* Property Nodes */}
            {fields.map((field, i) => {
                if (!field.name) return null;
                const angle = (i / fields.length) * 2 * Math.PI;
                const r = 260; // radius
                const x = Math.cos(angle) * r;
                const y = Math.sin(angle) * r;

                return (
                    <div 
                        key={field.name}
                        className={`absolute z-20 px-4 py-2 rounded-lg border shadow-lg transition-transform hover:scale-110 cursor-pointer ${
                            isDark ? 'bg-[#1e202e] border-white/10 text-gray-300' : 'bg-white border-gray-200 text-gray-700'
                        }`}
                        style={{ transform: `translate(${x}px, ${y}px)` }}
                    >
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] font-bold uppercase text-gray-400">{field.type}</span>
                            <span className="text-xs font-bold">{field.name}</span>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Legend/Info panel */}
        <div className={`absolute bottom-6 left-6 p-4 rounded-xl border backdrop-blur-md ${
            isDark ? 'bg-black/40 border-white/10 text-gray-400' : 'bg-white/80 border-gray-200 text-gray-500'
        }`}>
            <h4 className="text-[10px] font-bold uppercase mb-2">Schema Stats</h4>
            <div className="flex gap-4 text-xs">
                <span>Properties: {propKeys.length}</span>
                <span>Type: Object</span>
                <span>Ref: Internal</span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default FlowDesigner;
