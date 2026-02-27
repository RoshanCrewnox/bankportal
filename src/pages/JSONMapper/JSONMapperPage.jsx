import React, { useContext } from 'react';
import { 
  ArrowRightLeft,
  Globe,
  ArrowLeft,
  Plus,
  Trash2,
  Eye,
  Edit3,
  Database,
  ChevronRight,
  ChevronDown,
  Braces,
  Square,
  Code,
  Save,
  X,
  Layers,
  Check
} from 'lucide-react';
import { ThemeContext } from '../../components/common/ThemeContext';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import toast from 'react-hot-toast';

// Import extracted components
import JsonTreeView from '../../components/JSONMapper/JsonTreeView';
import PreviewModal from '../../components/JSONMapper/PreviewModal';
import SourcePanel from '../../components/JSONMapper/SourcePanel';
import TargetPanel from '../../components/JSONMapper/TargetPanel';
import ActiveMappingsPanel from '../../components/JSONMapper/ActiveMappingsPanel';
import MappingProfileList from '../../components/JSONMapper/MappingProfileList';
import MappingSetupForm from '../../components/JSONMapper/MappingSetupForm';

// Import custom hook
import useJSONMapper from '../../hooks/JSONMapper/useJSONMapper';

const TransformationPage = () => {
   const { theme } = useContext(ThemeContext);
   const isDark = theme === 'dark';
  
  // Use the custom hook to manage all business logic
  const {
    currentView,
    setCurrentView,
    showPreviewModal,
    setShowPreviewModal,
    profiles,
    setProfiles,
    activeProfileId,
    setActiveProfileId,
    activeTargetIndex,
    setActiveTargetIndex,
    handleCreateNew,
    saveDraftProfile,
    cancelDraftProfile,
    updateActiveProfile,
    handleMap,
    removeMapping,
    getMappedKeyJson,
    getCurrentProviderMappingJson,
    sourceData,
    targetData,
    cardClass,
    inputClass,
    activeProfile,
    draftProfile,
    isSourceSelectOpen,
    setIsSourceSelectOpen,
    isTargetSelectOpen,
    setIsTargetSelectOpen,
    draggedSourcePath,
    setDraggedSourcePath,
    selectedSourcePath,
    setSelectedSourcePath,
    dropTargetHover,
    setDropTargetHover,
    providerDropdownOpen,
    setProviderDropdownOpen,
    sourceDropdownOpen,
    setSourceDropdownOpen,
    providerDropdownRef,
    sourceDropdownRef,
    DUMMY_SCHEMAS,
    DUMMY_PROVIDERS,
    CDM_JSON
  } = useJSONMapper();

  // View: LIST
  if (currentView === 'LIST') {
    return (
      <MappingProfileList 
        isDark={isDark}
        profiles={profiles}
        handleCreateNew={handleCreateNew}
        setActiveProfileId={setActiveProfileId}
        setActiveTargetIndex={setActiveTargetIndex}
        setCurrentView={setCurrentView}
        cardClass={cardClass}
        setProfiles={setProfiles}
      />
    );
  }

  // View: SETUP
  if (currentView === 'SETUP') {
    if (!activeProfile) return <div className="p-8 text-center text-gray-500">Profile not found</div>;
    
    return (
      <MappingSetupForm 
        isDark={isDark}
        activeProfile={activeProfile}
        setCurrentView={setCurrentView}
        onBack={() => cancelDraftProfile()}
        cardClass={cardClass}
        inputClass={inputClass}
        updateActiveProfile={updateActiveProfile}
        activeProfileId={activeProfileId}
        isSourceSelectOpen={isSourceSelectOpen}
        setIsSourceSelectOpen={setIsSourceSelectOpen}
        isTargetSelectOpen={isTargetSelectOpen}
        setIsTargetSelectOpen={setIsTargetSelectOpen}
        DUMMY_SCHEMAS={DUMMY_SCHEMAS}
        DUMMY_PROVIDERS={DUMMY_PROVIDERS}
        CDM_JSON={CDM_JSON}
      />
    );
  }

  // View: MAPPING
  if (!activeProfile) return <div className="p-8 text-center text-gray-500">No active profile selected</div>;
  
  return (
    <div className={`flex flex-col h-[calc(100vh-140px)] animate-in fade-in duration-500 ${isDark ? 'text-white' : 'text-gray-800'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between gap-4 pb-4 border-b ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setCurrentView('SETUP')}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold">{activeProfile.name || 'Visual Mapping'}</h1>
              <StatusBadge status="MAPPING" />
            </div>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Mapping to <span className="text-primary-orange font-medium">{activeProfile.targets[activeTargetIndex]?.providerId}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowPreviewModal(!showPreviewModal)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isDark 
                ? 'bg-darkbg border border-white/10 text-gray-300 hover:bg-white/5' 
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Code size={16} />
            Preview JSON
          </button>
          <button 
            onClick={() => saveDraftProfile()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary-orange text-white hover:bg-primary-orange/90 transition-all shadow-lg shadow-primary-orange/20"
          >
            <Save size={16} />
            Save & Close
          </button>
        </div>
      </div>

      {/* Mapping Panels */}
      <div className="flex-1 flex overflow-hidden mt-4 gap-4">
        {/* Source Panel */}
        <SourcePanel 
          isDark={isDark}
          cardClass={cardClass}
          activeProfile={activeProfile}
          sourceData={sourceData}
          selectedSourcePath={selectedSourcePath}
          setSelectedSourcePath={setSelectedSourcePath}
          setDraggedSourcePath={setDraggedSourcePath}
          activeTargetIndex={activeTargetIndex}
          DUMMY_SCHEMAS={DUMMY_SCHEMAS}
          sourceDropdownOpen={sourceDropdownOpen}
          setSourceDropdownOpen={setSourceDropdownOpen}
          sourceDropdownRef={sourceDropdownRef}
        />

        {/* Middle Panel - Rules */}
        <ActiveMappingsPanel 
          isDark={isDark}
          cardClass={cardClass}
          activeProfile={activeProfile}
          activeTargetIndex={activeTargetIndex}
          removeMapping={removeMapping}
        />

        {/* Target Panel */}
        <TargetPanel 
          isDark={isDark}
          cardClass={cardClass}
          activeProfile={activeProfile}
          targetData={targetData}
          handleMap={handleMap}
          selectedSourcePath={selectedSourcePath}
          setDropTargetHover={setDropTargetHover}
          dropTargetHover={dropTargetHover}
          activeTargetIndex={activeTargetIndex}
          setActiveTargetIndex={setActiveTargetIndex}
          DUMMY_PROVIDERS={DUMMY_PROVIDERS}
          providerDropdownOpen={providerDropdownOpen}
          setProviderDropdownOpen={setProviderDropdownOpen}
          providerDropdownRef={providerDropdownRef}
          toast={toast}
        />
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <PreviewModal 
          isDark={isDark}
          cardClass={cardClass}
          onClose={() => setShowPreviewModal(false)}
          allProvidersJson={getMappedKeyJson()}
          currentProviderJson={getCurrentProviderMappingJson()}
          currentProviderName={DUMMY_PROVIDERS.find(dp => dp.id === activeProfile.targets[activeTargetIndex]?.providerId)?.name || 'Current Provider'}
        />
      )}
    </div>
  );
};

export default TransformationPage;
