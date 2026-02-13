import React, { useState, useContext, useRef, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';
import { TbSun, TbMoonStars, TbDeviceDesktopAnalytics } from "react-icons/tb";
import Alert from './Alert';
import services from '../../services';

const ThemeSwitcher = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingTheme, setPendingTheme] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleThemeSelect = (newTheme) => {
    if (newTheme === theme) {
      setIsOpen(false);
      return;
    }
    setPendingTheme(newTheme);
    setShowConfirm(true);
    setIsOpen(false);
  };

  const confirmThemeChange = async () => {
    try {
      await services.user.UPDATE_THEME(pendingTheme);
      setTheme(pendingTheme);
      setShowConfirm(false);
      setPendingTheme(null);
    } catch (error) {
      console.error("Failed to update theme preference:", error);
    }
  };

  const themeOptions = [
    { id: 'light', label: 'Light', icon: TbSun },
    { id: 'dark', label: 'Dark', icon: TbMoonStars },
    { id: 'system', label: 'System', icon: TbDeviceDesktopAnalytics },
  ];

  const CurrentIcon = themeOptions.find(opt => opt.id === theme)?.icon || TbSun;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-all focus:outline-none 
          ${theme === 'dark' 
            ? 'text-gray-400 hover:text-white hover:bg-white/5' 
            : 'text-gray-500 hover:text-primary-orange hover:bg-gray-100'
          }`}
        title="Theme Preference"
      >
        <CurrentIcon size={22} />
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-3 w-40 rounded-xl shadow-2xl border transition-all duration-300 py-2 z-[100]
          ${theme === 'dark' 
            ? 'bg-[#2F3349] border-white/10 shadow-black/40' 
            : 'bg-white border-gray-100 shadow-gray-200'
          }`}
        >
          {themeOptions.map((option) => {
            const Icon = option.icon;
            const isActive = theme === option.id;
            return (
              <button
                key={option.id}
                onClick={() => handleThemeSelect(option.id)}
                className={`w-full px-4 py-2.5 flex items-center transition-colors text-sm group ${
                  isActive 
                    ? 'bg-primary-orange/10 text-primary-orange' 
                    : theme === 'dark' 
                      ? 'text-gray-300 hover:bg-white/5' 
                      : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 transition-colors ${
                  isActive ? 'text-primary-orange' : theme === 'dark' ? 'text-gray-400 group-hover:text-white' : 'text-gray-400 group-hover:text-gray-700'
                }`} />
                <span className="font-medium">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {showConfirm && (
        <Alert
          showAlert={showConfirm}
          type="confirm"
          title="Set Theme Preference"
          message="Do you want to set this theme as your preference?"
          onConfirm={confirmThemeChange}
          onCancel={() => {
            setTheme(pendingTheme);
            setShowConfirm(false);
            setPendingTheme(null);
          }}
          confirmText="Yes"
          cancelText="No"
          showCancelButton={true}
        />
      )}
    </div>
  );
};

export default ThemeSwitcher;
