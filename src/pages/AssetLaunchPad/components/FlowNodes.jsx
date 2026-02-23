import React from 'react';
import { Handle, Position } from '@xyflow/react';

// --- Shared Floating Animation Style ---
export const NodeStyles = () => (
  <style>{`
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-5px); }
    }
    .animate-float { animation: float 3s ease-in-out infinite; }
  `}</style>
);

// --- Custom Node Component: PREMIUM GLASS CARD (Icon + Label Inside) ---
export const PremiumNode = ({ data, selected }) => {
  const Icon = data.icon;
  const isDark = data.theme === 'dark';
  const glow = data.glowColor || '#3b82f6';

  return (
    <div className="relative group p-2">
      <NodeStyles />
      <div
        className={`
          w-40 h-28 rounded-2xl border backdrop-blur-md transition-all duration-500
          flex flex-col items-center justify-center gap-2
          ${isDark 
            ? "bg-white/5 border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]" 
            : "bg-black/5 border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.05)]"}
          ${selected ? "ring-2 ring-blue-500/40" : ""}
          group-hover:translate-y-[-2px] group-hover:scale-105
        `}
        style={{
          boxShadow: `0 0 20px ${glow}44, inset 0 0 12px ${glow}22`,
          borderColor: selected ? glow : `${glow}66`
        }}
      >
        <div className={`p-2 rounded-xl scale-125 animate-float`}>
          <Icon className={`${data.color} w-8 h-8`} />
        </div>
        <span 
          className="text-[11px] font-bold uppercase tracking-widest text-center px-4"
          style={{ color: glow, textShadow: `0 1px 4px ${glow}33` }}
        >
          {data.label}
        </span>

        {/* Standardized Handles */}
        <Handle type="target" position={Position.Top} id="top" className="!bg-transparent !border-none" />
        <Handle type="source" position={Position.Top} id="top-src" className="!bg-transparent !border-none" />
        <Handle type="target" position={Position.Bottom} id="bottom" className="!bg-transparent !border-none" />
        <Handle type="source" position={Position.Bottom} id="bottom-src" className="!bg-transparent !border-none" />
        <Handle type="target" position={Position.Left} id="left" className="!bg-transparent !border-none" />
        <Handle type="source" position={Position.Left} id="left-src" className="!bg-transparent !border-none" />
        <Handle type="target" position={Position.Right} id="right" className="!bg-transparent !border-none" />
        <Handle type="source" position={Position.Right} id="right-src" className="!bg-transparent !border-none" />
      </div>
    </div>
  );
};

// --- Custom Node Component: CIRCULAR GLASSY ---
export const CircularNode = ({ data, selected }) => {
  const Icon = data.icon;
  const isDark = data.theme === 'dark';
  const glow = data.glowColor || '#3b82f6';

  return (
    <div className="flex flex-col items-center gap-4">
      <NodeStyles />
      <div
        className={`
          w-24 h-24 rounded-full border-2 backdrop-blur-2xl transition-all duration-500
          flex items-center justify-center
          ${isDark 
            ? "bg-white/10 border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.05)]" 
            : "bg-black/5 border-black/10 shadow-[0_0_40px_rgba(0,0,0,0.05)]"}
          ${selected ? "ring-4 ring-blue-500/20" : ""}
          animate-float
        `}
        style={{
          boxShadow: `0 0 25px ${glow}66, inset 0 0 15px ${glow}33`,
          borderColor: glow
        }}
      >
        <Icon className={`${data.color} w-10 h-10`} />
        
        <Handle type="target" position={Position.Top} id="top" className="!bg-transparent !border-none" />
        <Handle type="source" position={Position.Top} id="top-src" className="!bg-transparent !border-none" />
        <Handle type="target" position={Position.Bottom} id="bottom" className="!bg-transparent !border-none" />
        <Handle type="source" position={Position.Bottom} id="bottom-src" className="!bg-transparent !border-none" />
        <Handle type="target" position={Position.Left} id="left" className="!bg-transparent !border-none" />
        <Handle type="source" position={Position.Left} id="left-src" className="!bg-transparent !border-none" />
        <Handle type="target" position={Position.Right} id="right" className="!bg-transparent !border-none" />
        <Handle type="source" position={Position.Right} id="right-src" className="!bg-transparent !border-none" />
      </div>
      <span 
        className="text-[10px] font-bold uppercase tracking-widest"
        style={{ color: glow, textShadow: `0 1px 3px ${glow}33` }}
      >
        {data.label}
      </span>
    </div>
  );
};
