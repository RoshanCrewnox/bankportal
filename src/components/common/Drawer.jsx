import React, { useContext } from 'react';
import { X } from 'lucide-react';
import './Drawer.css';
import { ThemeContext } from './ThemeContext';

const Drawer = ({ isOpen, onClose, title, children, width = '600px' }) => {
  const { theme } = useContext(ThemeContext)
  if (!isOpen) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose}></div>
      <div className={`drawer ${theme == "light" ? "bg-white text-back" : "bg-secondary-dark-bg"}  ${isOpen ? 'drawer-open' : ''}`} style={{ width }}>
        <div className={`drawer-header ${theme == "dark" ? " border-b-2 border-b-[#2d2e3a]" : ""} `}>
          <h2 className="version-history-title text-gray-800 dark:text-gray-100">
            {title}
          </h2>

          <button className="drawer-close-btn flex gap-1 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 p-2 rounded" onClick={onClose}>
            <X size={20} className='icon-close' /> <span className="text-sm">Close</span>
          </button>
        </div>
        <div className="drawer-content">
          {children}
        </div>
      </div>
    </>
  );
};

export default Drawer;
