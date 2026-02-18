/**
 * Service to handle Schema Registry operations using LocalStorage
 */
const SCHEMA_KEY = 'bank_portal_schemas';

const schemaRegistryService = {
  /**
   * Fetch all schemas from local storage
   */
  GET_SCHEMAS: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem(SCHEMA_KEY);
        const data = stored ? JSON.parse(stored) : [];
        resolve({ data });
      }, 300);
    });
  },

  /**
   * Save or update a schema in local storage
   */
  SAVE_SCHEMA: async (schema) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem(SCHEMA_KEY);
        let schemas = stored ? JSON.parse(stored) : [];
        
        const index = schemas.findIndex(s => s.cdm_uuid === schema.cdm_uuid);
        if (index !== -1) {
          schemas[index] = { ...schema, updated_at: new Date().toISOString() };
        } else {
          schemas.push({
            ...schema,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
        
        localStorage.setItem(SCHEMA_KEY, JSON.stringify(schemas));
        resolve({ success: true, data: schema });
      }, 300);
    });
  },

  /**
   * Delete a schema from local storage
   */
  DELETE_SCHEMA: async (uuid) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem(SCHEMA_KEY);
        let schemas = stored ? JSON.parse(stored) : [];
        schemas = schemas.filter(s => s.cdm_uuid !== uuid);
        localStorage.setItem(SCHEMA_KEY, JSON.stringify(schemas));
        resolve({ success: true });
      }, 300);
    });
  }
};

export default schemaRegistryService;
