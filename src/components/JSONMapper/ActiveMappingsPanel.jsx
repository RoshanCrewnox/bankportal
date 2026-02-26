import React from 'react';
import { ArrowRightLeft, Trash2 } from 'lucide-react';

const ActiveMappingsPanel = ({ 
  isDark, 
  cardClass, 
  activeProfile, 
  activeTargetIndex, 
  removeMapping 
}) => {
  return (
    <div className={`flex-1 flex flex-col ${cardClass} overflow-hidden`}>
      <div className={`p-4 border-b ${isDark ? 'border-white/5' : 'border-gray-100'} flex items-center gap-3`}>
        <div className={`p-1.5 rounded-md ${isDark ? 'bg-primary-orange/10' : 'bg-orange-50'}`}>
          <ArrowRightLeft size={14} className="text-primary-orange" />
        </div>
        <span className={`text-xs font-semibold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
          Active Mappings
        </span>
        <span className={`ml-auto px-2.5 py-1 rounded-full text-xs font-semibold ${
          Object.keys(activeProfile.targets[activeTargetIndex]?.mappings || {}).length > 0
            ? 'bg-primary-orange/10 text-primary-orange'
            : isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'
        }`}>
          {Object.keys(activeProfile.targets[activeTargetIndex]?.mappings || {}).length} rules
        </span>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        {Object.keys(activeProfile.targets[activeTargetIndex]?.mappings || {}).length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className={`p-4 rounded-2xl mb-4 ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
              <ArrowRightLeft size={28} className="text-gray-400" />
            </div>
            <p className={`text-sm font-semibold ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              No mappings yet
            </p>
            <p className={`text-xs mt-2 max-w-[200px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              Select a field from CDM Source, then click a field in Provider Target to create a mapping
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.entries(activeProfile.targets[activeTargetIndex]?.mappings || {}).map(([tgt, src]) => (
              <div 
                key={tgt} 
                className={`group flex items-center gap-3 p-4 rounded-xl border transition-all ${
                  isDark 
                    ? 'bg-darkbg border-white/10 hover:border-primary-orange/30' 
                    : 'bg-gray-50 border-gray-200 hover:border-primary-orange/30'
                }`}
              >
                {/* Source */}
                <div className="flex-1 min-w-0">
                  <div className={`text-[10px] uppercase tracking-wider mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Source
                  </div>
                  <div className={`text-xs font-mono font-semibold truncate ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    {src}
                  </div>
                </div>

                {/* Arrow */}
                <div className={`p-2 rounded-lg ${isDark ? 'bg-primary-orange/10' : 'bg-orange-50'}`}>
                  <ArrowRightLeft size={14} className="text-primary-orange" />
                </div>

                {/* Target */}
                <div className="flex-1 min-w-0">
                  <div className={`text-[10px] uppercase tracking-wider mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    Target
                  </div>
                  <div className="text-xs font-mono font-semibold truncate text-primary-orange">
                    {tgt}
                  </div>
                </div>

                {/* Delete */}
                <button 
                  onClick={() => removeMapping(tgt)} 
                  className={`p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${
                    isDark 
                      ? 'text-gray-500 hover:text-red-400 hover:bg-red-400/10' 
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                  }`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveMappingsPanel;