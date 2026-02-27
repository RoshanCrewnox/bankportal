import { useState, useMemo, useEffect, useRef } from 'react';

// Sample data
const CDM_JSON = JSON.stringify({
  customer: {
    customer_uuid: "CUST-UUID-001",
    customer_type: "RETAIL",
    full_name: "Mohsin Khan Pathan",
    date_of_birth: "1988-05-10",
    contact: {
      email: "mohsin@example.com",
      mobile_number: "+971501234567"
    }
  }
}, null, 2);

const DUMMY_SCHEMAS = [
  { id: 'CDM_UNIFIED', name: 'Unified Banking CDM', type: 'PRESET', description: 'Standard common data model for all providers', data: CDM_JSON },
  { id: 'RETAIL_V1', name: 'Retail Banking v1', type: 'CUSTOM', description: 'Standard retail banking schema', data: JSON.stringify({ account: { id: "", balance: 0, currency: "USD" } }, null, 2) },
  { id: 'CORP_API', name: 'Corporate API Std', type: 'CUSTOM', description: 'Corporate banking data structure', data: JSON.stringify({ corporate: { org_id: "", tx_limit: 1000 } }, null, 2) }
];

const DUMMY_PROVIDERS = [
  { id: 'STRIPE', name: 'Stripe Connector', description: 'Standard Stripe payment provider schema', data: JSON.stringify({ customer: { id: "", email: "", metadata: {} } }, null, 2) },
  { id: 'BANK_A', name: 'Bank A Core', description: 'Legacy core banking system', data: JSON.stringify({ CustID: "", fname: "", lname: "", dob: "" }, null, 2) },
  { id: 'CUSTOM', name: 'Custom Webhook', description: 'Internal processing webhook format', data: JSON.stringify({ event: "", payload: {}, timestamp: "" }, null, 2) }
];

const useJSONMapper = () => {
  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem('json_mapper_profiles');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeProfileId, setActiveProfileId] = useState('');
  const [draftProfile, setDraftProfile] = useState(null);
  const [currentView, setCurrentView] = useState('LIST');
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedSourcePath, setSelectedSourcePath] = useState(null);
  const [draggedSourcePath, setDraggedSourcePath] = useState(null);
  const [dropTargetHover, setDropTargetHover] = useState(null);
  const [activeTargetIndex, setActiveTargetIndex] = useState(0);
  const [providerDropdownOpen, setProviderDropdownOpen] = useState(false);
  const [sourceDropdownOpen, setSourceDropdownOpen] = useState(false);
  const providerDropdownRef = useRef(null);
  const sourceDropdownRef = useRef(null);
  const [isSourceSelectOpen, setIsSourceSelectOpen] = useState(false);
  const [isTargetSelectOpen, setIsTargetSelectOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (providerDropdownRef.current && !providerDropdownRef.current.contains(event.target)) {
        setProviderDropdownOpen(false);
      }
      if (sourceDropdownRef.current && !sourceDropdownRef.current.contains(event.target)) {
        setSourceDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    localStorage.setItem('json_mapper_profiles', JSON.stringify(profiles));
  }, [profiles]);

  const activeProfile = useMemo(() => {
    if (draftProfile) return draftProfile;
    return profiles.find(p => p.id === activeProfileId);
  }, [profiles, activeProfileId, draftProfile]);

  const handleCreateNew = () => {
    const newProfile = {
      id: `MAP-${Date.now()}`,
      name: '',
      description: '',
      sourceSchemaId: '',
      sourceType: 'PRESET',
      sourceJsonText: '{}',
      targets: [],
      status: 'DRAFT',
      createdAt: new Date().toISOString()
    };
    setDraftProfile(newProfile);
    setActiveProfileId(''); // Clear active profile ID when creating new
    setCurrentView('SETUP');
  };

  const saveDraftProfile = () => {
    if (draftProfile) {
      setProfiles(prev => [...prev, draftProfile]);
      setDraftProfile(null);
      setCurrentView('LIST');
    } else {
      setCurrentView('LIST');
    }
  };

  const cancelDraftProfile = () => {
    setDraftProfile(null);
    setCurrentView('LIST');
  };

  const updateActiveProfile = (updater) => {
    if (draftProfile) {
      setDraftProfile(prev => updater(prev));
    } else {
      setProfiles(prev => prev.map(p => p.id === activeProfileId ? updater(p) : p));
    }
  };

  const handleMap = (sourcePath, targetPath) => {
    updateActiveProfile(p => {
      const updatedTargets = [...p.targets];
      updatedTargets[activeTargetIndex] = {
        ...updatedTargets[activeTargetIndex],
        mappings: {
          ...updatedTargets[activeTargetIndex].mappings,
          [targetPath]: sourcePath
        }
      };
      return { ...p, targets: updatedTargets };
    });
  };

  const removeMapping = (targetPath) => {
    updateActiveProfile(p => {
      const updatedTargets = [...p.targets];
      const newMappings = { ...updatedTargets[activeTargetIndex].mappings };
      delete newMappings[targetPath];
      updatedTargets[activeTargetIndex] = {
        ...updatedTargets[activeTargetIndex],
        mappings: newMappings
      };
      return { ...p, targets: updatedTargets };
    });
  };

  const getMappedKeyJson = () => {
    if (!activeProfile) return "{}";
    
    // Build comprehensive mapping structure with metadata
    const mappingOutput = {
      _meta: {
        profile_id: activeProfile.id,
        profile_name: activeProfile.name,
        description: activeProfile.description,
        created_at: new Date().toISOString(),
        version: "1.0.0"
      },
      source: {
        schema_id: activeProfile.sourceSchemaId,
        schema_name: DUMMY_SCHEMAS.find(s => s.id === activeProfile.sourceSchemaId)?.name || activeProfile.sourceSchemaId,
        type: activeProfile.sourceType
      },
      providers: activeProfile.targets.map(target => {
        const providerInfo = DUMMY_PROVIDERS.find(p => p.id === target.providerId);
        return {
          provider_id: target.providerId,
          provider_name: providerInfo?.name || target.providerId,
          fields_mapped: Object.keys(target.mappings || {}).length,
          mappings: Object.entries(target.mappings || {}).map(([targetField, sourceField]) => ({
            source_field: sourceField,
            target_field: targetField
          }))
        };
      })
    };
    
    return JSON.stringify(mappingOutput, null, 2);
  };

  // Get mapping for current provider only
  const getCurrentProviderMappingJson = () => {
    if (!activeProfile || !activeProfile.targets[activeTargetIndex]) return "{}";
    
    const target = activeProfile.targets[activeTargetIndex];
    const providerInfo = DUMMY_PROVIDERS.find(p => p.id === target.providerId);
    
    const mappingOutput = {
      _meta: {
        profile_id: activeProfile.id,
        exported_at: new Date().toISOString()
      },
      source: {
        schema_id: activeProfile.sourceSchemaId,
        schema_name: DUMMY_SCHEMAS.find(s => s.id === activeProfile.sourceSchemaId)?.name
      },
      provider: {
        provider_id: target.providerId,
        provider_name: providerInfo?.name || target.providerId
      },
      mappings: Object.entries(target.mappings || {}).reduce((acc, [targetField, sourceField]) => {
        acc[sourceField] = targetField;
        return acc;
      }, {})
    };
    
    return JSON.stringify(mappingOutput, null, 2);
  };

  const sourceData = useMemo(() => {
    try {
      if (activeProfile?.sources?.length > 0) {
        // Use the first source schema
        const sourceSchema = DUMMY_SCHEMAS.find(s => s.id === activeProfile.sources[0].schemaId);
        if (sourceSchema) {
          return JSON.parse(sourceSchema.data);
        }
      }
      
      if (activeProfile?.sourceSchemaId) {
        const schema = DUMMY_SCHEMAS.find(s => s.id === activeProfile.sourceSchemaId);
        if (schema) {
          return JSON.parse(schema.data);
        }
      }
      return {};
    } catch (error) {
      console.error('Error parsing source data:', error);
      return {};
    }
  }, [activeProfile]);

  const targetData = useMemo(() => {
    try {
      if (activeProfile?.targets[activeTargetIndex]?.jsonText) {
        return JSON.parse(activeProfile.targets[activeTargetIndex].jsonText);
      }
      return {};
    } catch (error) {
      console.error('Error parsing target data:', error);
      return {};
    }
  }, [activeProfile, activeTargetIndex]);

  const cardClass = "rounded-2xl border backdrop-blur-sm bg-white/5 dark:bg-darkbg border-white/10 dark:border-white/5";

  const inputClass = `w-full px-4 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-orange/30 transition-all dark:bg-darkbg dark:border-white/10 dark:text-white dark:placeholder:text-gray-600 bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 shadow-sm`;

  return {
    profiles,
    setProfiles,
    activeProfileId,
    setActiveProfileId,
    currentView,
    setCurrentView,
    showPreviewModal,
    setShowPreviewModal,
    selectedSourcePath,
    setSelectedSourcePath,
    draggedSourcePath,
    setDraggedSourcePath,
    dropTargetHover,
    setDropTargetHover,
    activeTargetIndex,
    setActiveTargetIndex,
    providerDropdownOpen,
    setProviderDropdownOpen,
    sourceDropdownOpen,
    setSourceDropdownOpen,
    providerDropdownRef,
    sourceDropdownRef,
    isSourceSelectOpen,
    setIsSourceSelectOpen,
    isTargetSelectOpen,
    setIsTargetSelectOpen,
    activeProfile,
    draftProfile,
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
    DUMMY_SCHEMAS,
    DUMMY_PROVIDERS,
    CDM_JSON
  };
};

export default useJSONMapper;