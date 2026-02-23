import React from 'react';

const inputClass = "w-full px-4 py-2.5 bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-primary-orange/20 focus:border-primary-orange outline-none transition-all text-gray-900 dark:text-white dark:placeholder:text-gray-500";
const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";

const BusinessDetailsStep = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black dark:text-white tracking-tight">Business Details</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Provide legal entity information for the TPP.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1">
          <label className={labelClass}>TPP Name *</label>
          <input 
            className={inputClass} 
            placeholder="Legal company name"
            value={formData.name}
            onChange={(e) => updateFormData('business', 'name', e.target.value)}
          />
        </div>
        <div className="md:col-span-1">
          <label className={labelClass}>TPP ID *</label>
          <input 
            className={inputClass} 
            placeholder="e.g. TPP-001"
            value={formData.id}
            onChange={(e) => updateFormData('business', 'id', e.target.value)}
          />
        </div>
        <div className="md:col-span-1">
          <label className={labelClass}>Scope *</label>
          <select 
            className={inputClass}
            value={formData.scope}
            onChange={(e) => {
              const newScope = e.target.value;
              updateFormData('business', 'scope', newScope);
              // Reset type to empty when scope changes
              updateFormData('business', 'type', '');
            }}
          >
            <option value="">Select Scope</option>
            <option value="Open Banking">Open Banking</option>
            <option value="Open Finance">Open Finance</option>
          </select>
        </div>
        <div className="md:col-span-1">
          <label className={labelClass}>TPP Type *</label>
          <select 
            className={inputClass}
            value={formData.type}
            onChange={(e) => updateFormData('business', 'type', e.target.value)}
            disabled={!formData.scope}
          >
            <option value="">Select TPP Type</option>
            {formData.scope === 'Open Banking' ? (
              <>
                <option>Account Information (AISP)</option>
                <option>Payment Initiation (PISP)</option>
                <option>Both (AISP & PISP)</option>
              </>
            ) : formData.scope === 'Open Finance' ? (
              <>
                <option>Financial Information User (FIU)</option>
                <option>Financial Information Provider (FIP)</option>
                <option>Consent Central Manager (CCM)</option>
                <option>Account Aggregator (AA)</option>
                <option>FIS (Loan)</option>
                <option>FIS (Investment)</option>
                <option>FIS (Insurance)</option>
              </>
            ) : null}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Company Registration Number *</label>
          <input 
            className={inputClass} 
            placeholder="Official registration number"
            value={formData.regNumber}
            onChange={(e) => updateFormData('business', 'regNumber', e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Registered Address *</label>
          <textarea 
            className={`${inputClass} min-h-[120px] py-4 resize-none`}
            placeholder="Complete physical address"
            value={formData.address}
            onChange={(e) => updateFormData('business', 'address', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Country *</label>
          <input 
            className={inputClass} 
            placeholder="United Kingdom"
            value={formData.country}
            onChange={(e) => updateFormData('business', 'country', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Website</label>
          <input 
            className={inputClass} 
            placeholder="https://example.com"
            value={formData.website}
            onChange={(e) => updateFormData('business', 'website', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Contact Email *</label>
          <input 
            className={inputClass} 
            type="email"
            placeholder="contact@company.com"
            value={formData.email}
            onChange={(e) => updateFormData('business', 'email', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Contact Phone *</label>
          <input 
            className={inputClass} 
            placeholder="+44 20 7946 0000"
            value={formData.phone}
            onChange={(e) => updateFormData('business', 'phone', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailsStep;
