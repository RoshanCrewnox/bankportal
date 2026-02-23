// import React, { useState, useEffect, useMemo } from 'react';
// import '../../ApiManager/toggleButton.css';
// import ChangeComparisonModal from './ChangeComparisonModal';

// const EditApiForm = ({ asset, onSave, viewMode = false }) => {
//   const [formData, setFormData] = useState(asset);
//   const [originalValues, setOriginalValues] = useState(asset);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);

//   useEffect(() => {
//     setFormData(asset);
//     setOriginalValues(asset);
//   }, [asset]);

//   const isLaunched = asset?.api_status === 'LAUNCHED';
//   const isReadOnly = viewMode || isLaunched;

//   // Detect changes
//   const changedFields = useMemo(() => {
//     const changes = [];
//     const fieldsToTrack = ['amount', 'api_visibility', 'commercial_type'];

//     fieldsToTrack.forEach(field => {
//       if (formData[field] !== originalValues[field]) {
//         changes.push({
//           field,
//           oldValue: originalValues[field],
//           newValue: formData[field]
//         });
//       }
//     });

//     return changes;
//   }, [formData, originalValues]);

//   const hasChanges = changedFields.length > 0;
//   const isButtonDisabled = isLaunched && !hasChanges;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleToggleVisibility = (e) => {
//     setFormData(prev => ({ ...prev, api_visibility: e.target.checked }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setShowConfirmModal(true);
//   };

//   const handleConfirmSave = () => {
//     setShowConfirmModal(false);
//     onSave(formData);
//   };

//   const renderFormField = (label, name, value, type = 'text', readOnly = false) => (
//     <div>
//       <label htmlFor={name} className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
//       <input
//         type={type}
//         id={name}
//         name={name}
//         value={value}
//         onChange={handleChange}
//         readOnly={readOnly}
//         className={`w-full p-2 rounded border ${readOnly
//           ? 'bg-gray-50 dark:bg-dark-input border-gray-300 dark:border-gray-700 cursor-not-allowed'
//           : 'bg-gray-100 dark:bg-darkbg border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400'
//           }`}
//       />
//     </div>
//   );

//   return (
//     <div className="p-6 dark:bg-secondary-dark-bg text-left">
//       <form onSubmit={handleSubmit} className="space-y-6">

//         {/* Basic Info Section */}
//         <div className="space-y-4">
//             {renderFormField('API Name', 'api_name', formData.api_name, 'text', true)}
//             <div>
//                 <label htmlFor="description" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">API Description</label>
//                 <textarea
//                     id="description"
//                     name="description"
//                     value={formData.api_description || ''}
//                     readOnly
//                     rows="3"
//                     className="w-full p-3 rounded-lg bg-gray-50 dark:bg-dark-input border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all cursor-not-allowed resize-none"
//                 ></textarea>
//             </div>
//         </div>

//         {/* Configuration Section */}
//         <div className="space-y-6">
//             {/* Row 1: API Category + Amount Range */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                     <label htmlFor="api_category" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">API Category</label>
//                     <input
//                         type="text"
//                         id="api_category"
//                         name="api_category"
//                         value={formData.api_category || ''}
//                         readOnly
//                         className="w-full p-3 rounded-lg border bg-gray-50 dark:bg-dark-input border-gray-200 dark:border-gray-700 text-gray-500 cursor-not-allowed"
//                     />
//                 </div>

//                 <div>
//                     <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Amount Range</label>
//                     <div className="grid grid-cols-2 gap-3">
//                         <div className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-input text-gray-500 dark:text-gray-400 font-medium">
//                             <span className="text-xs uppercase tracking-wide opacity-70 block mb-1">Min</span>
//                             {formData.min_amount}
//                         </div>
//                         <div className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-input text-gray-500 dark:text-gray-400 font-medium">
//                             <span className="text-xs uppercase tracking-wide opacity-70 block mb-1">Max</span>
//                             {formData.max_amount}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             {/* Row 2: Commercial Type */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                     <label htmlFor="commercial_type" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Commercial Type</label>
//                     {isReadOnly ? (
//                         <input
//                             type="text"
//                             id="commercial_type"
//                             value={formData.commercial_type || 'STANDARD'}
//                             readOnly
//                             className="w-full p-3 rounded-lg border bg-gray-50 dark:bg-dark-input border-gray-200 dark:border-gray-700 text-gray-500 cursor-not-allowed"
//                         />
//                     ) : (
//                         <select
//                             id="commercial_type"
//                             name="commercial_type"
//                             value={formData.commercial_type || 'STANDARD'}
//                             onChange={handleChange}
//                             className="w-full p-3 rounded-lg border bg-gray-50 dark:bg-darkbg border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
//                         >
//                             <option value="STANDARD">Standard</option>
//                             <option value="ELITE">Elite</option>
//                         </select>
//                     )}
//                 </div>
//             </div>

//             {/* Visibility Section */}
//             <div className="space-y-3">
//                 <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Visibility</label>
//                 <div className="flex items-center gap-4">
//                     <div className={`toggle-container flex-shrink-0 -mt-0.5 ${isReadOnly ? 'opacity-50 pointer-events-none' : ''}`}>
//                         <input
//                             type="checkbox"
//                             id="api_visibility"
//                             checked={formData.api_visibility || false}
//                             onChange={handleToggleVisibility}
//                             disabled={isReadOnly}
//                         />
//                         <label htmlFor="api_visibility" className="toggle-label">
//                             <div className="toggle-text off">Private APIs</div>
//                             <div className="toggle-text on">Open APIs</div>
//                             <div className="toggle-slider"></div>
//                         </label>
//                     </div>
//                     <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
//                         Configure IP forwarding rules to extract the true source IP of incoming traffic—especially when requests pass through proxies or load balancers...
//                     </p>
//                 </div>
//             </div>
//         </div>

//         <hr className="border-gray-200 dark:border-gray-700 my-6" />

//         {/* Amount Input */}
//         <div>
//             {renderFormField('Amount', 'amount', formData.amount, 'number', viewMode)}
//             <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
//                 <span className="inline-block w-1 h-1 rounded-full bg-gray-400"></span>
//                 The value should be between {formData.min_amount} and {formData.max_amount}
//             </p>
//         </div>

//         {!viewMode && (
//             <div className="flex justify-end pt-4">
//               <button
//                 type="submit"
//                 disabled={isButtonDisabled}
//                 className={`font-medium px-8 py-2.5 rounded-lg transition-all shadow-sm ${
//                     isButtonDisabled
//                         ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed'
//                         : 'bg-green-600 hover:bg-green-700 text-white hover:shadow active:scale-95'
//                 }`}
//               >
//                 {isLaunched ? 'Change Amount' : 'Launch'}
//               </button>
//             </div>
//         )}
//       </form>

//       <ChangeComparisonModal
//         isOpen={showConfirmModal}
//         onClose={() => setShowConfirmModal(false)}
//         onConfirm={handleConfirmSave}
//         changedFields={changedFields}
//         hasChanges={hasChanges}
//       />
//     </div>
//   );
// };

// export default EditApiForm;

import React, { useState, useEffect, useMemo } from "react";
import "./toggleButton.css";
import ChangeComparisonModal from "./ChangeComparisonModal";
import { FileCode, Rocket } from "lucide-react";
import Drawer from "../../../components/common/Drawer";
import HeadersPanel from "./HeadersPanel";
import { useSelector } from "react-redux";
import getCurrencySymbol from "../../../components/common/currencyIcon";

const EditApiForm = ({ asset, onSave, onReject, viewMode = false }) => {
  const [formData, setFormData] = useState(asset);
  const [originalValues, setOriginalValues] = useState(asset);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [showHeadersDrawer, setShowHeadersDrawer] = useState(false);
  const [locationForHeader, setLocationForHeader] = useState("GLOBAL");
  const [globalRules, setGlobalRules] = useState([]);

  const orgCurrency = useSelector((state) => state.currency.orgCurrency);

  useEffect(() => {
    setFormData(asset);
    setOriginalValues(asset);

    // Use actual API methods data
    if (
      asset?.methods &&
      Array.isArray(asset.methods) &&
      asset.methods.length > 0
    ) {
      setSelectedMethods(asset.methods);
    } else {
      setSelectedMethods([]);
    }

    // Initialize global rules from asset data
    if (asset?.ds_header_config && Array.isArray(asset.ds_header_config)) {
      setGlobalRules(convertRulesFromApiFormat(asset.ds_header_config));
    } else {
      setGlobalRules([]);
    }
  }, [asset]);

  const isPendingLaunch = asset?.api_status === "PENDING_LAUNCH";
  const isPartiallyEditable = ["LAUNCHED", "SUBSCRIBED", "ATTACHED"].includes(
    asset?.api_status,
  );

  // Check if any method has PENDING_LAUNCH status
  const hasMethodPendingLaunch = useMemo(() => {
    return selectedMethods.some(
      (method) => method.method_status === "PENDING_LAUNCH",
    );
  }, [selectedMethods]);

  const isReadOnly =
    viewMode ||
    isPendingLaunch ||
    isPartiallyEditable ||
    hasMethodPendingLaunch;

  // Detect changes
  const changedFields = useMemo(() => {
    const changes = [];
    const fieldsToTrack = ["amount", "api_visibility", "commercial_type"];

    fieldsToTrack.forEach((field) => {
      if (formData[field] !== originalValues[field]) {
        changes.push({
          field,
          oldValue: originalValues[field],
          newValue: formData[field],
        });
      }
    });

    return changes;
  }, [formData, originalValues]);

  const hasChanges = changedFields.length > 0;
  const isButtonDisabled =
    isPartiallyEditable && !hasChanges && !hasMethodPendingLaunch;

  // When partially editable API has method pending launch:
  // - Show "Launch" button instead of "Change Amount"
  // - Disable amount field
  const shouldShowLaunchDueToPendingMethod =
    isPartiallyEditable && hasMethodPendingLaunch;
  const shouldHideButton = viewMode;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleVisibility = (e) => {
    setFormData((prev) => ({ ...prev, api_visibility: e.target.checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    setShowConfirmModal(false);
    onSave(formData);
  };

  // Helper functions for header rules conversion
  const convertRulesToApiFormat = (rules) => {
    if (!rules || rules.length === 0) return [];
    return rules.map((rule) => {
      const apiRule = {
        operation: rule.ruleType === "Add" ? "ADD" : "REMOVE",
        header_name: rule.headerName,
      };
      if (rule.ruleType === "Add") {
        let valueType = "STRING";
        if (rule.dataType === "Query Parameter") {
          valueType = "QUERY_PARAMETER";
        } else if (rule.dataType === "Path Parameter") {
          valueType = "PATH_PARAMETER";
        }
        apiRule.value_type = valueType;
        apiRule.value_config = rule.data || "";
      }
      return apiRule;
    });
  };

  const convertRulesFromApiFormat = (apiRules) => {
    if (!apiRules || apiRules.length === 0) return [];
    return apiRules.map((rule, index) => {
      const uiRule = {
        id: Date.now() + index,
        ruleType: rule.operation === "ADD" ? "Add" : "Remove",
        headerName: rule.header_name,
      };
      if (rule.operation === "ADD") {
        let dataType = "Custom String Value";
        if (rule.value_type === "QUERY_PARAMETER") {
          dataType = "Query Parameter";
        } else if (rule.value_type === "PATH_PARAMETER") {
          dataType = "Path Parameter";
        }
        uiRule.dataType = dataType;
        uiRule.data = rule.value_config || "";
      }
      return uiRule;
    });
  };

  const getRulesForLocation = (location) => {
    if (location === "GLOBAL") {
      return globalRules;
    } else {
      const methodData = selectedMethods.find((m) => m.method === location);
      if (methodData?.ds_header_config) {
        const headerConfig = methodData.ds_header_config;
        if (headerConfig.length === 0) {
          return [];
        }
        if (headerConfig[0] && headerConfig[0].id !== undefined) {
          return headerConfig;
        } else {
          return convertRulesFromApiFormat(headerConfig);
        }
      }
      return [];
    }
  };

  const setRulesForLocation = (location, newRules) => {
    if (location === "GLOBAL") {
      setGlobalRules(newRules);
    } else {
      setSelectedMethods((prevMethods) => {
        const methodExists = prevMethods.some((m) => m.method === location);
        if (methodExists) {
          return prevMethods.map((m) => {
            if (m.method === location) {
              return { ...m, ds_header_config: newRules };
            }
            return m;
          });
        } else {
          return [
            ...prevMethods,
            { method: location, ds_header_config: newRules },
          ];
        }
      });
    }
  };

  const handleOpenHeaderConfig = (location = "GLOBAL") => {
    setLocationForHeader(location);
    setShowHeadersDrawer(true);
  };

  const renderFormField = (
    label,
    name,
    value,
    type = "text",
    readOnly = false,
  ) => {
    const isAmount = name === "amount";

    return (
      <div>
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
        >
          {label}
        </label>

        <div className="relative">
          {isAmount && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              {getCurrencySymbol(orgCurrency)}
            </span>
          )}

          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            readOnly={readOnly}
            className={`w-full ${isAmount ? "pl-8 pt-2 pb-2 pr-2" : "p-2"} rounded border ${readOnly
              ? "bg-gray-50 dark:bg-dark-input border-gray-300 dark:border-gray-700 cursor-not-allowed"
              : "bg-gray-100 dark:bg-darkbg border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              }`}
          />
        </div>
      </div>
    );
  };

  const HTTP_METHODS = [
    { method: "GET", color: "bg-green-600" },
    { method: "POST", color: "bg-blue-600" },
    { method: "PUT", color: "bg-orange-500" },
    { method: "PATCH", color: "bg-yellow-700" },
    { method: "DELETE", color: "bg-red-600" },
    { method: "OPTIONS", color: "bg-gray-500" },
    { method: "HEAD", color: "bg-blue-400" },
  ];

  const getMethodColor = (method) => {
    const methodConfig = HTTP_METHODS.find((m) => m.method === method);
    return methodConfig?.color || "bg-gray-600";
  };

  const formatStatus = (status) => {
    if (!status) return "Unknown";
    const statusMap = {
      PUBLISHED: "Published",
      DRAFT: "Draft",
      SAVED: "Saved",
      PENDING_LAUNCH: "Pending Launch",
      LAUNCHED: "Launched",
      ATTACHED: "Attached",
    };
    return (
      statusMap[status] ||
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
    );
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "PUBLISHED":
        return "bg-green-100 text-green-800";
      case "DRAFT":
        return "bg-orange-100 text-orange-800";
      case "SAVED":
        return "bg-blue-100 text-blue-800";
      case "PENDING_LAUNCH":
        return "bg-yellow-100 text-yellow-800";
      case "LAUNCHED":
        return "bg-purple-100 text-purple-800";
      case "ATTACHED":
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAmountChange = (e) => {
    const { value } = e.target;
    // Auto-update Logic: Amount > 0 ? Elite : Standard
    // User can still manually override via dropdown
    const amountVal = parseFloat(value);
    const newType = !isNaN(amountVal) && amountVal > 0 ? "ELITE" : "STANDARD";

    setFormData((prev) => ({
      ...prev,
      amount: value,
      commercial_type: newType,
    }));
  };

  return (
    <div className="p-6 dark:bg-secondary-dark-bg text-left">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Section */}
        <div className="space-y-4">
          {renderFormField(
            "API Name",
            "api_name",
            formData.api_name,
            "text",
            true,
          )}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
            >
              API Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.api_description || ""}
              readOnly
              rows="3"
              className="w-full p-3 rounded-lg bg-gray-50 dark:bg-dark-input border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all cursor-not-allowed resize-none"
            ></textarea>
          </div>
        </div>

        {/* Configuration Section */}
        <div className="space-y-6">
          {/* Row 1: API Category + Header Policy Button */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <label
                htmlFor="api_category"
                className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
              >
                API Category
              </label>
              <input
                type="text"
                id="api_category"
                name="api_category"
                value={formData.api_category || ""}
                readOnly
                className="w-full p-3 rounded-lg border bg-gray-50 dark:bg-dark-input border-gray-200 dark:border-gray-700 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div className="pb-0.5">
              <button
                type="button"
                onClick={() => handleOpenHeaderConfig("GLOBAL")}
                className={`bg-blue-600 hover:bg-blue-500 text-white px-4 py-3 rounded-md transition-colors w-full ${viewMode ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                disabled={viewMode}
              >
                Header Policy
              </button>
            </div>
          </div>

          {/* Row 2: Basic inputs... removed from here as per previous edit, checking next section */}
        </div>

        {/* API Methods Table Section */}
        <div className="space-y-4 mt-8">
          <h3 className="text-lg font-semibold dark:text-white mb-4 text-left">
            API Methods
          </h3>
          <div className="p-4 rounded-lg border dark:border-gray-700">
            <table className="w-full">
              <thead className="border-b dark:border-gray-700">
                <tr>
                  <th className="text-left py-2 px-4 font-semibold text-sm dark:text-white">
                    Method
                  </th>
                  <th className="text-left py-2 px-4 font-semibold text-sm dark:text-white">
                    Method Name
                  </th>
                  <th className="text-left py-2 px-4 font-semibold text-sm dark:text-white">
                    Description
                  </th>
                  <th className="text-left py-2 px-4 font-semibold text-sm dark:text-white">
                    Status
                  </th>
                  {!viewMode && (
                    <th className="text-left py-2 px-4 font-semibold text-sm dark:text-white">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {selectedMethods.map((method, index) => {
                  const isPendingLaunch =
                    method.method_status === "PENDING_LAUNCH";

                  return (
                    <tr
                      key={index}
                      className={`${index < selectedMethods.length - 1 ? "border-b dark:border-gray-700" : ""}`}
                    >
                      <td
                        className={`py-3 px-4 text-left ${isPendingLaunch
                          ? "text-red-500 dark:text-red-400"
                          : "dark:text-white"
                          }`}
                      >
                        <span
                          className={`inline-flex items-center h-6 px-3 rounded-md text-xs font-semibold whitespace-nowrap ${getMethodColor(method.method)} text-white`}
                        >
                          {method.method}
                        </span>
                      </td>
                      <td
                        className={`py-3 px-4 text-left ${isPendingLaunch
                          ? "text-red-500 dark:text-red-400"
                          : "dark:text-white"
                          }`}
                      >
                        {method.method_name}
                      </td>
                      <td
                        className={`py-3 px-4 text-left ${isPendingLaunch
                          ? "text-red-500 dark:text-red-400"
                          : "dark:text-gray-300"
                          }`}
                      >
                        {method.method_desc}
                      </td>
                      <td className="py-3 px-4 text-left">
                        <span
                          className={`inline-flex items-center h-6 px-3 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusBadgeClass(method.method_status)}`}
                        >
                          <i>{formatStatus(method.method_status)}</i>
                        </span>
                      </td>
                      {!viewMode && (
                        <td className="py-3 px-4 text-left">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenHeaderConfig(method.method)
                              }
                              className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400 p-1 rounded transition-colors"
                              title="Configure Header Policy for this method"
                            >
                              <FileCode className="w-4 h-4" />
                            </button>
                            {isPendingLaunch && (
                              <button
                                type="button"
                                onClick={() => onSave({ ...formData, launch_method: method.method })}
                                className="text-gray-500 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400 p-1 rounded transition-colors"
                                title="Launch this method"
                              >
                                <Rocket className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700 my-6" />

        {/* Bottom Section: Amount & Commercial Type & Visibility */}
        <div className="space-y-6">
          {/* Amount & Commercial Type Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
              >
                Amount
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount || 0}
                onChange={handleAmountChange}
                readOnly={viewMode || isPendingLaunch || hasMethodPendingLaunch}
                className={`w-full p-3 rounded-lg border ${viewMode || isPendingLaunch || hasMethodPendingLaunch
                  ? "bg-gray-50 dark:bg-dark-input border-gray-300 dark:border-gray-700 cursor-not-allowed"
                  : "bg-gray-100 dark:bg-darkbg border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  }`}
              />
              <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                <span className="inline-block w-1 h-1 rounded-full bg-gray-400"></span>
                The value should be between Minimum: {formData.min_amount || 0}{" "}
                and Maximum: {formData.max_amount || 0}
              </p>
            </div>

            <div>
              <label
                htmlFor="commercial_type"
                className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1"
              >
                Commercial Type
              </label>
              <div className="flex gap-3">
                {isReadOnly ? (
                  <input
                    type="text"
                    id="commercial_type"
                    value={formData.commercial_type === "ELITE" ? "Elite" : "Standard"}
                    readOnly
                    className="w-full p-3 rounded-lg border bg-gray-50 dark:bg-dark-input border-gray-200 dark:border-gray-700 text-gray-500 cursor-not-allowed"
                  />
                ) : (
                  <select
                    id="commercial_type"
                    name="commercial_type"
                    value={formData.commercial_type || "STANDARD"}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border bg-gray-50 dark:bg-darkbg border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                  >
                    <option value="STANDARD">Standard</option>
                    <option value="ELITE">Elite</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Visibility Section */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
              Visibility
            </label>
            <div className="flex items-center gap-4">
              <div
                className={`toggle-container flex-shrink-0 -mt-0.5 ${isReadOnly ? "opacity-50 pointer-events-none" : ""}`}
              >
                <input
                  type="checkbox"
                  id="api_visibility"
                  checked={formData.api_visibility || false}
                  onChange={handleToggleVisibility}
                  disabled={isReadOnly}
                />
                <label htmlFor="api_visibility" className="toggle-label">
                  <div className="toggle-text off">Private APIs</div>
                  <div className="toggle-text on">Open APIs</div>
                  <div className="toggle-slider"></div>
                </label>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Configure IP forwarding rules to extract the true source IP of
                incoming traffic—especially when requests pass through proxies
                or load balancers...
              </p>
            </div>
          </div>
        </div>

        {!shouldHideButton && (
          <div className="flex justify-end pt-4 gap-3">
            <button
              type="button"
              onClick={onReject}
              className="px-6 py-2.5 rounded-lg transition-all shadow-sm bg-red-500 hover:bg-red-600 text-white font-semibold"
            >
              Reject
            </button>
            <button
              type="submit"
              disabled={isButtonDisabled}
              className={`font-medium px-8 py-2.5 rounded-lg transition-all shadow-sm ${isButtonDisabled
                ? "bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white hover:shadow active:scale-95"
                }`}
            >
              {shouldShowLaunchDueToPendingMethod
                ? "Launch"
                : isPartiallyEditable
                  ? "Change Amount"
                  : "Launch"}
            </button>
          </div>
        )}
      </form>

      <ChangeComparisonModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSave}
        changedFields={changedFields}
        hasChanges={hasChanges}
      />

      {/* Header Policy Drawer */}
      <Drawer
        isOpen={showHeadersDrawer}
        onClose={() => setShowHeadersDrawer(false)}
        title={viewMode ? "View Headers" : "Headers"}
        width="70%"
      >
        <HeadersPanel
          viewMode={viewMode}
          initialData={asset}
          theme={"dark"}
          locationData={locationForHeader}
          rules={getRulesForLocation(locationForHeader)}
          globalRules={globalRules}
          setRules={(newRules) =>
            setRulesForLocation(locationForHeader, newRules)
          }
        />
      </Drawer>
    </div>
  );
};

export default EditApiForm;
