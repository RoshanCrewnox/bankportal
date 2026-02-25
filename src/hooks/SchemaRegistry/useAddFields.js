import { useState, useEffect, useMemo, useCallback } from 'react';

export const useAddFields = (onSave) => {
  const [schemas, setSchemas] = useState([]);
  const [registeredFields, setRegisteredFields] = useState([]);
  const [existingGroups, setExistingGroups] = useState([]);
  const [selectedItems, setSelectedItems] = useState([{ id: crypto.randomUUID(), cdm_uuid: '', field_names: [], fieldsList: [] }]);
  
  // New state for grouping enhancements
  const [fieldGroupOverrides, setFieldGroupOverrides] = useState({}); // { 'cdmUuid-fieldName': groupName }
  const [bulkGroup, setBulkGroup] = useState('');
  const [applyToAll, setApplyToAll] = useState(false);

  useEffect(() => {
    // Load schemas
    const storedSchemas = JSON.parse(localStorage.getItem('schema_registry_schemas') || '[]');
    setSchemas(storedSchemas.map(s => ({
      ...s,
      parsedFields: JSON.parse(s.cdm_defination || '{}').properties || {}
    })));

    // Load registered fields to prevent duplicates
    const storedRegistered = JSON.parse(localStorage.getItem('CDM_FIELD_REGISTRY') || '[]');
    setRegisteredFields(storedRegistered);

    // Load existing groups
    const groups = new Set();
    storedRegistered.forEach(f => {
      if (f.group_name) groups.add(f.group_name);
    });
    setExistingGroups(Array.from(groups).sort());
  }, []);

  const handleAddMore = () => {
    setSelectedItems([...selectedItems, { id: crypto.randomUUID(), cdm_uuid: '', field_names: [], fieldsList: [] }]);
  };

  const handleRemoveRow = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  // Remove a specific field from the registration queue
  const removeSpecificField = useCallback((cdmUuid, fieldName) => {
    setSelectedItems(prev => prev.map(item => {
      if (item.cdm_uuid === cdmUuid) {
        return {
          ...item,
          field_names: item.field_names.filter(f => f !== fieldName)
        };
      }
      return item;
    }));
  }, []);

  // Update group for an individual field
  const updateFieldGroup = useCallback((cdmUuid, fieldName, groupName) => {
    const key = `${cdmUuid}-${fieldName}`;
    setFieldGroupOverrides(prev => ({ ...prev, [key]: groupName }));
  }, []);

  const handleCdmChange = (index, uuid) => {
    const schema = schemas.find(s => s.cdm_uuid === uuid);
    if (!schema) return;

    // Filter out fields that are already in the registry for this CDM
    const availableFields = Object.keys(schema.parsedFields).filter(f => 
      !registeredFields.some(rf => rf.cdm_uuid === uuid && (rf.field_name === f || rf.name === f))
    );
    
    const newItems = [...selectedItems];
    newItems[index] = { ...newItems[index], cdm_uuid: uuid, field_names: [], fieldsList: availableFields };
    setSelectedItems(newItems);
  };

  const toggleFieldSelection = (index, fieldName) => {
    const newItems = [...selectedItems];
    const item = newItems[index];
    if (item.field_names.includes(fieldName)) {
      item.field_names = item.field_names.filter(f => f !== fieldName);
    } else {
      item.field_names = [...item.field_names, fieldName];
    }
    setSelectedItems(newItems);
  };

  const handleFinalSave = () => {
    const fieldsToRegister = [];
    
    selectedItems.forEach(item => {
      if (!item.cdm_uuid || item.field_names.length === 0) return;
      
      const schema = schemas.find(s => s.cdm_uuid === item.cdm_uuid);
      item.field_names.forEach(fName => {
        const fieldData = schema.parsedFields[fName];
        const key = `${item.cdm_uuid}-${fName}`;
        const finalGroup = applyToAll ? bulkGroup : (fieldGroupOverrides[key] || '');

        fieldsToRegister.push({
          field_uuid: crypto.randomUUID(),
          cdm_uuid: item.cdm_uuid,
          cdm_name: schema.cdm_name,
          field_name: fName,
          group_name: finalGroup,
          type: fieldData.type,
          status: 'Required Configuration',
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        });
      });
    });

    if (fieldsToRegister.length > 0) {
      onSave(fieldsToRegister);
    }
  };

  const queuedFields = useMemo(() => {
    const list = [];
    selectedItems.forEach(item => {
      const schema = schemas.find(s => s.cdm_uuid === item.cdm_uuid);
      if (schema) {
        item.field_names.forEach(f => {
          const key = `${item.cdm_uuid}-${f}`;
          list.push({ 
            id: key,
            cdm_uuid: item.cdm_uuid,
            cdm: schema.cdm_name, 
            field: f, 
            type: schema.parsedFields[f]?.type,
            group: applyToAll ? bulkGroup : (fieldGroupOverrides[key] || '')
          });
        });
      }
    });
    return list;
  }, [selectedItems, schemas, fieldGroupOverrides, bulkGroup, applyToAll]);

  return {
    schemas,
    selectedItems,
    queuedFields,
    existingGroups,
    bulkGroup,
    setBulkGroup,
    applyToAll,
    setApplyToAll,
    handleAddMore,
    handleRemoveRow,
    handleCdmChange,
    toggleFieldSelection,
    handleFinalSave,
    removeSpecificField,
    updateFieldGroup
  };
};
