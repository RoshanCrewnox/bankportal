import React, { useContext } from 'react';
import { Shield, ArrowLeft, Info } from 'lucide-react';
import { ThemeContext } from '../../../components/common/ThemeContext';
import { useDataMasking } from '../../../hooks/useDataMasking';
import { MASKING_ALGORITHMS } from '../../../utils/maskingConstants';
import AlgorithmCard from './AlgorithmCard';
import JsonImpactPreview from './JsonImpactPreview';
import MaskingConfigView from './MaskingConfigView';

/**
 * DataMasking Orchestrator
 * Mandatory Rules: Orchestrates UI + Hooks. NO Business Logic. NO API calls. < 200 lines.
 */
const DataMasking = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  
  // Consume all business logic and state from the central hook
  const hookData = useDataMasking();
  const { view, setView, setIsManualSelection, setSelectedAlgo, getJsonPreview, currentFieldObj } = hookData;

  const handleCardClick = (algoId) => {
    setSelectedAlgo(algoId);
    setIsManualSelection(false);
    setView('configure');
  };

  const handleMaskNewClick = () => {
    setIsManualSelection(true);
    setView('configure');
  };

  if (view === 'configure') {
    return (
      <div className={`w-full max-w-7xl ${isDark ? 'text-white' : 'text-gray-800'}`}>
        {/* Header section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>Dynamic Masking Configuration</h1>
          
          <button 
            onClick={() => setView('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all border ${
              isDark 
              ? 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10' 
              : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-800 hover:bg-gray-100'
            }`}
          >
            <ArrowLeft size={16} />
            Back to Algorithms
          </button>
        </div>

        {/* Configuration Grid */}
        <div className="flex gap-6 relative">
          <MaskingConfigView isDark={isDark} hookData={hookData} />
          
          <div className="w-[500px] shrink-0 sticky top-6 self-start space-y-4">
            <JsonImpactPreview 
              jsonPreview={getJsonPreview()} 
              maskedFieldName={currentFieldObj?.field_name || "Account_Number"}
              isDark={isDark} 
            />
            
            {/* Action Buttons */}
            <div className="flex gap-4">
              <button 
                onClick={() => setView('list')}
                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all border ${
                  isDark ? 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                }`}
              >
                Discard
              </button>
              <button 
                className="flex-2 py-3 px-6 bg-primary-orange text-white rounded-xl font-medium hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
              >
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin hidden" />
                <span>✓ Deploy Policy</span>
              </button>
            </div>
          </div>
        </div>

        {/* Info Note */}
        <div className={`mt-8 p-4 rounded-xl border flex items-start gap-3 ${isDark ? 'bg-orange-500/5 border-orange-500/20' : 'bg-orange-50 border-orange-200'}`}>
          <Info className="text-primary-orange shrink-0 mt-0.5" size={18} />
          <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Applying this masking policy will affect all outgoing data streams for the selected CDM field. The original data will remain encrypted in cold storage.
          </p>
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className={`w-full flex flex-col ${isDark ? 'text-white' : 'text-gray-800'}`}>
      <div className="flex justify-end mb-6 shrink-0">
        <button 
          onClick={handleMaskNewClick}
          className="px-6 py-2.5 bg-primary-orange text-white rounded-xl font-medium hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
        >
          Mask New Field
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
        {MASKING_ALGORITHMS.map(algo => (
          <AlgorithmCard 
            key={algo.id} 
            algo={algo} 
            isDark={isDark} 
            onClick={() => handleCardClick(algo.id)} 
          />
        ))}
      </div>
    </div>
  );
};

export default DataMasking;
