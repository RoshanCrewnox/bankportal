import React, { useState } from 'react';
import { ArrowLeft, ArrowRightLeft, Database, Globe, Trash2 } from 'lucide-react';
import Button from '../common/Button';
import CustomSelect from '../OpenBanking/CustomSelect';
import NewAlertBox from '../common/NewAlertBox';

const MappingSetupForm = ({ 
  isDark, 
  cardClass, 
  activeProfile, 
  setCurrentView, 
  updateActiveProfile, 
  onBack,
  activeProfileId, 
  DUMMY_SCHEMAS, 
  DUMMY_PROVIDERS, 
  isSourceSelectOpen, 
  setIsSourceSelectOpen, 
  isTargetSelectOpen, 
  setIsTargetSelectOpen,
  inputClass
}) => {
  const [sourceToDeleteIdx, setSourceToDeleteIdx] = useState(null);
  const [targetToDeleteIdx, setTargetToDeleteIdx] = useState(null);

  const handleConfirmDeleteSource = () => {
    if (sourceToDeleteIdx !== null) {
      updateActiveProfile(p => {
        const newSources = (p.sources || []).filter((_, i) => i !== sourceToDeleteIdx);
        return {
          ...p,
          sources: newSources,
          sourceSchemaId: newSources[0]?.schemaId || '',
          sourceJsonText: newSources[0] ? DUMMY_SCHEMAS.find(s => s.id === newSources[0].schemaId)?.data || '{}' : '{}'
        };
      });
      setSourceToDeleteIdx(null);
    }
  };

  const handleConfirmDeleteTarget = () => {
    if (targetToDeleteIdx !== null) {
      updateActiveProfile(p => ({
        ...p,
        targets: p.targets.filter((_, i) => i !== targetToDeleteIdx)
      }));
      setTargetToDeleteIdx(null);
    }
  };

  return (
    <div className={`space-y-6 animate-in fade-in duration-500 pb-10 ${isDark ? 'text-white' : 'text-gray-800'}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Mapping Configuration</h1>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Define source schemas and target destinations
            </p>
          </div>
        </div>
        <Button 
          variant="primary"
          onClick={() => setCurrentView('MAPPING')}
          disabled={!activeProfile.name || !activeProfile.sourceSchemaId || activeProfile.targets.length === 0}
          icon={<ArrowRightLeft size={18} />}
        >
          Open Visual Mapper
        </Button>
      </div>

      {/* General Details Card */}
      <div className={`p-6 ${cardClass}`}>
        <h2 className={`text-lg font-semibold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          General Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Mapping Name
            </label>
            <input 
              type="text"
              value={activeProfile.name}
              onChange={(e) => updateActiveProfile(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g., Unified Stripe Sync"
              className={inputClass}
            />
          </div>
          <div className="space-y-2">
            <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Description
            </label>
            <input 
              type="text"
              value={activeProfile.description}
              onChange={(e) => updateActiveProfile(p => ({ ...p, description: e.target.value }))}
              placeholder="Briefly describe what this mapping does..."
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Source & Target Configuration - Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Source Configuration Card */}
        <div className={`p-6 ${cardClass}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Source Configuration
            </h2>
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
              isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'
            }`}>
              {(activeProfile.sources?.length || (activeProfile.sourceSchemaId ? 1 : 0))} selected
            </span>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Add Source Schema
                </label>
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Input Data Structure
                </span>
              </div>
              <CustomSelect 
                options={DUMMY_SCHEMAS.filter(s => !(activeProfile.sources || []).some(src => src.schemaId === s.id)).map(s => ({ label: s.name, value: s.id }))}
                value=""
                onChange={(val) => {
                  const schema = DUMMY_SCHEMAS.find(s => s.id === val);
                  if (schema) {
                    updateActiveProfile(p => {
                      const currentSources = p.sources || [];
                      // If there's a legacy sourceSchemaId, migrate it
                      if (p.sourceSchemaId && currentSources.length === 0) {
                        const legacySchema = DUMMY_SCHEMAS.find(s => s.id === p.sourceSchemaId);
                        return {
                          ...p,
                          sources: [
                            { schemaId: p.sourceSchemaId, jsonText: legacySchema?.data || "{}" },
                            { schemaId: val, jsonText: schema.data }
                          ],
                          sourceSchemaId: '', // Clear legacy single source ID
                          sourceJsonText: '' // Clear legacy single source JSON
                        };
                      }
                      return {
                        ...p,
                        sources: [...currentSources, { schemaId: val, jsonText: schema.data }]
                      };
                    });
                  }
                }}
                searchable={true}
                isOpen={isSourceSelectOpen}
                onToggle={() => {
                  setIsSourceSelectOpen(!isSourceSelectOpen);
                  setIsTargetSelectOpen(false);
                }}
                disabled={DUMMY_SCHEMAS.length === (activeProfile.sources?.length || 0)}
              />
            </div>

            {((activeProfile.sources?.length > 0) || activeProfile.sourceSchemaId) && (
              <div className={`space-y-3 pt-4 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Configured Sources
                </label>
                <div className="space-y-3">
                  {(activeProfile.sources?.length > 0 
                    ? activeProfile.sources 
                    : activeProfile.sourceSchemaId 
                      ? [{ schemaId: activeProfile.sourceSchemaId }] 
                      : []
                  ).map((src, idx) => {
                    const schemaInfo = DUMMY_SCHEMAS.find(s => s.id === src.schemaId);
                    return (
                      <div 
                        key={src.schemaId} 
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                          isDark 
                            ? 'bg-darkbg border-white/5 hover:border-white/10' 
                            : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isDark ? 'bg-primary-orange/10' : 'bg-orange-50'}`}>
                            <Database size={16} className="text-primary-orange" />
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {schemaInfo?.name || src.schemaId}
                            </p>
                            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                              {schemaInfo?.type || 'Schema'}
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setSourceToDeleteIdx(idx)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDark 
                              ? 'text-gray-500 hover:text-red-400 hover:bg-red-400/10' 
                              : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Target Destinations Card */}
        <div className={`p-6 ${cardClass}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Target Destinations
            </h2>
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
              isDark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'
            }`}>
              {activeProfile.targets.length} selected
            </span>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Add Target Provider
                </label>
                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Output Schema
                </span>
              </div>
              <CustomSelect 
                options={DUMMY_PROVIDERS.filter(dp => !activeProfile.targets.some(t => t.providerId === dp.id)).map(p => ({ label: p.name, value: p.id }))}
                value=""
                onChange={(val) => {
                  const provider = DUMMY_PROVIDERS.find(p => p.id === val);
                  if (provider) {
                    updateActiveProfile(p => ({
                      ...p,
                      targets: [...p.targets, {
                        providerId: val,
                        jsonText: provider.data,
                        mappings: {}
                      }]
                    }));
                  }
                }}
                searchable={true}
                isOpen={isTargetSelectOpen}
                onToggle={() => {
                  setIsTargetSelectOpen(!isTargetSelectOpen);
                  setIsSourceSelectOpen(false);
                }}
                disabled={DUMMY_PROVIDERS.length === activeProfile.targets.length}
              />
            </div>

            {activeProfile.targets.length > 0 && (
              <div className={`space-y-3 pt-4 border-t ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
                <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Configured Destinations
                </label>
                <div className="space-y-3">
                  {activeProfile.targets.map((t, idx) => {
                    const providerInfo = DUMMY_PROVIDERS.find(dp => dp.id === t.providerId);
                    return (
                      <div 
                        key={t.providerId} 
                        className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                          isDark 
                            ? 'bg-darkbg border-white/5 hover:border-white/10' 
                            : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${isDark ? 'bg-primary-orange/10' : 'bg-orange-50'}`}>
                            <Globe size={16} className="text-primary-orange" />
                          </div>
                          <div>
                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {providerInfo?.name || t.providerId}
                            </p>
                            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                              {Object.keys(t.mappings || {}).length} fields mapped
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setTargetToDeleteIdx(idx)}
                          className={`p-2 rounded-lg transition-colors ${
                            isDark 
                              ? 'text-gray-500 hover:text-red-400 hover:bg-red-400/10' 
                              : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                          }`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Source Confirmation */}
      <NewAlertBox 
        showAlert={sourceToDeleteIdx !== null}
        title="Remove Source"
        message="Are you sure you want to remove this source schema? Any mappings associated with it might be affected."
        onConfirm={handleConfirmDeleteSource}
        onCancel={() => setSourceToDeleteIdx(null)}
        type="error"
        confirmText="Remove"
      />

      {/* Delete Target Confirmation */}
      <NewAlertBox 
        showAlert={targetToDeleteIdx !== null}
        title="Remove Target"
        message="Are you sure you want to remove this target destination? All mappings for this provider will be lost."
        onConfirm={handleConfirmDeleteTarget}
        onCancel={() => setTargetToDeleteIdx(null)}
        type="error"
        confirmText="Remove"
      />
    </div>
  );
};

export default MappingSetupForm;