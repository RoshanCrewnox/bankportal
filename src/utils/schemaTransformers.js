/**
 * Transforms an array of field objects into a JSON definition object
 * Handles nested objects and arrays recursively
 * @param {Array} fields 
 * @returns {Object}
 */
export const fieldsToDefinition = (fields) => {
  const properties = {};
  
  fields.forEach(field => {
    if (!field.name) return;
    
    const { name, type, required, unique, min, max, ref, refField, fields: nestedFields } = field;
    
    let fieldDef = {
      type: type === 'add reference' ? 'reference' : type,
      required: !!required,
      unique: !!unique
    };

    if (type === 'add reference') {
      fieldDef.reference_schema = ref || '';
      fieldDef.reference_field = refField || 'whole_schema';
    } else if (type === 'number') {
      if (min !== undefined && min !== null) fieldDef.min = min;
      if (max !== undefined && max !== null) fieldDef.max = max;
    } else if (type === 'object' && nestedFields) {
      const nested = fieldsToDefinition(nestedFields);
      fieldDef.properties = nested.properties;
    } else if (type === 'array') {
      if (nestedFields && nestedFields.length > 0) {
        // Array of objects
        const nested = fieldsToDefinition(nestedFields);
        fieldDef.items = {
          type: 'object',
          properties: nested.properties
        };
      } else {
        // Array of primitives (default to string if no nested fields)
        fieldDef.items = { type: 'string' };
      }
    }
    
    properties[name] = fieldDef;
  });

  return {
    type: 'object',
    properties
  };
};

/**
 * Transforms a JSON definition object into an array of field objects
 * Handles nested definitions recursively
 * @param {Object} definition 
 * @returns {Array}
 */
export const definitionToFields = (definition) => {
  if (!definition || !definition.properties) return [];
  
  return Object.entries(definition.properties).map(([name, props]) => {
    const field = {
      id: crypto.randomUUID(), 
      name, 
      type: props.type,
      required: !!props.required,
      unique: !!props.unique
    };
    
    // Copy other props like min, max
    if (props.min !== undefined) field.min = props.min;
    if (props.max !== undefined) field.max = props.max;

    if (props.type === 'reference') {
      field.type = 'add reference';
      field.ref = props.reference_schema;
      field.refField = props.reference_field;
    } else if (props.type === 'object' && props.properties) {
      field.fields = definitionToFields(props);
    } else if (props.type === 'array' && props.items) {
      if (props.items.type === 'object') {
        field.fields = definitionToFields(props.items);
      }
    }
    
    return field;
  });
};
