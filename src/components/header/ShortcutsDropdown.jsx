import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { LayoutGrid, Plus, Calendar, FileText, Users, ShieldCheck, PieChart, Settings, HelpCircle, Square } from "lucide-react";
import { ThemeContext } from "../common/ThemeContext";

const shortcuts = [
  { name: "Calendar", desc: "Appointments", icon: Calendar, path: "/calendar" },
  { name: "Invoice App", desc: "Manage Accounts", icon: FileText, path: "/invoices" },
  { name: "User App", desc: "Manage Users", icon: Users, path: "/users" },
  { name: "Role Management", desc: "Permission", icon: ShieldCheck, path: "/roles" },
  { name: "Dashboard", desc: "User Dashboard", icon: PieChart, path: "/" },
  { name: "Setting", desc: "Account Settings", icon: Settings, path: "/settings" },
  { name: "FAQs", desc: "FAQs & Articles", icon: HelpCircle, path: "/faq" },
  { name: "Modals", desc: "Useful Popups", icon: Square, path: "/modals" },
];

const ShortcutsDropdown = () => {
  const { theme } = useContext(ThemeContext);
  const [isOpen, setIsOpen] = useState(false);
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-full transition-all focus:outline-none
          ${theme === 'dark' 
            ? 'text-gray-400 hover:text-white hover:bg-white/5' 
            : 'text-gray-500 hover:text-primary-orange hover:bg-gray-100'
          }`}
      >
        <LayoutGrid className="w-5 h-5" />
      </button>

      {isOpen && (
        <div 
          className={`absolute top-full right-0 mt-3 w-80 rounded-xl shadow-2xl border transition-all duration-300 overflow-hidden z-[100]
            ${theme === 'dark' 
              ? 'bg-[#2F3349] border-white/5 shadow-black/40' 
              : 'bg-white border-gray-100 shadow-gray-200'
            }`}
        >
          <div className="p-4 border-b border-inherit flex items-center justify-between">
            <h6 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Shortcuts</h6>
            <button className="p-1 hover:bg-white/5 rounded-full transition-colors">
              <Plus className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-2">
            {shortcuts.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex flex-col items-center justify-center p-6 border transition-all text-center group
                  ${theme === 'dark' 
                    ? 'border-white/5 hover:bg-white/5' 
                    : 'border-gray-50 hover:bg-gray-50'
                  }`}
                onClick={() => setIsOpen(false)}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors
                  ${theme === 'dark' ? 'bg-white/5 group-hover:bg-primary-orange/10' : 'bg-gray-100 group-hover:bg-primary-orange/10'}`}>
                  <item.icon className={`w-6 h-6 transition-colors ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} group-hover:text-primary-orange`} />
                </div>
                <span className={`text-sm font-medium transition-colors ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} group-hover:text-primary-orange`}>{item.name}</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">{item.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ShortcutsDropdown;
