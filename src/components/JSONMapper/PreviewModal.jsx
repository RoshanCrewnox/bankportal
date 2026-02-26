import React, { useState } from 'react';
import { Code, X, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const PreviewModal = ({ isDark, cardClass, onClose, allProvidersJson, currentProviderJson, currentProviderName }) => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' or 'current'

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="absolute inset-0 bg-black/50" />
      <div className={`relative w-full max-w-3xl ${cardClass} flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200`}>
        {/* Header */}
        <div className={`p-4 border-b ${isDark ? 'border-white/5' : 'border-gray-100'} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-md ${isDark ? 'bg-primary-orange/10' : 'bg-orange-50'}`}>
              <Code size={14} className="text-primary-orange" />
            </div>
            <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Mapping Preview
            </span>
          </div>
          <button 
            onClick={onClose} 
            className={`p-1.5 rounded-md transition-colors ${
              isDark ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className={`px-4 pt-4 flex items-center gap-2`}>
          <div className={`flex p-1 rounded-lg ${isDark ? 'bg-white/5' : 'bg-gray-100'}`}>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${
                activeTab === 'all'
                  ? `${isDark ? 'bg-secondary-dark-bg' : 'bg-white'} text-primary-orange shadow-sm`
                  : `${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`
              }`}
            >
              All Providers
            </button>
            <button
              onClick={() => setActiveTab('current')}
              className={`px-4 py-2 rounded-md text-xs font-medium transition-all ${
                activeTab === 'current'
                  ? `${isDark ? 'bg-secondary-dark-bg' : 'bg-white'} text-primary-orange shadow-sm`
                  : `${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`
              }`}
            >
              {currentProviderName}
            </button>
          </div>
          <button
            onClick={() => copyToClipboard(activeTab === 'all' ? allProvidersJson : currentProviderJson)}
            className={`ml-auto px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
              isDark 
                ? 'bg-white/5 text-gray-300 hover:bg-white/10' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Check size={14} />
            Copy JSON
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-auto">
          <pre className={`text-xs font-mono p-4 rounded-lg overflow-auto ${
            isDark ? 'bg-darkbg text-gray-300' : 'bg-gray-50 text-gray-600'
          }`}>
            {activeTab === 'all' ? allProvidersJson : currentProviderJson}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;