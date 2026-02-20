import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

const inputClass = "w-full px-4 py-2.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-primary-orange/20 focus:border-primary-orange outline-none transition-all dark:text-white";
const labelClass = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5";

const TechnicalSetupStep = ({ formData, updateFormData, addRedirectUri, removeRedirectUri }) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-black dark:text-white tracking-tight">Technical Setup</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">Configure environment and endpoints for the provider.</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <label className={labelClass}>Redirect URIs *</label>
            <p className="text-xs text-gray-500 mb-2 font-medium">OAuth2 callback URLs for authorization flow</p>
          </div>
          <button 
            onClick={addRedirectUri}
            className="bg-primary-orange/10 text-primary-orange hover:bg-primary-orange/20 px-4 py-2 rounded-xl text-xs font-black tracking-widest transition-colors flex items-center gap-2"
          >
            <Plus size={14} />
            Add URI
          </button>
        </div>
        
        <div className="space-y-4">
          {formData.redirectUris.map((uri, idx) => (
            <div key={idx} className="flex gap-3 group animate-in slide-in-from-right-4 duration-300">
              <input 
                className={inputClass} 
                placeholder="https://yourdomain.com/callback"
                value={uri}
                onChange={(e) => {
                  const newUris = [...formData.redirectUris];
                  newUris[idx] = e.target.value;
                  updateFormData('technical', 'redirectUris', newUris);
                }}
              />
              <button 
                onClick={() => removeRedirectUri(idx)}
                className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TechnicalSetupStep;
