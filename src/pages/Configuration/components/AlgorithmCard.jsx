import React from 'react';
import { Lock, Terminal, EyeOff, ChevronRight } from 'lucide-react';

/**
 * AlgorithmCard - Presentational component for a single masking algorithm.
 * Mandatory Rules: One responsibility, no business logic, no API calls.
 * Props: algo (object), isDark (bool), onClick (func)
 */
const AlgorithmCard = ({ algo, isDark, onClick }) => {
  const iconMap = {
    Encryption: <Lock size={20} />,
    Hashing: <Terminal size={20} />,
    Masking: <EyeOff size={20} />,
  };

  const iconColorMap = {
    Encryption: 'bg-purple-500/10 text-purple-500',
    Hashing: 'bg-blue-500/10 text-blue-500',
    Masking: 'bg-orange-500/10 text-orange-500',
  };

  const strengthColor = algo.strength === 'Maximum' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500';

  return (
    <div
      onClick={onClick}
      className={`group p-6 rounded-2xl border transition-all cursor-pointer hover:shadow-xl hover:-translate-y-1 ${
        isDark
          ? 'bg-secondary-dark-bg border-white/10 hover:border-primary-orange/50'
          : 'bg-white border-gray-100 hover:border-primary-orange/30 shadow-sm'
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${iconColorMap[algo.type] || 'bg-gray-500/10 text-gray-500'}`}>
          {iconMap[algo.type]}
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${strengthColor}`}>
            {algo.strength} Strength
          </span>
          <span className="text-[9px] font-mono text-gray-500">{algo.id}</span>
        </div>
      </div>

      <h3 className={`text-lg font-bold mb-2 group-hover:text-primary-orange transition-colors ${isDark ? 'text-white' : 'text-gray-800'}`}>
        {algo.name}
      </h3>
      <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {algo.description}
      </p>

      <div className={`p-3 rounded-lg font-mono text-xs flex items-center justify-between ${isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-50 text-gray-400'}`}>
        <span className="truncate">{algo.example}</span>
        <ChevronRight size={14} className="shrink-0 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0" />
      </div>
    </div>
  );
};

export default AlgorithmCard;
