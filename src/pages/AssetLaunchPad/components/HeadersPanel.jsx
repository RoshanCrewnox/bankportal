import {
  ChartNoAxesColumnIncreasing,
  CircleX,
  LifeBuoy,
  Plus,
  Tornado,
  Trash2,
} from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";

const RuleOption = ({ icon: Icon, text }) => (
  <div className="flex items-center space-x-2">
    <Icon className="w-4 h-4" />
    <span>{text}</span>
  </div>
);

export default function HeadersPanel({
  theme,
  locationData,
  rules,
  setRules,
  viewMode,
  globalRules = [],
  isPartiallyEditable = false,
  initialData = null,
}) {
  const [ruleType, setRuleType] = useState("Add");
  const [headerName, setHeaderName] = useState("");
  const [dataType, setDataType] = useState("Custom String Value");
  const [dataValue, setDataValue] = useState("");
  const [removeHeaderName, setRemoveHeaderName] = useState("");
  const [localRules, setLocalRules] = useState(rules || []);
  const [initialRuleIds, setInitialRuleIds] = useState(new Set());

  const [errors, setErrors] = useState({});

  // Track initial rules (from server) when component mounts or rules change from parent
  useEffect(() => {
    if (rules && rules.length > 0) {
      const existingIds = new Set(rules.map((rule) => rule.id));
      setInitialRuleIds(existingIds);
    }
  }, [locationData]); // Only run when location changes

  const normalizedGlobalRules = useMemo(
    () =>
      (globalRules || []).map((rule) => ({
        ...rule,
        __source: "GLOBAL",
      })),
    [globalRules],
  );

  const normalizedLocalRules = useMemo(
    () =>
      (localRules || []).map((rule) => ({
        ...rule,
        __source: locationData,
      })),
    [localRules, locationData],
  );

  // Update local rules when rules prop changes or location changes
  useEffect(() => {
    setLocalRules(rules || []);
  }, [rules, locationData]);
  const dataTypes = [
    {
      value: "Custom String Value",
      label: "Custom String Value",
      icon: ChartNoAxesColumnIncreasing,
    },
    { value: "Query Parameter", label: "Query Parameter", icon: LifeBuoy },
    { value: "Path Parameter", label: "Path Parameter", icon: Tornado },
  ];

  const handleAddRule = () => {
    const newErrors = {};
    if (!headerName.trim()) {
      newErrors.headerName = "Header Name is required.";
    }
    if (!dataValue.trim() && dataType === "Custom String Value") {
      newErrors.dataValue = "Value for custom string is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const newRule = {
      id: Date.now() + Math.random(), // Add random to ensure unique IDs
      location: locationData,
      ruleType: "Add",
      headerName,
      dataType,
      data: dataValue,
    };
    const updatedRules = [...localRules, newRule];
    setLocalRules(updatedRules);
    setRules(updatedRules);

    setHeaderName("");
    setDataValue("");
    setDataType("Custom String Value");
  };

  const handleRemoveRule = () => {
    const newErrors = {};
    if (!removeHeaderName.trim()) {
      newErrors.removeHeaderName = "Header Name is required for removal.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    const newRule = {
      id: Date.now() + Math.random(), // Add random to ensure unique IDs
      location: locationData,
      ruleType: "Remove",
      headerName: removeHeaderName,
    };
    const updatedRules = [...localRules, newRule];
    setLocalRules(updatedRules);
    setRules(updatedRules);
    setRemoveHeaderName("");
  };

  const handleDeleteRule = (id) => {
    const updatedRules = localRules.filter((rule) => rule.id !== id);
    setLocalRules(updatedRules);
    setRules(updatedRules);
  };

  const renderRulesSection = (title, rules, allowDelete) => (
    <div
      className={` rounded-md w-full mt-2 ${
        theme === "light" ? "bg-white text-back" : "bg-[#2F3349]"
      } shadow-sm h-fit p-1`}
    >
      <h3 className="text-lg font-medium ">
        {title} ({rules.length})
      </h3>
      <ul className="pl-0 mb-0">
        {rules.length === 0 ? (
          <li className="text-gray-500 italic">
            No header modification rules applied.
          </li>
        ) : (
          rules.map((rule) => {
            // Check if this rule is an existing rule (from server)
            const isExistingRule = initialRuleIds.has(rule.id);

            // For partially editable APIs, only allow deletion of NEW rules
            // For other cases, follow the original allowDelete logic
            const canDeleteThisRule =
              !viewMode &&
              allowDelete &&
              !(isPartiallyEditable && isExistingRule);

            return (
              <li
                key={rule.id}
                className={`flex items-center gap-1 justify-between p-2 rounded-md ${
                  theme === "light" ? "bg-gray-100" : "bg-[#3e425a]"
                } border border-gray-700`}
              >
                <p className="text-sm items-center mb-0">
                  {rule.ruleType === "Add" ? (
                    <>
                      <span className="font-semibold text-green-400">
                        Adding header{" "}
                      </span>
                      <span className="font-mono text-blue-300">
                        "{rule?.headerName}"
                      </span>
                      <span className="font-semibold"> with </span>
                      <span className="italic">{rule?.dataType}</span>
                      <span className="font-semibold"> as </span>
                      <span className="font-mono text-yellow-300">
                        "{rule?.data}"
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold text-red-400">
                        Removing header{" "}
                      </span>
                      <span className="font-mono text-blue-300">
                        "{rule?.headerName}"
                      </span>
                    </>
                  )}
                </p>
                {canDeleteThisRule && (
                  <button
                    onClick={() => handleDeleteRule(rule.id)}
                    className="text-red-500 hover:text-red-400 p-1 rounded transition-colors"
                    title="Delete Rule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );

  return (
    <div>
      <div
        className={`p-4 rounded-md w-full ${theme === "light" ? "bg-white text-back" : "bg-[#2F3349]"} shadow-sm h-fit`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Rule</label>
            <select
              className={`w-full p-2 ${theme === "light" ? "bg-white text-back" : "bg-[#2F3349]"} rounded-md border border-gray-700`}
              value={ruleType}
              onChange={(e) => {
                setRuleType(e.target.value);
                setErrors({});
              }}
              disabled={viewMode}
            >
              <option value="Add">Add Header</option>
              {/* Disabled Remove Header for SUBSCRIBED status */}
              <option
                value="Remove"
                disabled={["ATTACHED", "SUBSCRIBED"].includes(
                  initialData?.api_status,
                )}
                className={
                  ["ATTACHED", "SUBSCRIBED"].includes(initialData?.api_status)
                    ? "text-gray-400 cursor-not-allowed bg-gray-100 dark:bg-gray-800 opacity-50"
                    : ""
                }
              >
                Remove Header
              </option>
            </select>
          </div>
          {ruleType === "Add" ? (
            <>
              <div>
                <label className="block text-sm mb-1">
                  Header Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter header name"
                  value={headerName}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, "-");
                    setHeaderName(value);
                  }}
                  disabled={viewMode}
                  className={`w-full p-2 rounded-md border ${errors.headerName ? "border-red-500" : "border-gray-700"} ${theme === "light" ? "bg-white text-back" : "bg-[#2F3349]"}`}
                />
                {errors.headerName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.headerName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1">Data Definition</label>
                <select
                  className={`w-full p-2 rounded-md border border-gray-700 ${theme === "light" ? "bg-white text-back" : "bg-[#2F3349]"}`}
                  value={dataType}
                  onChange={(e) => setDataType(e.target.value)}
                  disabled={viewMode}
                >
                  {dataTypes?.map((type) => (
                    <option key={type?.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">
                  {dataType === "Custom String Value"
                    ? "Enter string value"
                    : `${dataType} Name`}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={
                    dataType === "Custom String Value"
                      ? "Input value"
                      : `${dataType} name`
                  }
                  value={dataValue}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, "-");
                    setDataValue(value);
                  }}
                  disabled={viewMode}
                  className={`w-full p-2 rounded-md border ${errors.dataValue ? "border-red-500" : "border-gray-700"} ${theme === "light" ? "bg-white text-back" : "bg-[#2F3349]"}`}
                />
                {errors.dataValue && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dataValue}
                  </p>
                )}
              </div>

              <button
                onClick={handleAddRule}
                disabled={viewMode}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Rule</span>
              </button>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm mb-1">
                  Header Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter header name to remove"
                  value={removeHeaderName}
                  disabled={viewMode}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\s/g, "-");
                    setRemoveHeaderName(value);
                  }}
                  className={`w-full p-2 rounded-md border ${errors.removeHeaderName ? "border-red-500" : "border-gray-700"} ${theme === "light" ? "bg-white text-back" : "bg-[#2F3349]"}`}
                />
                {errors.removeHeaderName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.removeHeaderName}
                  </p>
                )}
              </div>
              <button
                onClick={handleRemoveRule}
                disabled={viewMode}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition-colors flex items-center justify-center space-x-2"
              >
                <CircleX className="w-4 h-4" />
                <span>Remove Rule</span>
              </button>
            </>
          )}
        </div>
      </div>

      {locationData === "GLOBAL" ? (
        renderRulesSection("Global Header Rules", normalizedGlobalRules, true)
      ) : (
        <>
          {renderRulesSection(
            "Global Header Rules",
            normalizedGlobalRules,
            false,
          )}
          {renderRulesSection(
            `${locationData} Header Rules`,
            normalizedLocalRules,
            true,
          )}
        </>
      )}
    </div>
  );
}
