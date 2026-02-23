/**
 * RBAC Utility Functions
 * Reusable helpers for checking permissions and accessing role data
 */

/**
 * Normalize name: remove "-N" suffix, trim whitespace, and lowercase for case-insensitive matching
 * @param {string} name - Name to normalize
 * @returns {string} Normalized name
 */
export const normalizeName = (name) => {
  if (!name) return '';
  return name.replace(/ -N$/, '').trim().toLowerCase();
};

/**
 * Find a menu item by name
 * @param {object} roleData - Role data from Redux
 * @param {string} menuName - Name of the menu to find
 * @returns {object|null} Menu object or null
 */
export const findMenu = (roleData, menuName) => {
  if (!roleData?.role_json?.menu || !menuName) return null;
  
  const normalizedName = normalizeName(menuName);
  return roleData.role_json.menu.find(
    menu => normalizeName(menu.name) === normalizedName
  ) || null;
};

/**
 * Check if a menu is enabled
 * @param {object} roleData - Role data from Redux
 * @param {string} menuName - Name of the menu
 * @returns {boolean} True if menu exists and is enabled
 */
export const isMenuEnabled = (roleData, menuName) => {
  const menu = findMenu(roleData, menuName);
  return menu?.is_enabled === true;
};

/**
 * Find a module under a menu
 * @param {object} roleData - Role data from Redux
 * @param {string} menuName - Name of the parent menu
 * @param {string} moduleName - Name of the module to find
 * @returns {object|null} Module object or null
 */
export const findModule = (roleData, menuName, moduleName) => {
  if (!menuName || !moduleName) return null;
  
  const menu = findMenu(roleData, menuName);
  if (!menu?.modules) return null;
  
  const normalizedModuleName = normalizeName(moduleName);
  return menu.modules.find(
    module => normalizeName(module.name) === normalizedModuleName
  ) || null;
};

/**
 * Check if a module is enabled (both menu and module must be enabled)
 * @param {object} roleData - Role data from Redux
 * @param {string} menuName - Name of the parent menu
 * @param {string} moduleName - Name of the module
 * @returns {boolean} True if both menu and module are enabled
 */
export const isModuleEnabled = (roleData, menuName, moduleName) => {
  // Menu must be enabled
  if (!isMenuEnabled(roleData, menuName)) return false;
  
  // Module must exist and be enabled
  const module = findModule(roleData, menuName, moduleName);
  return module?.is_enabled === true;
};

/**
 * Find a sub-module under a module
 * @param {object} roleData - Role data from Redux
 * @param {string} menuName - Name of the parent menu
 * @param {string} moduleName - Name of the parent module
 * @param {string} subModuleName - Name of the sub-module to find
 * @returns {object|null} Sub-module object or null
 */
export const findSubModule = (roleData, menuName, moduleName, subModuleName) => {
  if (!menuName || !moduleName || !subModuleName) return null;
  
  const module = findModule(roleData, menuName, moduleName);
  if (!module?.['sub-modules']) return null;
  
  const normalizedSubModuleName = normalizeName(subModuleName);
  return module['sub-modules'].find(
    subModule => normalizeName(subModule.name) === normalizedSubModuleName
  ) || null;
};

/**
 * Check if a sub-module is enabled (menu, module, and sub-module must all be enabled)
 * @param {object} roleData - Role data from Redux
 * @param {string} menuName - Name of the parent menu
 * @param {string} moduleName - Name of the parent module
 * @param {string} subModuleName - Name of the sub-module
 * @returns {boolean} True if all parents and sub-module are enabled
 */
export const isSubModuleEnabled = (roleData, menuName, moduleName, subModuleName) => {
  // Module must be enabled (which checks menu too)
  if (!isModuleEnabled(roleData, menuName, moduleName)) return false;
  
  // Sub-module must exist and be enabled
  const subModule = findSubModule(roleData, menuName, moduleName, subModuleName);
  return subModule?.is_enabled === true;
};

/**
 * Check if a specific permission exists and is enabled
 * @param {object} roleData - Role data from Redux
 * @param {string} menuName - Name of the menu
 * @param {string} moduleName - Name of the module
 * @param {string} subModuleName - Name of the sub-module
 * @param {string} permissionName - Name of the permission
 * @returns {boolean} True if permission exists and is enabled
 */
export const hasPermission = (roleData, menuName, moduleName, subModuleName, permissionName, returnObject = false) => {
  if (!menuName || !moduleName || !subModuleName || !permissionName) return false;

  const subModule = findSubModule(roleData, menuName, moduleName, subModuleName);

  // Check if the sub-module itself is enabled before checking its permissions
  if (!subModule?.is_enabled) {
    return false;
  }

  const permissions = subModule?.permission || subModule?.permissions;
  if (!permissions) return false;

  const normalizedPermissionName = normalizeName(permissionName);
  const permission = permissions.find(
    perm => normalizeName(perm.name) === normalizedPermissionName
  );

  if (!permission) return false;

  if (returnObject) {
    return permission; // Return the entire permission object
  }

  return permission.is_enabled === true; // Return boolean status
};

/**
 * Get all enabled menu items (useful for building navigation)
 * @param {object} roleData - Role data from Redux
 * @returns {array} Array of enabled menu items
 */
export const getEnabledMenus = (roleData) => {
  if (!roleData?.role_json?.menu) return [];
  return roleData.role_json.menu.filter(menu => menu.is_enabled === true);
};

/**
 * Get all enabled modules under a menu (useful for building sub-navigation)
 * @param {object} roleData - Role data from Redux
 * @param {string} menuName - Name of the menu
 * @returns {array} Array of enabled modules
 */
export const getEnabledModules = (roleData, menuName) => {
  const menu = findMenu(roleData, menuName);
  if (!menu?.is_enabled || !menu.modules) return [];
  
  return menu.modules.filter(module => module.is_enabled === true);
};

/**
 * Get all enabled sub-modules under a module
 * @param {object} roleData - Role data from Redux
 * @param {string} menuName - Name of the menu
 * @param {string} moduleName - Name of the module
 * @returns {array} Array of enabled sub-modules
 */
export const getEnabledSubModules = (roleData, menuName, moduleName) => {
  const module = findModule(roleData, menuName, moduleName);
  if (!isModuleEnabled(roleData, menuName, moduleName) || !module?.['sub-modules']) {
    return [];
  }
  
  return module['sub-modules'].filter(subModule => subModule.is_enabled === true);
};

/**
 * Get all available permissions for a sub-module
 * @param {object} roleData - Role data from Redux
 * @param {string} menuName - Name of the menu
 * @param {string} moduleName - Name of the module
 * @param {string} subModuleName - Name of the sub-module
 * @returns {array} Array of available permissions
 */
export const getAvailablePermissions = (roleData, menuName, moduleName, subModuleName) => {
  const subModule = findSubModule(roleData, menuName, moduleName, subModuleName);
  return subModule?.permission || subModule?.permissions || [];
};

/**
 * Get all enabled permissions for a sub-module
 * @param {object} roleData - Role data from Redux
 * @param {string} menuName - Name of the menu
 * @param {string} moduleName - Name of the module
 * @param {string} subModuleName - Name of the sub-module
 * @returns {array} Array of enabled permissions
 */
export const getEnabledPermissions = (roleData, menuName, moduleName, subModuleName) => {
  const permissions = getAvailablePermissions(roleData, menuName, moduleName, subModuleName);
  return permissions.filter(perm => perm.is_enabled === true);
};

/**
 * Check if user has access to a path (menu + modules exist and are enabled)
 * @param {object} roleData - Role data from Redux
 * @param {array} path - Array of names [menuName, moduleName, subModuleName?]
 * @returns {boolean} True if all items in path are enabled
 */
export const hasAccessToPath = (roleData, path) => {
  if (!Array.isArray(path) || path.length === 0) return false;
  
  const [menuName, moduleName, subModuleName] = path;
  
  if (!menuName) return false;
  if (!isMenuEnabled(roleData, menuName)) return false;
  
  if (!moduleName) return true; // Only menu was required
  if (!isModuleEnabled(roleData, menuName, moduleName)) return false;
  
  if (!subModuleName) return true; // Only menu+module were required
  return isSubModuleEnabled(roleData, menuName, moduleName, subModuleName);
};

/**
 * Recursively search for a permission by ID or name within the RBAC JSON structure.
 * @param {Array} items - The array of menus, modules, or permissions to search.
 * @param {string} identifier - The ID or name to search for.
 * @returns {object|null} The found permission object or null.
 */
const findPermissionByIdentifier = (items, identifier) => {
    for (const item of items) {
        // Check current item
        if (item.id === identifier || normalizeName(item.name) === normalizeName(identifier)) {
            return item;
        }

        // Recursively search in children
        const children = item.modules || item['sub-modules'] || item.permission || item.permissions;
        if (children) {
            const found = findPermissionByIdentifier(children, identifier);
            if (found) {
                return found;
            }
        }
    }
    return null;
};

/**
 * Check if a permission is enabled by its unique ID or name.
 * This function traverses the entire role JSON to find the permission.
 * @param {object} roleData - The role data from Redux.
 * @param {string} identifier - The unique ID or name of the permission/module/sub-module.
 * @returns {boolean} True if the permission is found and is_enabled is true.
 */
export const hasPermissionById = (roleData, identifier) => {
    if (!roleData?.role_json?.menu || !identifier) {
        return false;
    }

    const permission = findPermissionByIdentifier(roleData.role_json.menu, identifier);

    return permission?.is_enabled === true;
};
