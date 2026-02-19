import React from 'react';

const inputClass = "w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-primary-orange/20 focus:border-primary-orange outline-none transition-all dark:text-white";
const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";

const RegulatoryInfoStep = ({ formData, updateFormData }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black dark:text-white tracking-tight">Regulatory Info</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Authorization and competent authority details.</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <label className={labelClass}>Competent Authority *</label>
          <input 
            className={inputClass} 
            placeholder="e.g., FCA (UK), BaFin (Germany)"
            value={formData.authority}
            onChange={(e) => updateFormData('regulatory', 'authority', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Authorization Number *</label>
          <input 
            className={inputClass} 
            placeholder="Public registry number"
            value={formData.authNumber}
            onChange={(e) => updateFormData('regulatory', 'authNumber', e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Authorization Date *</label>
          <input 
            className={inputClass} 
            type="date"
            value={formData.authDate}
            onChange={(e) => updateFormData('regulatory', 'authDate', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default RegulatoryInfoStep;
