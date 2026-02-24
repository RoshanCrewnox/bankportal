import React from 'react';
import { ShieldAlert, Info, ChevronRight, Hash } from 'lucide-react';
import { MASKING_ALGORITHMS } from '../../../utils/maskingConstants';

/**
 * MaskingConfigView - Presentational component for the masking configuration form.
 * Mandatory Rules: One responsibility, no business logic, no API calls.
 */
const MaskingConfigView = ({ 
  isDark, 
  hookData // Destructure everything needed from the hook
}) => {
  const {
    selectedCDM, setSelectedCDM,
    selectedField, setSelectedField,
    selectedAlgo, setSelectedAlgo,
    isManualSelection,
    selectedLevel, setSelectedLevel,
    params, setParams,
    uniqueCDMs, filteredFields,
    currentAlgo
  } = hookData;

  const handleParamChange = (paramId, value) => {
    setParams(prev => ({ ...prev, [paramId]: value }));
  };

  return (
    <div className="flex-1 space-y-6">
      {/* Target Data Selection */}
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-secondary-dark-bg border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
        <h3 className={`text-sm font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          <ShieldAlert className="text-primary-orange" size={18} />
          Target Selection
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Select CDM Service
            </label>
            <div className="relative">
              <select 
                value={selectedCDM}
                onChange={(e) => setSelectedCDM(e.target.value)}
                className={`w-full p-3 rounded-xl border appearance-none focus:ring-2 focus:ring-primary-orange outline-none transition-all ${
                  isDark ? 'bg-white/5 border-white/10 text-white scheme-dark' : 'bg-gray-50 border-gray-200 text-gray-800'
                }`}
              >
                <option value="" disabled={uniqueCDMs.length > 0} className={isDark ? 'bg-secondary-dark-bg text-white' : 'bg-white text-gray-800'}>
                  {uniqueCDMs.length > 0 ? "Select CDM Service..." : "Nothing to select"}
                </option>
                {uniqueCDMs.map(cdm => (
                  <option key={cdm} value={cdm} className={isDark ? 'bg-secondary-dark-bg text-white' : 'bg-white text-gray-800'}>{cdm}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronRight size={16} className="rotate-90" />
              </div>
            </div>
          </div>
          <div>
            <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Select Target Field
            </label>
            <div className="relative">
              <select 
                value={selectedField}
                onChange={(e) => setSelectedField(e.target.value)}
                disabled={!selectedCDM}
                className={`w-full p-3 rounded-xl border appearance-none focus:ring-2 focus:ring-primary-orange outline-none transition-all disabled:opacity-50 ${
                  isDark ? 'bg-white/5 border-white/10 text-white scheme-dark' : 'bg-gray-50 border-gray-200 text-gray-800'
                }`}
              >
                <option value="" disabled className={isDark ? 'bg-secondary-dark-bg text-white' : 'bg-white text-gray-800'}>
                  {selectedCDM ? "Select Data Field..." : "Choose a CDM first..."}
                </option>
                {filteredFields.map(field => (
                  <option key={field.field_uuid} value={field.field_uuid} className={isDark ? 'bg-secondary-dark-bg text-white' : 'bg-white text-gray-800'}>
                    {field.field_name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <ChevronRight size={16} className="rotate-90" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Algorithm Configuration */}
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-secondary-dark-bg border-white/10' : 'bg-white border-gray-100 shadow-sm'}`}>
        <h3 className={`text-sm font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-800'}`}>
          <Hash className="text-primary-orange" size={18} />
          Algorithm Configuration
        </h3>
        
        <div className="space-y-6">
          <div>
            <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Select Protection Algorithm
            </label>
            {isManualSelection ? (
              <div className="relative">
                <select 
                  value={selectedAlgo}
                  onChange={(e) => setSelectedAlgo(e.target.value)}
                  className={`w-full p-3 rounded-xl border appearance-none focus:ring-2 focus:ring-primary-orange outline-none transition-all ${
                    isDark ? 'bg-white/5 border-white/10 text-white scheme-dark' : 'bg-gray-50 border-gray-200 text-gray-800'
                  }`}
                >
                  {MASKING_ALGORITHMS.map(algo => (
                    <option key={algo.id} value={algo.id} className={isDark ? 'bg-secondary-dark-bg text-white' : 'bg-white text-gray-800'}>{algo.name}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <ChevronRight size={16} className="rotate-90" />
                </div>
              </div>
            ) : (
              <div className={`p-4 rounded-xl border flex items-center justify-between ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
                <div>
                  <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>{currentAlgo?.name}</div>
                  <div className="text-[10px] font-mono text-primary-orange mt-0.5">{currentAlgo?.id}</div>
                </div>
                <div className={`px-2 py-1 rounded bg-orange-500/10 text-orange-500 text-[10px] font-bold uppercase`}>
                  {currentAlgo?.type}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Algorithm & ID
            </label>
            <div className={`p-4 rounded-xl border flex items-center justify-between ${isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
              <div>
                <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-800'}`}>{currentAlgo?.name}</div>
                <div className="text-[10px] font-mono text-primary-orange mt-0.5">{currentAlgo?.id}</div>
              </div>
              <div className={`px-2 py-1 rounded bg-orange-500/10 text-orange-500 text-[10px] font-bold uppercase`}>
                {currentAlgo?.type}
              </div>
            </div>
          </div>

          {currentAlgo?.params && currentAlgo.params.map(param => (
            <div key={param.id}>
              <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {param.name}
              </label>
              <input 
                type={param.type}
                value={params[param.id] !== undefined ? params[param.id] : param.default}
                onChange={(e) => handleParamChange(param.id, e.target.value)}
                className={`w-full p-2.5 rounded-lg border focus:ring-2 focus:ring-primary-orange outline-none transition-all ${
                  isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'
                }`}
              />
            </div>
          ))}
          
          <div>
            <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Test Value Override
            </label>
            <div className="relative">
              <input 
                type="text"
                value={hookData.testValue}
                onChange={(e) => hookData.setTestValue(e.target.value)}
                className={`w-full p-3 rounded-xl border focus:ring-2 focus:ring-primary-orange outline-none transition-all ${
                  isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-800'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaskingConfigView;
