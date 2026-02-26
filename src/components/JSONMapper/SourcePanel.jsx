import React from 'react';
import { Database, ChevronDown, Check } from 'lucide-react';
import JsonTreeView from './JsonTreeView';

const SourcePanel = ({ 
  isDark, 
  cardClass, 
  sourceData, 
  activeProfile, 
  DUMMY_SCHEMAS, 
  sourceDropdownRef, 
  setSourceDropdownOpen, 
  sourceDropdownOpen, 
  setActiveProfile, 
  setSelectedSourcePath, 
  selectedSourcePath, 
  setDraggedSourcePath, 
  activeTargetIndex 
}) => {
  return (
    <div className={`w-[30%] flex flex-col ${cardClass} overflow-hidden`}>
      <div className={`p-4 border-b ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
        <div className="relative" ref={sourceDropdownRef}>
          <button
            onClick={() => setSourceDropdownOpen(!sourceDropdownOpen)}
            className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-all ${
              isDark 
                ? 'hover:bg-white/5' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-md ${isDark ? 'bg-primary-orange/10' : 'bg-orange-50'}`}>
                <Database size={14} className="text-primary-orange" />
              </div>
              <div className="text-left">
                <span className={`text-xs font-semibold block ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {activeProfile.sourceSchemaId ? (DUMMY_SCHEMAS.find(s => s.id === activeProfile.sourceSchemaId)?.name || activeProfile.sourceSchemaId) : 'Select Source'}
                </span>
                <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {activeProfile.sourceSchemaId ? (activeProfile.sourceType === 'PRESET' ? 'Preset Schema' : 'Custom Schema') : 'No source selected'}
                </p>
              </div>
            </div>
            <ChevronDown size={14} className={`text-gray-400 transition-transform ${sourceDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {sourceDropdownOpen && (
            <div className={`absolute top-full left-0 mt-2 w-full rounded-lg shadow-xl border z-50 overflow-hidden ${
              isDark 
                ? 'bg-secondary-dark-bg border-white/10' 
                : 'bg-white border-gray-200'
            }`}>
              {DUMMY_SCHEMAS.map((schema) => {
                const isActive = activeProfile.sourceSchemaId === schema.id;
                return (
                  <button
                    key={schema.id}
                    onClick={() => {
                      setActiveProfile(prev => ({ ...prev, sourceSchemaId: schema.id }));
                      setSourceDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all text-left ${
                      isActive
                        ? 'bg-primary-orange/10 text-primary-orange'
                        : isDark 
                          ? 'text-gray-300 hover:bg-white/5' 
                          : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Database size={14} className={isActive ? 'text-primary-orange' : 'text-gray-400'} />
                    <div className="flex-1">
                      <div className="text-xs">{schema.name}</div>
                      <div className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {schema.type}
                      </div>
                    </div>
                    {isActive && <Check size={14} className="text-primary-orange" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 p-3 overflow-auto">
        <JsonTreeView 
          data={sourceData} 
          isSource={true}
          onSelect={setSelectedSourcePath}
          selectedPath={selectedSourcePath}
          dragInfo={{ setDragged: setDraggedSourcePath }}
          mappings={activeProfile.targets[activeTargetIndex]?.mappings || {}}
          isDark={isDark}
        />
      </div>
    </div>
  );
};

export default SourcePanel;