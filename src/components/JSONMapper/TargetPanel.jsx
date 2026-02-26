import React from 'react';
import { Globe, ChevronDown, Save, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import JsonTreeView from './JsonTreeView';

const TargetPanel = ({ 
  isDark, 
  cardClass, 
  targetData, 
  activeProfile, 
  DUMMY_PROVIDERS, 
  providerDropdownRef, 
  setProviderDropdownOpen, 
  providerDropdownOpen, 
  setActiveTargetIndex, 
  activeTargetIndex, 
  handleMap, 
  selectedSourcePath, 
  setDropTargetHover, 
  dropTargetHover 
}) => {
  return (
    <div className={`w-[30%] flex flex-col ${cardClass} overflow-hidden`}>
      <div className={`p-4 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
        <div className="flex items-center justify-between">
          <div className="relative flex-1" ref={providerDropdownRef}>
            <button
              onClick={() => setProviderDropdownOpen(!providerDropdownOpen)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-all ${
                isDark 
                  ? 'hover:bg-white/5' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-md ${isDark ? 'bg-primary-orange/10' : 'bg-orange-50'}`}>
                  <Globe size={14} className="text-primary-orange" />
                </div>
                <div className="text-left">
                  <span className={`text-xs font-semibold block ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    {DUMMY_PROVIDERS.find(dp => dp.id === activeProfile.targets[activeTargetIndex]?.providerId)?.name || 'Provider Target'}
                  </span>
                  <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {Object.keys(activeProfile.targets[activeTargetIndex]?.mappings || {}).length} fields mapped
                  </p>
                </div>
              </div>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${providerDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {providerDropdownOpen && (
              <div className={`absolute top-full left-0 mt-2 w-full rounded-lg shadow-xl border z-50 overflow-hidden ${
                isDark 
                  ? 'bg-secondary-dark-bg border-white/10' 
                  : 'bg-white border-gray-200'
              }`}>
                {activeProfile.targets.map((t, idx) => {
                  const providerInfo = DUMMY_PROVIDERS.find(dp => dp.id === t.providerId);
                  const isActive = activeTargetIndex === idx;
                  return (
                    <button
                      key={t.providerId}
                      onClick={() => {
                        setActiveTargetIndex(idx);
                        setProviderDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left ${
                        isActive
                          ? 'bg-primary-orange/10 text-primary-orange'
                          : isDark 
                            ? 'text-gray-300 hover:bg-white/5' 
                            : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Globe size={14} className={isActive ? 'text-primary-orange' : 'text-gray-400'} />
                      <div className="flex-1">
                        <div className="text-xs">{providerInfo?.name || t.providerId}</div>
                        <div className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {Object.keys(t.mappings || {}).length} fields mapped
                        </div>
                      </div>
                      {isActive && <Check size={14} className="text-primary-orange" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <button
            onClick={() => {
              const providerName = DUMMY_PROVIDERS.find(dp => dp.id === activeProfile.targets[activeTargetIndex]?.providerId)?.name;
              toast.success(`Mappings for "${providerName}" saved!`);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              isDark 
                ? 'bg-primary-orange/10 text-primary-orange border border-primary-orange/30 hover:bg-primary-orange/20' 
                : 'bg-orange-50 text-primary-orange border border-primary-orange/30 hover:bg-orange-100'
            }`}
          >
            <Save size={12} />
            Save
          </button>
        </div>
      </div>
      <div className="flex-1 p-3 overflow-auto">
        <JsonTreeView 
          data={targetData} 
          onMap={handleMap}
          onSelect={(path) => selectedSourcePath && handleMap(selectedSourcePath, path)}
          dragInfo={{ setHover: setDropTargetHover, hover: dropTargetHover }}
          mappings={activeProfile.targets[activeTargetIndex]?.mappings || {}}
          isDark={isDark}
        />
      </div>
    </div>
  );
};

export default TargetPanel;