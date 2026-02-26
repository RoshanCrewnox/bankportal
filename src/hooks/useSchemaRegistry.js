import { useState, useEffect, useCallback, useMemo } from 'react';
import { fieldsToDefinition, definitionToFields } from '../utils/schemaTransformers';
import { loadDomainConfig } from '../utils/domainConfig';

const STORAGE_KEY = 'schema_registry_schemas';

const INITIAL_FIELDS = [
  { id: crypto.randomUUID(), name: 'id', type: 'number', required: true, unique: true }
];

const INITIAL_SCHEMA = {
  cdm_uuid: '',
  cdm_name: '',
  cdm_id: '',
  version: '1.0.0',
  tpp_uuid: '',
  org_id: '',
  cdm_defination: JSON.stringify(fieldsToDefinition(INITIAL_FIELDS)),
  cdm_validation: '',
  cdm_domain: [],
  sub_domain: [],
  status: 'Draft',
  desc: ''
};

// LocalStorage helpers
const loadSchemas = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveSchemas = (schemas) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schemas));
};

export const useSchemaRegistry = () => {
  const [view, setView] = useState('LIST'); // LIST, BUILDER, DESIGNER
  const [schemas, setSchemas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Builder/Designer state
  const [currentSchema, setCurrentSchema] = useState(INITIAL_SCHEMA);
  const [fields, setFields] = useState(INITIAL_FIELDS);
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Helper for nested field updates
  const updateNestedFields = (path, value, currentFields) => {
    if (path.length === 1) {
      const newFields = [...currentFields];
      if (value === null) {
        // Delete
        newFields.splice(path[0], 1);
      } else {
        // Update
        newFields[path[0]] = { ...newFields[path[0]], ...value };
      }
      return newFields;
    }

    const [index, ...rest] = path;
    const newFields = [...currentFields];
    const parent = { ...newFields[index] };
    
    // Ensure fields array exists for objects/arrays
    if (!parent.fields) parent.fields = [];
    
    parent.fields = updateNestedFields(rest, value, parent.fields);
    newFields[index] = parent;
    return newFields;
  };

  const handleFieldUpdate = (path, value) => {
    setFields(prev => updateNestedFields(path, value, prev));
  };

  const addNestedField = (path = []) => {
    const newField = { id: crypto.randomUUID(), name: '', type: 'string', required: false };
    if (path.length === 0) {
      setFields(prev => [...prev, newField]);
    } else {
      // Find the parent and push to its fields
      setFields(prev => {
        const update = (currentPath, fieldsArr) => {
          if (currentPath.length === 1) {
            const index = currentPath[0];
            const parent = { ...fieldsArr[index] };
            parent.fields = [...(parent.fields || []), newField];
            const newArr = [...fieldsArr];
            newArr[index] = parent;
            return newArr;
          }
          const [index, ...rest] = currentPath;
          const newArr = [...fieldsArr];
          const parent = { ...newArr[index] };
          parent.fields = update(rest, parent.fields || []);
          newArr[index] = parent;
          return newArr;
        };
        return update(path, prev);
      });
    }
  };

  const removeNestedField = (path) => {
    handleFieldUpdate(path, null);
  };

  // Load schemas from localStorage on mount
  const fetchSchemas = useCallback(() => {
    setLoading(true);
    const stored = loadSchemas();
    setSchemas(stored);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSchemas();
  }, [fetchSchemas]);

  // Sync fields to schema definition
  useEffect(() => {
    if (view === 'BUILDER') {
      const definition = fieldsToDefinition(fields);
      setCurrentSchema(prev => ({
        ...prev,
        cdm_defination: JSON.stringify(definition, null, 2)
      }));
    }
  }, [fields, view]);

  const handleCreateNew = () => {
    setCurrentSchema({ ...INITIAL_SCHEMA, cdm_uuid: crypto.randomUUID() });
    setFields(INITIAL_FIELDS);
    setIsEditing(false);
    setView('BUILDER');
    setShowPreview(false);
  };

  const handleEdit = (schema) => {
    setCurrentSchema(schema);
    try {
      const parsed = JSON.parse(schema.cdm_defination);
      setFields(definitionToFields(parsed));
    } catch (e) {
      setFields(INITIAL_FIELDS);
    }
    setIsEditing(true);
    setView('BUILDER');
    setShowPreview(false);
  };

  const handleViewDesigner = (schema) => {
    setCurrentSchema(schema);
    setView('DESIGNER');
  };

  const handleSave = (schemaData) => {
    try {
      // 1. Collect all marked fields recursively for registry
      const collectRegistryFields = (fieldsArr) => {
        let result = [];
        fieldsArr.forEach(f => {
          if (f.inRegistry && f.name) {
            result.push({
              name: f.name,
              type: f.type,
              required: !!f.required,
              unique: !!f.unique,
              min: f.min,
              max: f.max,
              ref: f.ref,
              refField: f.refField,
              updatedAt: new Date().toISOString()
            });
          }
          if (f.fields && f.fields.length > 0) {
            result = [...result, ...collectRegistryFields(f.fields)];
          }
        });
        return result;
      };

      const registryFields = collectRegistryFields(fields);
      if (registryFields.length > 0) {
        const existingRegistry = JSON.parse(localStorage.getItem('CDM_FIELD_REGISTRY') || '[]');
        const updatedRegistry = [...existingRegistry];
        registryFields.forEach(rf => {
          const idx = updatedRegistry.findIndex(er => er.name === rf.name);
          if (idx !== -1) {
            updatedRegistry[idx] = { ...updatedRegistry[idx], ...rf };
          } else {
            updatedRegistry.push(rf);
          }
        });
        localStorage.setItem('CDM_FIELD_REGISTRY', JSON.stringify(updatedRegistry));
      }

      // 2. Normal schema saving logic
      const definition = fieldsToDefinition(fields);
      const finalData = {
        ...schemaData,
        cdm_defination: JSON.stringify(definition),
        updatedAt: new Date().toISOString()
      };

      // If editing, don't add createdAt again
      if (!isEditing) {
        finalData.createdAt = new Date().toISOString();
      }

      const current = loadSchemas();
      const existingIndex = current.findIndex(s => s.cdm_uuid === finalData.cdm_uuid);

      if (existingIndex >= 0) {
        current[existingIndex] = { ...current[existingIndex], ...finalData };
      } else {
        current.push(finalData);
      }

      saveSchemas(current);
      setSchemas(current);
      setView('LIST');
      setError(null);
    } catch (err) {
      setError('Failed to save schema');
    }
  };

  const handleDelete = (uuid) => {
    const current = loadSchemas();
    const updated = current.filter(s => s.cdm_uuid !== uuid);
    saveSchemas(updated);
    setSchemas(updated);
  };

  const filteredSchemas = useMemo(() => {
    const config = loadDomainConfig();
    
    return schemas.filter(s => {
      // 1. Domain/Subdomain Visibility Filter
      const domainArray = Array.isArray(s.cdm_domain) ? s.cdm_domain : (s.cdm_domain ? [s.cdm_domain] : []);
      const subArray    = Array.isArray(s.sub_domain)  ? s.sub_domain  : [];

      if (domainArray.length > 0) {
        // Find if at least one domain is enabled
        const enabledDomains = domainArray.filter(d => config[d]?.enabled !== false);
        
        if (enabledDomains.length === 0) return false;

        // If it has subdomains, at least one must be enabled within the enabled domains
        if (subArray.length > 0) {
          const hasVisibleSub = subArray.some(sub => 
            enabledDomains.some(d => config[d]?.subdomains?.[sub] !== false)
          );
          if (!hasVisibleSub) return false;
        }
      }

      // 2. Search Filter
      const term = searchTerm.toLowerCase();
      if (!term) return true;

      const nameMatch = s.cdm_name?.toLowerCase().includes(term);
      const idMatch = s.cdm_id?.toLowerCase().includes(term);
      const domainMatch = domainArray.some(d => d.toLowerCase().includes(term));
      const subDomainMatch = subArray.some(sd => sd.toLowerCase().includes(term));

      return nameMatch || idMatch || domainMatch || subDomainMatch;
    });
  }, [schemas, searchTerm]);

  return {
    view,
    setView,
    schemas: filteredSchemas,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    currentSchema,
    setCurrentSchema,
    fields,
    setFields,
    handleFieldUpdate,
    addNestedField,
    removeNestedField,
    isEditing,
    showPreview,
    setShowPreview,
    handleCreateNew,
    handleEdit,
    handleViewDesigner,
    handleSave,
    handleDelete,
    handleRefresh: fetchSchemas
  };
};
