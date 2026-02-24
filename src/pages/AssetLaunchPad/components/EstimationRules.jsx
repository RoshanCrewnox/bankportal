import React, { useEffect, useState, useContext } from "react";
import { useSelector } from "react-redux";
import { Edit, Save, X, Plus, Trash2, AlertCircle } from "lucide-react";
import Tooltip from "../../../components/common/Tooltip";
import toast from "react-hot-toast";
import services from "../../../services";
import { ThemeContext } from "../../../components/common/ThemeContext";
import getCurrencySymbol from "../../../components/common/currencyIcon";

export default function EstimationRules() {
  const { theme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState("rate-scaling");
  const orgCurrency = useSelector(
    (state) => state.currency?.orgCurrency || "USD",
  ); // Get organization currency
  const [isEditingRateScaling, setIsEditingRateScaling] = useState(false);
  const [isEditingThrottle, setIsEditingThrottle] = useState(false);
  const [isEditingTiered, setIsEditingTiered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tierCount, setTierCount] = useState(4);
  const [customTiers, setCustomTiers] = useState([]);
  const [originalTiers, setOriginalTiers] = useState([]);
  const [tierErrors, setTierErrors] = useState({});
  const [configData, setConfigData] = useState({
    METER_BASE_AMOUNT: 1000,
    METER_AMOUNT_CURRENCY: "INR",
    ELITE_API_COST_MIN: 50,
    ELITE_API_COST_MAX: 200,
    ESTIMATION_RULES: [],
    TIERED_DATA: [],
  });
  const [throttleData, setThrottleData] = useState({
    t_ratio_hour: 0,
    t_ratio_day: 0,
    t_ratio_month: 0,
  });
  const [tempThrottleData, setTempThrottleData] = useState({
    t_ratio_hour: 0,
    t_ratio_day: 0,
    t_ratio_month: 0,
  });
  const [throttleErrors, setThrottleErrors] = useState({});
  const permissions = { canEdit: true };

  const validateTiers = (tiers) => {
    const newErrors = {};

    tiers.forEach((tier) => {
      const errorsForTier = {};
      const minCallsRaw = tier.minCalls;
      const maxCallsRaw = tier.maxCalls;

      // Validate Start Quota (minCalls)
      if (
        minCallsRaw === "" ||
        minCallsRaw === null ||
        minCallsRaw === undefined
      ) {
        errorsForTier.minCalls = "Start quota is required.";
      } else {
        const minCalls = Number(minCallsRaw);
        if (isNaN(minCalls)) {
          errorsForTier.minCalls = "Must be a valid number.";
        } else if (minCalls <= 0) {
          errorsForTier.minCalls = "Cannot be negative or zero.";
        }
      }

      // Validate End Quota (maxCalls)
      if (
        maxCallsRaw === "" ||
        maxCallsRaw === null ||
        maxCallsRaw === undefined
      ) {
        errorsForTier.maxCalls = "Quota end is required.";
      } else {
        const maxCalls = Number(maxCallsRaw);
        const minCalls = Number(minCallsRaw);

        if (isNaN(maxCalls)) {
          errorsForTier.maxCalls = "Must be a valid number.";
        } else if (maxCalls < 0) {
          errorsForTier.maxCalls = "Cannot be negative.";
        } else if (!isNaN(minCalls) && maxCalls <= minCalls) {
          errorsForTier.maxCalls = `Must be greater than ${minCalls}.`;
        }
      }

      if (Object.keys(errorsForTier).length > 0) {
        newErrors[tier.id] = errorsForTier;
      }
    });

    setTierErrors(newErrors);
    return Object.keys(newErrors).length > 0;
  };

  // Fetch estimation configuration
  const FETCH_ESTIMATION_CONFIG = async () => {
    try {
      setIsLoading(true);
      const response = await services.assetLaunchPad.FETCH_ESTIMATION_RULES();
      const data = response.data;

      // Transform the API response
      const transformedData = {
        ...data,
        ELITE_API_COST_MAX: data.ELITE_API_COST_Max,
        ESTIMATION_RULES: data.ESTIMATION_RULES.map((rule, index) => ({
          ...rule,
          id: index + 1,
        })),
      };

      setConfigData(transformedData);
    } catch (error) {
      console.error("Failed to load estimation config:", error);
      toast.error("Failed to load estimation configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch throttle quota ratio configuration
  const FETCH_THROTTLE_CONFIG = async () => {
    try {
      setIsLoading(true);
      const response =
        await services.smartEstimationRules.FETCH_THROTTLE_QUOTA_RATIO();
      const data = response.data;

      setThrottleData(data);
      setTempThrottleData(data);
    } catch (error) {
      console.error("Failed to load throttle config:", error);
      toast.error("Failed to load throttle configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  const FETCH_OTS_TIER_CONFIG = async () => {
    try {
      setIsLoading(true);
      const response = await services.smartEstimationRules.FETCH_OTS_TIER();
      const data = response.data;
      const transformedTiers = data.config.map((tier) => ({
        id: tier.tier_seq,
        name: `Tier ${tier.tier_seq}`,
        minCalls: tier.quota_start,
        maxCalls: tier.quota_end,
        duration: data.quota_identifier,
        amount: tier.amount,
      }));
      setCustomTiers(transformedTiers);
      setOriginalTiers(transformedTiers);
      setTierCount(data.tier_count);
    } catch (error) {
      console.error("Failed to load tiered config:", error);
      toast.error("Failed to load tiered calculation configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update estimation configuration
  const UPDATE_ESTIMATION_CONFIG = async (dataToUpdate) => {
    try {
      setIsLoading(true);

      const apiData = {
        METER_BASE_AMOUNT: configData.METER_BASE_AMOUNT,
        METER_AMOUNT_CURRENCY: configData.METER_AMOUNT_CURRENCY,
        ELITE_API_COST_MIN: configData.ELITE_API_COST_MIN,
        ELITE_API_COST_Max: configData.ELITE_API_COST_MAX,
        ESTIMATION_RULES: configData.ESTIMATION_RULES.map((rule) => ({
          BRACKET_NAME: rule.BRACKET_NAME,
          UPPER_DAILY_QUOTA: rule.UPPER_DAILY_QUOTA,
          COST_MULTIPLIER: rule.COST_MULTIPLIER,
          ELITE_APIS_COST_MULTIPLIER: rule.ELITE_APIS_COST_MULTIPLIER,
        })),
        THROTTLE_RATIOS: configData.THROTTLE_RATIOS,
      };

      // Update specific data if provided
      if (dataToUpdate) {
        if (dataToUpdate.type === "throttle") {
          apiData.THROTTLE_RATIOS = dataToUpdate.data;
        }
      }

      const response =
        await services.assetLaunchPad.UPDATE_ESTIMATION_RULES(apiData);

      if (response) {
        toast.success("Estimation configuration updated successfully");
        // Refresh data to get any server-side transformations
        await FETCH_ESTIMATION_CONFIG();
      }
    } catch (error) {
      console.error("Failed to update estimation config:", error);
      toast.error("Failed to update estimation configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    FETCH_ESTIMATION_CONFIG();
    FETCH_THROTTLE_CONFIG();
    FETCH_OTS_TIER_CONFIG();
  }, []);

  const handleEditRateScaling = () => {
    setIsEditingRateScaling(true);
  };

  const handleSaveRateScaling = () => {
    UPDATE_ESTIMATION_CONFIG();
    setIsEditingRateScaling(false);
  };

  const handleCancelRateScaling = () => {
    // Refresh original data to discard changes
    FETCH_ESTIMATION_CONFIG();
    setIsEditingRateScaling(false);
  };

  const handleEditThrottle = () => {
    setIsEditingThrottle(true);
    // Store current throttle data in temp state
    setTempThrottleData(throttleData);
  };

  const handleEditTiered = () => {
    setIsEditingTiered(true);
  };

  const validateThrottle = (data) => {
    const errors = {};
    const fields = ["t_ratio_hour", "t_ratio_day", "t_ratio_month"];

    fields.forEach((field) => {
      const value = data[field];
      if (value === "" || value === null || value === undefined) {
        errors[field] = "Required";
      } else {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          errors[field] = "Must be a number";
        } else if (numValue <= 0) {
          errors[field] = "Must be > 0";
        }
      }
    });

    setThrottleErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveThrottle = async () => {
    if (!validateThrottle(tempThrottleData)) {
      toast.error("Please fix validation errors.");
      return;
    }

    try {
      const response =
        await services.smartEstimationRules.UPDATE_THROTTLE_QUOTA_RATIO(
          tempThrottleData,
        );

      if (response) {
        toast.success("Throttle configuration updated successfully");
        setThrottleData(tempThrottleData);
        setIsEditingThrottle(false);
      }
    } catch (error) {
      console.error("Failed to update throttle config:", error);
      toast.error("Failed to update throttle configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTiered = async () => {
    const hasErrors = validateTiers(customTiers);
    if (hasErrors) {
      toast.error("Please fix the validation errors before saving.");
      return;
    }

    try {
      const payload = {
        quota_identifier: "MONTH", // This might need to be dynamic if selectable
        tier_count: customTiers.length,
        config: customTiers.map((tier) => ({
          tier_seq: tier.id,
          quota_start: tier.minCalls,
          quota_end: Number(tier.maxCalls),
          amount: parseFloat(tier.amount) || 0,
        })),
      };

      // Assuming an update service exists
      const response =
        await services.smartEstimationRules.UPDATE_OTS_TIER(payload);
      if (response) {
        toast.success("Tiered configuration updated successfully");
        setOriginalTiers(customTiers);
        setIsEditingTiered(false);
        setTierErrors({});
      }
    } catch (error) {
      console.error("Failed to update tiered config:", error);
      toast.error("Failed to update tiered configuration.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelThrottle = () => {
    // Revert to original throttle data
    setTempThrottleData(throttleData);
    setThrottleErrors({});
    setIsEditingThrottle(false);
  };

  const handleCancelTiered = () => {
    setCustomTiers(originalTiers);
    setTierCount(originalTiers.length);
    setIsEditingTiered(false);
    setTierErrors({});
  };

  const handleDeleteRule = (id) => {
    setConfigData((prev) => ({
      ...prev,
      ESTIMATION_RULES: prev.ESTIMATION_RULES.filter((rule) => rule.id !== id),
    }));
  };

  const handleAddRule = () => {
    const newId =
      Math.max(...configData.ESTIMATION_RULES.map((rule) => rule.id), 0) + 1;
    setConfigData((prev) => ({
      ...prev,
      ESTIMATION_RULES: [
        ...prev.ESTIMATION_RULES,
        {
          id: newId,
          BRACKET_NAME: ``,
          UPPER_DAILY_QUOTA: 0,
          COST_MULTIPLIER: 0.0,
          ELITE_APIS_COST_MULTIPLIER: 0.0,
        },
      ],
    }));
  };

  const handleRuleChange = (id, field, value) => {
    setConfigData((prev) => ({
      ...prev,
      ESTIMATION_RULES: prev.ESTIMATION_RULES.map((rule) =>
        rule.id === id ? { ...rule, [field]: value } : rule,
      ),
    }));
  };

  const handleConfigChange = (field, value) => {
    setConfigData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleThrottleRatioChange = (field, value) => {
    setTempThrottleData((prev) => ({
      ...prev,
      [field]: value === "" ? value : Number(value),
    }));

    let error = "";
    if (value === "" || value === null || value === undefined) {
      error = "Required";
    } else {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        error = "Must be a number";
      } else if (numValue <= 0) {
        error = "Must be > 0";
      } else if (numValue > 100) {
        error = "Cannot exceed 100";
      }
    }

    setThrottleErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[field] = error;
      } else {
        delete newErrors[field];
      }
      return newErrors;
    });
  };

  const handleCustomTierCountChange = (e) => {
    const count = parseInt(e.target.value);
    setTierCount(count);
    // Tier generation is removed - tiers are managed via API
  };

  const handleCustomTierChange = (id, field, value) => {
    const updatedTiers = customTiers.map((tier) => {
      if (tier.id === id) {
        return { ...tier, [field]: value };
      }
      return tier;
    });

    // Real-time logic: If changing maxCalls, update next tier's minCalls
    const currentIndex = updatedTiers.findIndex((t) => t.id === id);
    if (field === "maxCalls" && currentIndex < updatedTiers.length - 1) {
      const numericValue = parseInt(value) || 0;
      updatedTiers[currentIndex + 1].minCalls = numericValue + 1;
    }

    // Real-time logic: If changing minCalls, update previous tier's maxCalls
    if (field === "minCalls" && currentIndex > 0) {
      const numericValue = parseInt(value) || 0;
      updatedTiers[currentIndex - 1].maxCalls = numericValue - 1;
    }

    setCustomTiers(updatedTiers);
    validateTiers(updatedTiers);
  };

  const handleDeleteCustomTier = (id) => {
    if (customTiers.length <= 1) return;

    const updatedTiers = customTiers.filter((tier) => tier.id !== id);

    // Rename remaining tiers and adjust min/max values
    const renamedTiers = updatedTiers.map((tier, index) => {
      const prevMax = index > 0 ? updatedTiers[index - 1].maxCalls : -1;
      return {
        ...tier,
        id: index + 1,
        name: `Tier ${index + 1}`,
        minCalls: index === 0 ? 0 : prevMax + 1,
      };
    });

    setCustomTiers(renamedTiers);
    setTierCount(renamedTiers.length);
  };

  const handleAddCustomTier = () => {
    const lastTier = customTiers[customTiers.length - 1];
    const newTierCount = tierCount + 1;
    const newTier = {
      id: newTierCount,
      name: `Tier ${newTierCount}`,
      minCalls: lastTier ? Number(lastTier.maxCalls) + 1 : 0,
      maxCalls: lastTier ? Number(lastTier.maxCalls) + 1000 : 1000,
      duration: "Month",
      amount: 0,
    };

    const updatedTiers = [...customTiers, newTier];
    setCustomTiers(updatedTiers);
    setTierCount(newTierCount);
  };

  // Theme-based classes
  const cardBgClass = theme === "dark" ? "bg-secondary-dark-bg" : "bg-white";
  const sectionBgClass = theme === "dark" ? "bg-darkbg" : "bg-gray-50";
  const textPrimaryClass = theme === "dark" ? "text-white" : "text-gray-900";
  const textSecondaryClass =
    theme === "dark" ? "text-gray-300" : "text-gray-700";
  const borderClass = theme === "dark" ? "border-gray-600" : "border-gray-200";
  const inputBgClass = theme === "dark" ? "bg-dark-input" : "bg-white";
  const hoverBgClass =
    theme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50";
  const tabActiveClass =
    theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-600 text-white";
  const tabInactiveClass =
    theme === "dark"
      ? "bg-transparent text-gray-300 hover:bg-gray-800"
      : "bg-transparent text-gray-700 hover:bg-gray-100";

  // Input field styling - Always editable style
  const getInputStyle = () => {
    return `px-3 py-1 border ${borderClass} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${inputBgClass} ${textPrimaryClass} font-semibold`;
  };

  // Select field styling - Always editable style
  const getSelectStyle = () => {
    return `px-2 py-1 border ${borderClass} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${inputBgClass} ${textPrimaryClass} font-semibold`;
  };

  if (isLoading) {
    return (
      <div
        className={`${cardBgClass} rounded-lg shadow-md p-6 flex justify-center items-center h-64`}
      >
        <div className={`text-xl ${textPrimaryClass}`}>
          Loading configuration...
        </div>
      </div>
    );
  }

  return (
    <div className={`${cardBgClass} rounded-lg shadow-md p-4 lg:p-6`}>
      {/* Header Section - Like CX Portal */}
      <div className="mb-6">
        <h2
          className={`text-xl font-semibold text-left ${textPrimaryClass} border-b ${borderClass} pb-2`}
        >
          Smart Estimation
        </h2>
      </div>

      {/* Tabs Navigation with Edit Buttons - Like CX Portal */}
      <div className="border-b ${borderClass} mb-6">
        <div className="container mx-auto px-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 p-2">
            {/* Tabs on Left */}
            <div className="flex items-center space-x-1 gap-2 overflow-x-auto">
              <button
                onClick={() => setActiveTab("rate-scaling")}
                className={`inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 text-sm whitespace-nowrap ${
                  activeTab === "rate-scaling"
                    ? "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                Rate Scaling
              </button>
              <button
                onClick={() => setActiveTab("throttle-quota-ratio")}
                className={`inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 text-sm whitespace-nowrap ${
                  activeTab === "throttle-quota-ratio"
                    ? "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                Throttle Quota Ratio
              </button>
              <button
                onClick={() => setActiveTab("tiered-calculation")}
                className={`inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 px-4 py-2 text-sm whitespace-nowrap ${
                  activeTab === "tiered-calculation"
                    ? "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                OTS Tiered Config
              </button>
            </div>

            {/* Edit/Save/Cancel Buttons on Right */}
            <div className="flex gap-2">
              {activeTab === "rate-scaling" && (
                <>
                  {!isEditingRateScaling ? (
                    <button
                      onClick={handleEditRateScaling}
                      disabled={isLoading || !permissions.canEdit}
                      title={
                        permissions.canEdit
                          ? "Edit Rate Scaling"
                          : "You don't have permission"
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        Edit Configuration
                      </span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSaveRateScaling}
                        disabled={isLoading || !permissions.canEdit}
                        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="w-4 h-4" />
                        <span className="hidden sm:inline">Save</span>
                      </button>
                      <button
                        onClick={handleCancelRateScaling}
                        disabled={isLoading}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-4 h-4" />
                        <span className="hidden sm:inline">Cancel</span>
                      </button>
                    </>
                  )}
                </>
              )}

              {activeTab === "throttle-quota-ratio" && (
                <>
                  {!isEditingThrottle ? (
                    <button
                      onClick={handleEditThrottle}
                      disabled={isLoading || !permissions.canEdit}
                      title={
                        permissions.canEdit
                          ? "Edit Throttle Quota Ratio"
                          : "You don't have permission"
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit Throttle</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSaveThrottle}
                        disabled={isLoading || !permissions.canEdit}
                        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="w-4 h-4" />
                        <span className="hidden sm:inline">Save</span>
                      </button>
                      <button
                        onClick={handleCancelThrottle}
                        disabled={isLoading}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-4 h-4" />
                        <span className="hidden sm:inline">Cancel</span>
                      </button>
                    </>
                  )}
                </>
              )}

              {activeTab === "tiered-calculation" && (
                <>
                  {!isEditingTiered ? (
                    <button
                      onClick={handleEditTiered}
                      disabled={isLoading || !permissions.canEdit}
                      title={
                        permissions.canEdit
                          ? "Edit OTS Tiered Config"
                          : "You don't have permission"
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Edit className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit OTS Tiered</span>
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={handleSaveTiered}
                        disabled={isLoading || !permissions.canEdit}
                        className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save className="w-4 h-4" />
                        <span className="hidden sm:inline">Save</span>
                      </button>
                      <button
                        onClick={handleCancelTiered}
                        disabled={isLoading}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X className="w-4 h-4" />
                        <span className="hidden sm:inline">Cancel</span>
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto mt-4">
        {/* Rate Scaling Tab Content */}
        {activeTab === "rate-scaling" && (
          <div className="space-y-6">
            {/* Rate Scaling Section */}
            <div className={`${sectionBgClass} rounded-lg p-4 lg:p-6`}>
              <div className="mb-6">
                <h3
                  className={`text-xl text-start font-medium mb-4 ${textPrimaryClass}`}
                >
                  Foundation Setup
                </h3>

                <div className="flex flex-row flex-wrap items-center gap-2 text-base">
                  <span className={`whitespace-nowrap ${textSecondaryClass}`}>
                    Baseline
                  </span>
                  <input
                    type="number"
                    value={configData.METER_BASE_AMOUNT}
                    onChange={(e) =>
                      handleConfigChange(
                        "METER_BASE_AMOUNT",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    disabled={!isEditingRateScaling}
                    className={`w-[10ch] ${getInputStyle()} ${!isEditingRateScaling ? "opacity-75 cursor-not-allowed" : ""}`}
                  />
                  <select
                    value={configData.METER_AMOUNT_CURRENCY}
                    onChange={(e) =>
                      handleConfigChange(
                        "METER_AMOUNT_CURRENCY",
                        e.target.value,
                      )
                    }
                    disabled={!isEditingRateScaling}
                    className={`${getSelectStyle()} ${!isEditingRateScaling ? "opacity-75 cursor-not-allowed" : ""}`}
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>

                  <span className={`whitespace-nowrap ${textSecondaryClass}`}>
                    for
                  </span>
                  <input
                    type="number"
                    value="25000"
                    readOnly
                    className={`w-[10ch] px-1 py-1 border-b ${borderClass} bg-transparent focus:outline-none ${textPrimaryClass} font-semibold`}
                  />
                  <span className={`whitespace-nowrap ${textSecondaryClass}`}>
                    Daily Quota Consumption
                  </span>

                  <span className={`whitespace-nowrap ${textSecondaryClass}`}>
                    and Elite API Cost ranging from
                  </span>
                  <input
                    type="number"
                    value={configData.ELITE_API_COST_MIN}
                    onChange={(e) =>
                      handleConfigChange(
                        "ELITE_API_COST_MIN",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    disabled={!isEditingRateScaling}
                    className={`w-[10ch] ${getInputStyle()} ${!isEditingRateScaling ? "opacity-75 cursor-not-allowed" : ""}`}
                  />
                  <span className={`whitespace-nowrap ${textSecondaryClass}`}>
                    to
                  </span>
                  <input
                    type="number"
                    value={configData.ELITE_API_COST_MAX}
                    onChange={(e) =>
                      handleConfigChange(
                        "ELITE_API_COST_MAX",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    disabled={!isEditingRateScaling}
                    className={`w-[10ch] ${getInputStyle()} ${!isEditingRateScaling ? "opacity-75 cursor-not-allowed" : ""}`}
                  />
                  <span className={`whitespace-nowrap ${textSecondaryClass}`}>
                    {configData.METER_AMOUNT_CURRENCY}
                  </span>
                </div>
              </div>

              <h3
                className={`text-xl text-start font-medium mb-4 ${textPrimaryClass}`}
              >
                Rate Scaling
              </h3>

              <div className="space-y-4">
                {configData.ESTIMATION_RULES.map((rule, index) => (
                  <div
                    key={rule.id}
                    className={`flex flex-col lg:flex-row lg:items-start gap-4 p-4 ${cardBgClass} rounded-lg border ${borderClass}`}
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:!bg-gray-700 ${textPrimaryClass} font-medium`}
                    >
                      {index + 1}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
                        <span
                          className={`text-base whitespace-nowrap ${textSecondaryClass}`}
                        >
                          The Rule Bracket identified as
                        </span>
                        <input
                          type="text"
                          value={rule.BRACKET_NAME}
                          onChange={(e) =>
                            handleRuleChange(
                              rule.id,
                              "BRACKET_NAME",
                              e.target.value,
                            )
                          }
                          disabled={!isEditingRateScaling}
                          className={`w-24 ${getInputStyle()} text-center ${!isEditingRateScaling ? "opacity-75 cursor-not-allowed" : ""}`}
                        />
                        <span
                          className={`text-base whitespace-nowrap ${textSecondaryClass}`}
                        >
                          will have ≤
                        </span>
                        <input
                          type="number"
                          value={rule.UPPER_DAILY_QUOTA}
                          onChange={(e) =>
                            handleRuleChange(
                              rule.id,
                              "UPPER_DAILY_QUOTA",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          disabled={!isEditingRateScaling}
                          className={`w-[10ch] ${getInputStyle()} ${!isEditingRateScaling ? "opacity-75 cursor-not-allowed" : ""}`}
                        />
                        <span
                          className={`text-base whitespace-nowrap ${textSecondaryClass}`}
                        >
                          , apply a
                        </span>
                        <input
                          type="number"
                          step="0.1"
                          value={rule.COST_MULTIPLIER}
                          onChange={(e) =>
                            handleRuleChange(
                              rule.id,
                              "COST_MULTIPLIER",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          disabled={!isEditingRateScaling}
                          className={`w-16 ${getInputStyle()} ${!isEditingRateScaling ? "opacity-75 cursor-not-allowed" : ""}`}
                        />
                        <span
                          className={`text-base whitespace-nowrap ${textSecondaryClass}`}
                        >
                          multiplier to Base Cost. For Elite APIs, use a
                        </span>
                        <input
                          type="number"
                          step="0.1"
                          value={rule.ELITE_APIS_COST_MULTIPLIER}
                          onChange={(e) =>
                            handleRuleChange(
                              rule.id,
                              "ELITE_APIS_COST_MULTIPLIER",
                              parseFloat(e.target.value) || 0,
                            )
                          }
                          disabled={!isEditingRateScaling}
                          className={`w-16 ${getInputStyle()} ${!isEditingRateScaling ? "opacity-75 cursor-not-allowed" : ""}`}
                        />
                        <span
                          className={`text-base whitespace-nowrap ${textSecondaryClass}`}
                        >
                          multiplier to the Base Elite API Cost.
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons - Only visible in edit mode */}
                    {isEditingRateScaling && (
                      <div className="flex items-center gap-2 lg:flex-row lg:justify-end">
                        <button
                          onClick={() => handleDeleteRule(rule.id)}
                          disabled={!permissions.canEdit}
                          className={`p-2 text-red-500 hover:text-red-700 ${hoverBgClass} rounded-lg transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed`}
                          title={
                            permissions.canEdit
                              ? "Delete Rule"
                              : "You don't have permission"
                          }
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        {/* Add Rule button only shown on the last item */}
                        {index === configData.ESTIMATION_RULES.length - 1 && (
                          <button
                            onClick={handleAddRule}
                            disabled={!permissions.canEdit}
                            className={`p-2 text-green-500 hover:text-green-700 ${hoverBgClass} rounded-lg transition-colors flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed`}
                            title={
                              permissions.canEdit
                                ? "Add Rule"
                                : "You don't have permission"
                            }
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {configData.ESTIMATION_RULES.length === 0 &&
                  isEditingRateScaling && (
                    <div className="flex justify-center">
                      <button
                        onClick={handleAddRule}
                        disabled={!permissions.canEdit}
                        className={`p-2 text-green-500 hover:text-green-700 ${hoverBgClass} rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                        title={
                          permissions.canEdit
                            ? "Add Rule"
                            : "You don't have permission"
                        }
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Rule</span>
                      </button>
                    </div>
                  )}

                {configData.ESTIMATION_RULES.length === 0 &&
                  !isEditingRateScaling && (
                    <div className={`text-center py-8 ${textSecondaryClass}`}>
                      No estimation rules configured.
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}

        {/* Throttle Quota Ratio Tab Content */}
        {activeTab === "throttle-quota-ratio" && (
          <div className="space-y-6">
            {/* Throttle Quota Ratio Section */}
            <div className={`${sectionBgClass} rounded-lg p-4 lg:p-6`}>
              <h3
                className={`text-xl text-start font-medium mb-6 ${textPrimaryClass}`}
              >
                Throttle Quota Ratio
              </h3>

              <div className="w-full">
                <div
                  className={`flex flex-col md:flex-row items-center justify-between gap-6 p-6 ${cardBgClass} rounded-lg border ${borderClass}`}
                >
                  {/* Hour Table */}
                  <div className="w-full md:w-1/3">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className={`border-b ${borderClass}`}>
                          <th
                            className={`py-3 px-4 text-left ${textSecondaryClass} font-medium`}
                          >
                            Identifier
                          </th>
                          <th
                            className={`py-3 px-4 text-right ${textSecondaryClass} font-medium`}
                          >
                            Ratio
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          className={`border-b ${borderClass} hover:${hoverBgClass}`}
                        >
                          <td className="py-3 px-4 text-start ">
                            <span className={`${textPrimaryClass} font-medium`}>
                              Hour
                            </span>
                          </td>
                          <td className="py-3 px-4 pb-6">
                            <div className="flex justify-end">
                              {isEditingThrottle ? (
                                <div className="relative">
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={tempThrottleData.t_ratio_hour}
                                    onChange={(e) =>
                                      handleThrottleRatioChange(
                                        "t_ratio_hour",
                                        e.target.value,
                                      )
                                    }
                                    className={`w-32 text-right pr-8 py-2 border ${
                                      throttleErrors.t_ratio_hour
                                        ? "border-red-500"
                                        : borderClass
                                    } rounded bg-transparent ${textPrimaryClass} focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                                  />
                                  <span
                                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${textSecondaryClass}`}
                                  >
                                    %
                                  </span>
                                  {throttleErrors.t_ratio_hour && (
                                    <div className="absolute top-full right-0 text-red-500 text-xs mt-1">
                                      {throttleErrors.t_ratio_hour}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div
                                  className={`border ${borderClass} rounded relative flex items-center justify-end ${inputBgClass} opacity-75 cursor-not-allowed`}
                                >
                                  <span
                                    className={`w-32 text-right pr-8 py-2 ${textPrimaryClass} font-medium`}
                                  >
                                    {throttleData.t_ratio_hour}
                                  </span>
                                  <span
                                    className={`absolute right-3 ${textSecondaryClass}`}
                                  >
                                    %
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Day Table */}
                  <div className="w-full md:w-1/3">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className={`border-b ${borderClass}`}>
                          <th
                            className={`py-3 px-4 text-left ${textSecondaryClass} font-medium`}
                          >
                            Identifier
                          </th>
                          <th
                            className={`py-3 px-4 text-right ${textSecondaryClass} font-medium`}
                          >
                            Ratio
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          className={`border-b ${borderClass} hover:${hoverBgClass}`}
                        >
                          <td className="py-3 px-4 text-start">
                            <span className={`${textPrimaryClass} font-medium`}>
                              Day
                            </span>
                          </td>
                          <td className="py-3 px-4  pb-6">
                            <div className="flex justify-end">
                              {isEditingThrottle ? (
                                <div className="relative">
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={tempThrottleData.t_ratio_day}
                                    onChange={(e) =>
                                      handleThrottleRatioChange(
                                        "t_ratio_day",
                                        e.target.value,
                                      )
                                    }
                                    className={`w-32 text-right pr-8 py-2 border ${
                                      throttleErrors.t_ratio_day
                                        ? "border-red-500"
                                        : borderClass
                                    } rounded bg-transparent ${textPrimaryClass} focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                                  />
                                  <span
                                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${textSecondaryClass}`}
                                  >
                                    %
                                  </span>
                                  {throttleErrors.t_ratio_day && (
                                    <div className="absolute top-full right-0 text-red-500 text-xs mt-1">
                                      {throttleErrors.t_ratio_day}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div
                                  className={`border ${borderClass} rounded relative flex items-center justify-end ${inputBgClass} opacity-75 cursor-not-allowed`}
                                >
                                  <span
                                    className={`w-32 text-right pr-8 py-2 ${textPrimaryClass} font-medium`}
                                  >
                                    {throttleData.t_ratio_day}
                                  </span>
                                  <span
                                    className={`absolute right-3 ${textSecondaryClass}`}
                                  >
                                    %
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Month Table */}
                  <div className="w-full md:w-1/3">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className={`border-b ${borderClass}`}>
                          <th
                            className={`py-3 px-4 text-left ${textSecondaryClass} font-medium`}
                          >
                            Identifier
                          </th>
                          <th
                            className={`py-3 px-4 text-right ${textSecondaryClass} font-medium`}
                          >
                            Ratio
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          className={`border-b ${borderClass} hover:${hoverBgClass}`}
                        >
                          <td className="py-3 px-4 text-start">
                            <span className={`${textPrimaryClass} font-medium`}>
                              Month
                            </span>
                          </td>
                          <td className="py-3 px-4  pb-6">
                            <div className="flex justify-end">
                              {isEditingThrottle ? (
                                <div className="relative">
                                  <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={tempThrottleData.t_ratio_month}
                                    onChange={(e) =>
                                      handleThrottleRatioChange(
                                        "t_ratio_month",
                                        e.target.value,
                                      )
                                    }
                                    className={`w-32 text-right pr-8 py-2 border ${
                                      throttleErrors.t_ratio_month
                                        ? "border-red-500"
                                        : borderClass
                                    } rounded bg-transparent ${textPrimaryClass} focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                                  />
                                  <span
                                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${textSecondaryClass}`}
                                  >
                                    %
                                  </span>
                                  {throttleErrors.t_ratio_month && (
                                    <div className="absolute top-full right-0 text-red-500 text-xs mt-1">
                                      {throttleErrors.t_ratio_month}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div
                                  className={`border ${borderClass} rounded relative flex items-center justify-end ${inputBgClass} opacity-75 cursor-not-allowed`}
                                >
                                  <span
                                    className={`w-32 text-right pr-8 py-2 ${textPrimaryClass} font-medium`}
                                  >
                                    {throttleData.t_ratio_month}
                                  </span>
                                  <span
                                    className={`absolute right-3 ${textSecondaryClass}`}
                                  >
                                    %
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div
                  className={`mt-6 text-start text-sm ${textSecondaryClass}`}
                >
                  <p>
                    Note: These ratios determine the throttling limits based on
                    time periods.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tiered-calculation" && (
          <div className="space-y-6">
            {/* Tiered Calculation Section */}
            <div className={`${sectionBgClass} rounded-lg p-4 lg:p-6`}>
              <h3
                className={`text-xl text-start font-medium mb-6 ${textPrimaryClass}`}
              >
                OTS Tiered Config
              </h3>

              <div className="w-full">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-6 mb-4">
                    <div className="flex-1">
                      <label
                        htmlFor="customTierCount"
                        className={`block text-sm font-medium ${textSecondaryClass} text-left mb-1`}
                      >
                        Number of Custom Tiers{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="customTierCount"
                        name="customTierCount"
                        value={customTiers.length}
                        onChange={handleCustomTierCountChange}
                        disabled={true}
                        className={`mt-1 block w-full px-3 py-2 ${inputBgClass} border ${borderClass} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${textPrimaryClass} opacity-75 cursor-not-allowed`}
                        required
                      >
                        <option value={customTiers.length}>
                          {customTiers.length} Tier
                          {customTiers.length !== 1 ? "s" : ""}
                        </option>
                      </select>
                    </div>

                    <div className="w-full sm:w-auto min-w-[150px]">
                      <label
                        className={`block text-sm font-medium ${textSecondaryClass} text-left mb-1`}
                      >
                        Quota Identifier
                      </label>
                      <div
                        className={`mt-1 block w-full px-3 py-2 ${inputBgClass} border ${borderClass} rounded-md shadow-sm text-left ${textPrimaryClass} opacity-75 cursor-not-allowed`}
                      >
                        Month
                      </div>
                    </div>
                  </div>

                  {customTiers.length > 0 && (
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <div></div>
                      </div>

                      <div
                        className={`overflow-x-auto border ${borderClass} rounded-lg`}
                      >
                        <table className="min-w-full divide-y divide-light-border dark:divide-dark-border">
                          <thead className="bg-gray-50 dark:!bg-gray-800/50">
                            <tr>
                              <th
                                className={`px-4 py-3 text-left text-md font-medium ${textSecondaryClass}  w-[15%]`}
                              >
                                Tiers
                              </th>
                              <th
                                className={`px-4 py-3 text-left text-md font-medium ${textSecondaryClass}   w-[45%]`}
                              >
                                Call Quota
                              </th>
                              <th
                                className={`px-4 py-3 text-left text-md font-medium ${textSecondaryClass}  w-[25%]`}
                              >
                                Amount
                              </th>
                              <th
                                className={`px-4 py-3 text-left text-md font-medium ${textSecondaryClass}   w-[15%]`}
                              >
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className={`divide-y ${borderClass}`}>
                            {customTiers.map((tier, index) => (
                              <tr
                                key={tier.id}
                                className={`hover:${hoverBgClass} min-h-24`}
                              >
                                <td className="text-start px-4 py-3 whitespace-nowrap w-[15%] align-top">
                                  <span
                                    className={`text-sm font-medium ${textPrimaryClass}`}
                                  >
                                    {tier.name}
                                  </span>
                                </td>
                                <td className="px-4 py-3 w-[45%] align-top">
                                  <div className="flex items-start gap-2">
                                    <div className="flex flex-col flex-1 relative">
                                      <input
                                        type="number"
                                        value={tier.minCalls}
                                        disabled={!isEditingTiered}
                                        onChange={(e) =>
                                          handleCustomTierChange(
                                            tier.id,
                                            "minCalls",
                                            e.target.value,
                                          )
                                        }
                                        className={`w-full pl-2 pr-8 py-1.5 border ${
                                          tierErrors[tier.id]?.minCalls
                                            ? "border-red-500"
                                            : borderClass
                                        } rounded text-sm ${textPrimaryClass} focus:outline-none focus:ring-1 focus:ring-blue-500 ${inputBgClass} ${!isEditingTiered ? "opacity-75 cursor-not-allowed" : ""}`}
                                      />
                                      {tierErrors[tier.id]?.minCalls && (
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 flex items-center">
                                          <Tooltip
                                            content={
                                              tierErrors[tier.id].minCalls
                                            }
                                          >
                                            <AlertCircle
                                              size={16}
                                              className="text-red-500 cursor-pointer"
                                            />
                                          </Tooltip>
                                        </div>
                                      )}
                                    </div>
                                    <span
                                      className={`text-sm ${textSecondaryClass} px-1 flex-shrink-0 pt-1.5`}
                                    >
                                      to
                                    </span>
                                    <div className="flex flex-col flex-1 relative">
                                      <input
                                        type="number"
                                        value={tier.maxCalls}
                                        disabled={!isEditingTiered}
                                        onChange={(e) =>
                                          handleCustomTierChange(
                                            tier.id,
                                            "maxCalls",
                                            e.target.value,
                                          )
                                        }
                                        className={`w-full pl-2 pr-8 py-1.5 border ${
                                          tierErrors[tier.id]?.maxCalls
                                            ? "border-red-500"
                                            : borderClass
                                        } rounded text-sm ${textPrimaryClass} focus:outline-none focus:ring-1 focus:ring-blue-500 ${inputBgClass} ${!isEditingTiered ? "opacity-75 cursor-not-allowed" : ""}`}
                                        min={tier.minCalls + 1}
                                      />
                                      {tierErrors[tier.id]?.maxCalls && (
                                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 flex items-center">
                                          <Tooltip
                                            content={
                                              tierErrors[tier.id].maxCalls
                                            }
                                          >
                                            <AlertCircle
                                              size={16}
                                              className="text-red-500 cursor-pointer"
                                            />
                                          </Tooltip>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3 w-[25%] align-top">
                                  <div className="relative">
                                    {/* Currency symbol */}
                                    <span
                                      className={`absolute left-3 top-2 ${textSecondaryClass}`}
                                    >
                                      {getCurrencySymbol(orgCurrency)}
                                    </span>
                                    <input
                                      type="number"
                                      value={tier.amount || ""}
                                      disabled={!isEditingTiered}
                                      onChange={(e) =>
                                        handleCustomTierChange(
                                          tier.id,
                                          "amount",
                                          e.target.value,
                                        )
                                      }
                                      placeholder="0"
                                      className={`w-full pl-8 pr-8 py-1.5 border ${borderClass} rounded text-sm ${textPrimaryClass} ${inputBgClass} ${!isEditingTiered ? "opacity-75 cursor-not-allowed" : ""}`}
                                    />
                                    {tierErrors[tier.id]?.amount && (
                                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 flex items-center">
                                        <Tooltip
                                          content={tierErrors[tier.id].amount}
                                        >
                                          <AlertCircle
                                            size={16}
                                            className="text-red-500 cursor-pointer"
                                          />
                                        </Tooltip>
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3 w-[15%] align-top">
                                  {isEditingTiered && (
                                    <div className="flex items-center space-x-1">
                                      {index === customTiers.length - 1 ? (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleDeleteCustomTier(tier.id)
                                            }
                                            className="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors rounded hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={customTiers.length <= 1}
                                            title="Delete last tier"
                                          >
                                            <Trash2 size={18} />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={handleAddCustomTier}
                                            className="p-1.5 text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors rounded hover:bg-green-50 dark:hover:bg-green-900/20"
                                            title="Add new tier"
                                          >
                                            <Plus size={18} />
                                          </button>
                                        </>
                                      ) : null}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
