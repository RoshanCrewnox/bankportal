import React, { useContext } from "react";
import ReactDOM from "react-dom";
import { Clock, AlertTriangle, LogOut, RefreshCw } from "lucide-react";
import { ThemeContext } from "../common/ThemeContext";

const SessionTimeoutPopup = ({
  timeLeft,
  onStayLoggedIn,
  onLogout,
  show
}) => {
  const { theme } = useContext(ThemeContext);

  if (!show) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Glassmorphism Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onStayLoggedIn}
      />
      
      {/* Modal Content */}
      <div className={`relative w-full max-w-md transform overflow-hidden rounded-2xl p-8 text-center shadow-2xl transition-all ${
        theme === 'dark' 
          ? 'bg-[#1E2130] border border-white/10' 
          : 'bg-white border border-gray-100'
      }`}>
        {/* Warning Icon with pulse effect */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-orange-500/20" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500">
              <Clock size={40} />
            </div>
          </div>
        </div>

        <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Session Expiring
        </h2>
        
        <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Your session will expire in <span className="font-bold text-orange-500">{timeLeft} seconds</span> due to inactivity. Would you like to stay logged in?
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={onLogout}
            className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              theme === 'dark'
                ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <LogOut size={18} />
            Logout Now
          </button>
          
          <button
            onClick={onStayLoggedIn}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-orange text-white font-semibold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20"
          >
            <RefreshCw size={18} className="animate-spin-slow" />
            Extend Session
          </button>
        </div>

        {/* Top Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800">
          <div 
            className="h-full bg-orange-500 transition-all duration-1000 ease-linear"
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SessionTimeoutPopup;
