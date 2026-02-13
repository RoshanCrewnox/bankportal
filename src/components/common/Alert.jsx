import React, { useContext } from 'react';
import { X } from 'lucide-react';
import { ThemeContext } from './ThemeContext';

const Alert = ({ showAlert, title, message, onConfirm, onCancel, showCancelButton, confirmText, cancelText }) => {
  const { theme } = useContext(ThemeContext);
  
  if (!showAlert) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className={`backdrop-blur-xl border p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 relative overflow-hidden transition-all duration-300 slide-in-from-bottom-4 animate-in
        ${theme === 'dark' 
          ? 'bg-[#2F3349]/90 border-white/10' 
          : 'bg-white/90 border-gray-200'
        }`}
      >
        {/* Close Button */}
        <button 
          onClick={onCancel}
          className={`absolute top-6 right-6 transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-800'}`}
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className={`text-xl font-bold mb-3 text-left ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        <p className={`mb-8 leading-relaxed text-left ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          {message}
        </p>
        
        <div className="flex items-center justify-end space-x-3 mt-4">
          {showCancelButton && (
            <button
              onClick={onCancel}
              className="px-6 py-2.5 bg-[#4B4E63]/50 hover:bg-[#5a5d75] text-white rounded-xl transition-all font-bold"
            >
              {cancelText || 'No'}
            </button>
          )}
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-primary-orange hover:bg-primary-orange/90 text-white rounded-xl transition-all font-bold shadow-lg shadow-primary-orange/20"
          >
            {confirmText || 'Yes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alert;
