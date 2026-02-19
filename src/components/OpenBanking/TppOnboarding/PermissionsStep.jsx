import React from 'react';
import { Check } from 'lucide-react';

const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";

const PermissionsStep = ({ formData, toggleScope }) => {
  const availableScopes = ['Accounts', 'Payments', 'Transactions', 'Customer Info', 'Balances', 'Cards'];
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black dark:text-white tracking-tight">Permissions & Scopes</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Define which banking resources this TPP can access.</p>
      </div>

      <div className="space-y-6">
        <label className={labelClass}>Allowed Scopes *</label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {availableScopes.map(scope => (
            <label 
              key={scope} 
              className={`flex flex-col gap-3 p-6 rounded-3xl border-2 cursor-pointer transition-all duration-300 ${
                formData.scopes.includes(scope)
                  ? 'bg-primary-orange/5 border-primary-orange shadow-lg shadow-primary-orange/10'
                  : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 hover:border-primary-orange/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                  formData.scopes.includes(scope)
                    ? 'bg-primary-orange border-primary-orange text-white'
                    : 'bg-white dark:bg-darkbg border-gray-200 dark:border-white/20'
                }`}>
                  {formData.scopes.includes(scope) && <Check size={14} className="stroke-[3px]" />}
                </div>
                <input 
                  type="checkbox" 
                  className="hidden"
                  checked={formData.scopes.includes(scope)}
                  onChange={() => toggleScope(scope)}
                />
              </div>
              <span className={`text-sm font-black uppercase tracking-widest ${formData.scopes.includes(scope) ? 'text-primary-orange' : 'text-gray-600 dark:text-gray-400'}`}>
                {scope}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PermissionsStep;
