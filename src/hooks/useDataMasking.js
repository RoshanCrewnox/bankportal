import { useState, useEffect, useMemo } from 'react';
import { MASKING_ALGORITHMS, MASKING_LEVELS } from '../utils/maskingConstants';
import { applyMask } from '../utils/maskingUtils';

/**
 * Custom Hook for Data Masking business logic.
 * Mandatory Rules: Consolidates state, logic, and data orchestration.
 */
export const useDataMasking = () => {
  const [view, setView] = useState('list');
  const [fields, setFields] = useState([]);
  const [selectedCDM, setSelectedCDM] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [selectedAlgo, setSelectedAlgo] = useState(MASKING_ALGORITHMS[0].id);
  const [isManualSelection, setIsManualSelection] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(MASKING_LEVELS[1].id);
  const [params, setParams] = useState({ visibleCount: 4, maskChar: '*' });
  const [testValue, setTestValue] = useState('323288883253');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('CDM_FIELD_REGISTRY') || '[]');
    setFields(stored);
  }, []);

  const uniqueCDMs = useMemo(() => {
    return Array.from(new Set(fields.map(f => f.cdm_name).filter(Boolean)));
  }, [fields]);

  const filteredFields = useMemo(() => {
    return fields.filter(f => f.cdm_name === selectedCDM);
  }, [fields, selectedCDM]);

  useEffect(() => {
    if (filteredFields.length > 0 && selectedCDM) {
      setSelectedField(filteredFields[0].field_uuid);
      const name = filteredFields[0].field_name?.toLowerCase() || '';
      if (name.includes('account')) setTestValue('4532778811223344');
      else if (name.includes('email')) setTestValue('john.doe@example.com');
    } else {
      setSelectedField('');
    }
  }, [filteredFields, selectedCDM]);

  const currentAlgo = MASKING_ALGORITHMS.find(a => a.id === selectedAlgo);
  const currentFieldObj = fields.find(f => f.field_uuid === selectedField);

  const getJsonPreview = () => {
    const baseObj = {
      id: "REC-88293",
      timestamp: new Date().toISOString(),
      source: "DigitalBanking",
      data: {
        Account_Number: "323288883253",
        status: "ACTIVE",
        region: "EMEA"
      }
    };

    const maskedObj = JSON.parse(JSON.stringify(baseObj));
    const fieldName = currentFieldObj?.field_name || "Account_Number";
    maskedObj.data[fieldName] = applyMask(testValue, selectedAlgo, params);
    maskedObj.metadata = {
      applied_protection: currentAlgo?.name,
      algo_id: selectedAlgo,
      level: selectedLevel.toUpperCase()
    };

    return JSON.stringify(maskedObj, null, 2);
  };

  return {
    view, setView,
    selectedCDM, setSelectedCDM,
    selectedField, setSelectedField,
    selectedAlgo, setSelectedAlgo,
    isManualSelection, setIsManualSelection,
    selectedLevel, setSelectedLevel,
    params, setParams,
    testValue, setTestValue,
    uniqueCDMs, filteredFields,
    currentAlgo, currentFieldObj,
    getJsonPreview
  };
};
