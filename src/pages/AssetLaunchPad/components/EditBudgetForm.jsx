// import React, { useState, useEffect, useMemo } from 'react';
// import ChangeComparisonModal from './ChangeComparisonModal';

// const EditBudgetForm = ({ budget, onSave, viewMode = false }) => {
//   const [formData, setFormData] = useState(budget);
//   const [originalValues, setOriginalValues] = useState(budget);
//   const [showConfirmModal, setShowConfirmModal] = useState(false);

//   useEffect(() => {
//     setFormData(budget);
//     setOriginalValues(budget);
//   }, [budget]);

//   const isLaunched = budget?.meter_status === 'LAUNCHED';
//   const isReadOnly = viewMode || isLaunched;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const changedFields = useMemo(() => {
//     const changes = [];
//     const fieldsToTrack = ['actual_cost'];

//     fieldsToTrack.forEach(field => {
//       if (formData[field] !== originalValues[field]) {
//         changes.push({
//           field: field === 'actual_cost' ? 'amount' : field, // Map for display in modal
//           oldValue: originalValues[field],
//           newValue: formData[field]
//         });
//       }
//     });

//     return changes;
//   }, [formData, originalValues]);

//   const hasChanges = changedFields.length > 0;
//   const isButtonDisabled = isLaunched && !hasChanges;

//   const handleSaveClick = (e) => {
//     e.preventDefault();
//     setShowConfirmModal(true);
//   };

//   const handleConfirmSave = () => {
//     onSave(formData);
//     setShowConfirmModal(false);
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
//           ? 'bg-gray-50 dark:bg-dark-input border-gray-300 dark:border-gray-700 cursor-not-allowed text-gray-700 dark:text-gray-300'
//           : 'bg-gray-100 dark:bg-darkbg border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900 dark:text-white'
//           }`}
//       />
//     </div>
//   );

//   return (
//     <div className="p-6 dark:bg-secondary-dark-bg text-left">
//       <form onSubmit={handleSaveClick} className="space-y-4">
//         {renderFormField('Name', 'name', formData.name, 'text', true)}
//         <div>
//           <label htmlFor="description" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
//           <textarea
//             id="description"
//             name="description"
//             value={formData.description || ''}
//             readOnly
//             rows="3"
//             className="w-full p-2 rounded bg-gray-50 dark:bg-dark-input border border-gray-300 dark:border-gray-700 cursor-not-allowed text-gray-700 dark:text-gray-300"
//           ></textarea>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {renderFormField('Meter Type', 'meter_type', formData.meter_type || '', 'text', true)}
//           {renderFormField('Commercial Type', 'tier', (formData.actual_cost == 0 ? 'Free' : 'Elite'), 'text', true)}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//            {renderFormField('Custom Meter', 'is_custom_meter', formData.is_custom_meter ? 'Yes' : 'No', 'text', true)}
//         </div>


//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
//           <div>
//             <label htmlFor='quota_combined' className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Quota/Duration</label>
//             <input
//               type='text'
//               id='quota_combined'
//               name='quota_combined'
//               value={`${formData.quota || '0'} / ${formData.quota_duration || 'N/A'}`}
//               readOnly
//               className="w-full p-2 rounded bg-gray-50 dark:bg-dark-input border border-gray-300 dark:border-gray-700 cursor-not-allowed text-gray-700 dark:text-gray-300"
//             />
//           </div>
//           <div>
//             <label htmlFor='throttle' className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Throttle</label>
//             <input
//               type='text'
//               id='throttle'
//               name='throttle'
//               value={`${formData.throttle || '0'} / sec`}
//               readOnly
//               className="w-full p-2 rounded bg-gray-50 dark:bg-dark-input border border-gray-300 dark:border-gray-700 cursor-not-allowed text-gray-700 dark:text-gray-300"
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {renderFormField('Estimated Cost', 'estimated_cost', formData.estimated_cost || '', 'text', true)}
//           {renderFormField('Elite API Cost Factor', 'elite_api_cost_factor', formData.elite_api_cost_factor || '', 'text', true)}
//         </div>

//         <hr className="border-gray-300 dark:border-gray-600" />

//         {/* Editable field */}
//         {renderFormField('Amount', 'actual_cost', formData.actual_cost ?? '', 'number', viewMode)}

//         {!viewMode && (
//             <div className="flex justify-end pt-4 space-x-2">
//               <button
//                 type="submit"
//                 disabled={isButtonDisabled}
//                 className={`font-semibold px-6 py-2 rounded-md transition-colors shadow-sm ${
//                   isButtonDisabled
//                     ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
//                     : 'bg-green-500 hover:bg-green-600 text-white'
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

// export default EditBudgetForm;

import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Check, X } from 'lucide-react';
import ChangeComparisonModal from './ChangeComparisonModal';
import getCurrencySymbol from '../../../components/common/currencyIcon';

const EditBudgetForm = ({ budget, onSave, viewMode = false }) => {
  const [formData, setFormData] = useState(budget);
  const [originalValues, setOriginalValues] = useState(budget);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [customTiers, setCustomTiers] = useState([]);

  // Get organization currency from Redux
  const orgCurrency = useSelector((state) => state.currency?.orgCurrency || 'USD');
  const currencySymbol = getCurrencySymbol(orgCurrency);

  useEffect(() => {
    setFormData(budget);
    setOriginalValues(budget);

    // Testing ke liye sabhi meters ko tiered assume karo
    // Default tier data for testing
    const defaultTiers = [
      {
        id: 1,
        name: 'Tier 0',
        minCalls: 0,
        maxCalls: 100,
        estimatedCost: 0,
        amount: budget?.estimated_cost || 45
      },
      {
        id: 2,
        name: 'Tier 1',
        minCalls: 101,
        maxCalls: 200,
        estimatedCost: 0,
        amount: 145
      },
      {
        id: 3,
        name: 'Tier 2',
        minCalls: 201,
        maxCalls: 300,
        estimatedCost: 0,
        amount: 245
      }
    ];

    // Always use tiered for testing
    setCustomTiers(defaultTiers);

    // Calculate total amount from tiers
    const totalAmount = defaultTiers.reduce((sum, tier) => sum + tier.amount, 0);
    if (budget && !budget.actual_cost) {
      setFormData(prev => ({ ...prev, actual_cost: totalAmount }));
    }
  }, [budget]);

  const isLaunched = budget?.meter_status === 'LAUNCHED';
  const isReadOnly = viewMode || isLaunched;

  // Testing ke liye sabhi ko tiered banao
  const isTieredMeter = true; // Hardcode for testing

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle tier amount change
  const handleTierAmountChange = (id, value) => {
    const updatedTiers = customTiers.map(tier => {
      if (tier.id === id) {
        return { ...tier, amount: parseInt(value) || 0 };
      }
      return tier;
    });

    setCustomTiers(updatedTiers);

    // Update formData with new total amount (sum of all tier amounts)
    const totalAmount = updatedTiers.reduce((sum, tier) => sum + tier.amount, 0);
    setFormData(prev => ({ ...prev, actual_cost: totalAmount }));
  };

  const changedFields = useMemo(() => {
    const changes = [];
    const fieldsToTrack = ['actual_cost'];

    fieldsToTrack.forEach(field => {
      if (formData[field] !== originalValues[field]) {
        changes.push({
          field: field === 'actual_cost' ? 'amount' : field,
          oldValue: originalValues[field],
          newValue: formData[field]
        });
      }
    });

    // Also track tier amount changes
    if (isTieredMeter && customTiers.length > 0) {
      const originalTotal = originalValues.actual_cost || 0;
      const newTotal = formData.actual_cost || 0;
      if (originalTotal !== newTotal) {
        changes.push({
          field: 'tier_amounts',
          oldValue: `${currencySymbol}${originalTotal}`,
          newValue: `${currencySymbol}${newTotal}`
        });
      }
    }

    return changes;
  }, [formData, originalValues, customTiers, isTieredMeter, currencySymbol]);

  const hasChanges = changedFields.length > 0;
  const isButtonDisabled = isLaunched && !hasChanges;

  const handleSaveClick = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirmSave = () => {
    // Prepare data with tiers if it's a tiered meter
    const saveData = { ...formData, tiers: customTiers };
    onSave(saveData);
    setShowConfirmModal(false);
  };

  const renderFormField = (label, name, value, type = 'text', readOnly = false) => {
    const isAmount = name === 'actual_cost' || name === 'estimated_cost';

    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
        <div className="relative">
          {isAmount && (
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
              {currencySymbol}
            </span>
          )}
          <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            readOnly={readOnly}
            className={`w-full p-2 rounded border ${readOnly
              ? 'bg-gray-50 dark:bg-dark-input border-gray-300 dark:border-gray-700 cursor-not-allowed text-gray-700 dark:text-gray-300'
              : 'bg-gray-100 dark:bg-darkbg border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-900 dark:text-white'
              } ${isAmount ? 'pl-8' : ''}`}
          />
        </div>
      </div>
    );
  };

  const renderReadOnlyField = (label, value, withCurrency = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
      <div className="relative">
        {withCurrency && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
            {currencySymbol}
          </span>
        )}
        <input
          type="text"
          value={`${withCurrency ? currencySymbol : ''}${value}`}
          readOnly
          className={`w-full p-2 rounded bg-gray-50 dark:bg-dark-input border border-gray-300 dark:border-gray-700 cursor-not-allowed text-gray-700 dark:text-gray-300 ${withCurrency ? 'pl-8' : ''}`}
        />
      </div>
    </div>
  );

  return (
    <div className="p-6 dark:bg-secondary-dark-bg text-left">
      <form onSubmit={handleSaveClick} className="space-y-4">
        {renderFormField('Name', 'name', formData.name, 'text', true)}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            readOnly
            rows="3"
            className="w-full p-2 rounded bg-gray-50 dark:bg-dark-input border border-gray-300 dark:border-gray-700 cursor-not-allowed text-gray-700 dark:text-gray-300"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderFormField('Meter Type', 'meter_type', 'Tiered (Testing)', 'text', true)}
          {renderFormField('Commercial Type', 'tier', (formData.actual_cost == 0 ? 'Free' : 'Elite'), 'text', true)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Custom Meter</label>
            <div className="p-2">
              {formData.is_custom_meter ? (
                <Check className="w-5 h-5 text-green-500" />
              ) : (
                <X className="w-5 h-5 text-red-500" />
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label htmlFor='quota_combined' className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Quota/Duration</label>
            <input
              type='text'
              id='quota_combined'
              name='quota_combined'
              value={`${formData.quota || '0'} / ${formData.quota_duration || 'N/A'}`}
              readOnly
              className="w-full p-2 rounded bg-gray-50 dark:bg-dark-input border border-gray-300 dark:border-gray-700 cursor-not-allowed text-gray-700 dark:text-gray-300"
            />
          </div>
          <div>
            <label htmlFor='throttle' className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Throttle</label>
            <input
              type='text'
              id='throttle'
              name='throttle'
              value={`${formData.throttle || '0'} / sec`}
              readOnly
              className="w-full p-2 rounded bg-gray-50 dark:bg-dark-input border border-gray-300 dark:border-gray-700 cursor-not-allowed text-gray-700 dark:text-gray-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderReadOnlyField('Estimated Cost', formData.estimated_cost || 0, true)}
          {renderFormField('Elite API Cost Factor', 'elite_api_cost_factor', formData.elite_api_cost_factor || '', 'text', true)}
        </div>

        <hr className="border-gray-300 dark:border-gray-600" />

        {/* Testing ke liye hamesha tier table dikhao */}
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            Tier Details (Testing Mode - All meters are Tiered)
          </label>
          <div className="overflow-x-auto border border-gray-300 dark:border-gray-600 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-600">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider w-1/6">
                    Tiers
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider w-1/4">
                    Call Quota
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider w-1/6">
                    Estimated Cost
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider w-1/4">
                    Amounts
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300 dark:divide-gray-600">
                {customTiers.map((tier) => (
                  <tr key={tier.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
                    <td className="px-4 py-3 whitespace-nowrap w-1/6">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {tier.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap w-1/4">
                      <div className="flex items-center space-x-1">
                        <input
                          type="number"
                          value={tier.minCalls}
                          readOnly
                          className="w-16 px-2 py-1.5 bg-gray-50 dark:bg-dark-input border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 cursor-not-allowed"
                        />
                        <span className="text-gray-500 dark:text-gray-400 text-sm">to</span>
                        <input
                          type="number"
                          value={tier.maxCalls}
                          readOnly
                          className="w-16 px-2 py-1.5 bg-gray-50 dark:bg-dark-input border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 cursor-not-allowed"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap w-1/6">
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                          {currencySymbol}
                        </span>
                        <input
                          value={tier.estimatedCost}
                          readOnly
                          className="w-full pl-6 pr-2 py-1.5 bg-gray-50 dark:bg-dark-input border border-gray-300 dark:border-gray-600 rounded text-sm text-gray-700 dark:text-gray-300 cursor-not-allowed"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap w-1/4">
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 text-sm">
                          {currencySymbol}
                        </span>
                        <input
                          type="number"
                          value={tier.amount}
                          onChange={(e) => handleTierAmountChange(tier.id, e.target.value)}
                          readOnly={viewMode}
                          className={`w-full pl-6 pr-2 py-1.5 border rounded text-sm ${viewMode
                            ? 'bg-gray-50 dark:bg-dark-input border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed'
                            : 'border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 text-gray-900 dark:text-white'
                            }`}
                          min="0"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!viewMode && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Note: Only amount fields are editable. Total amount: {currencySymbol}{formData.actual_cost || 0}
            </p>
          )}
        </div>

        {!viewMode && (
          <div className="flex justify-end pt-4 space-x-2">
            <button
              type="submit"
              disabled={isButtonDisabled}
              className={`font-semibold px-6 py-2 rounded-md transition-colors shadow-sm ${isButtonDisabled
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
            >
              {isLaunched ? 'Change Amount' : 'Launch'}
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
    </div>
  );
};

export default EditBudgetForm;