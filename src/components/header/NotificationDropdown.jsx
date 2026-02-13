import React, { useState, useRef, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Bell, X, Check, MailOpen } from "lucide-react";
import { ThemeContext } from "../common/ThemeContext";

const notifications = [
  { id: 1, title: "Congratulation Lettie 🎉", msg: "Won the monthly best seller gold badge", time: "1h ago", read: false, avatar: "L" },
  { id: 2, title: "Charles Franklin", msg: "Accepted your connection", time: "12hr ago", read: false, initial: "CF", color: "bg-red-500" },
  { id: 3, title: "New Message ✉️", msg: "You have new message from Natalie", time: "1h ago", read: true, avatar: "N" },
  { id: 4, title: "Whoo! You have new order 🛒", msg: "ACME Inc. made new order $1,154", time: "1 day ago", read: false, icon: "cart" },
  { id: 5, title: "Application approved 🚀", msg: "Your ABC project application has been approved.", time: "2 days ago", read: true, avatar: "A" },
];

const NotificationDropdown = () => {
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
        className={`p-2 rounded-full transition-all focus:outline-none relative
          ${theme === 'dark' 
            ? 'text-gray-400 hover:text-white hover:bg-white/5' 
            : 'text-gray-500 hover:text-primary-orange hover:bg-gray-100'
          }`}
      >
        <Bell className="w-5 h-5" />
        <span className={`absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border ${theme === 'dark' ? 'border-[#2F3349]' : 'border-white'}`}></span>
      </button>

      {isOpen && (
        <div 
          className={`absolute top-full right-0 mt-3 w-96 rounded-xl shadow-2xl border transition-all duration-300 overflow-hidden z-[100]
            ${theme === 'dark' 
              ? 'bg-[#2F3349] border-white/5 shadow-black/40' 
              : 'bg-white border-gray-100 shadow-gray-200'
            }`}
        >
          <div className="p-4 border-b border-inherit flex items-center justify-between">
            <h6 className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Notifications</h6>
            <div className="flex items-center space-x-3">
              <span className="bg-primary-orange/10 text-primary-orange text-[10px] font-bold px-2 py-0.5 rounded uppercase">8 New</span>
              <button className="text-gray-400 hover:text-white transition-colors">
                <MailOpen className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`flex p-4 border-b transition-all cursor-pointer group
                  ${theme === 'dark' 
                    ? 'border-white/5 hover:bg-white/5' 
                    : 'border-gray-50 hover:bg-gray-50'
                  } ${!item.read ? (theme === 'dark' ? 'bg-white/[0.02]' : 'bg-gray-50/50') : ''}`}
              >
                <div className="shrink-0 mr-4">
                  {item.initial ? (
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs ${item.color}`}>
                      {item.initial}
                    </div>
                  ) : item.avatar ? (
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-xs">
                      {item.avatar}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="grow min-w-0">
                  <h6 className={`text-xs font-semibold truncate mb-1 transition-colors ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>{item.title}</h6>
                  <p className={`text-[11px] line-clamp-2 mb-1 transition-colors ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{item.msg}</p>
                  <span className="text-[10px] text-gray-500 uppercase tracking-tighter">{item.time}</span>
                </div>
                <div className="shrink-0 ml-3 flex flex-col items-center justify-center space-y-2">
                  {!item.read && <div className="w-2 h-2 bg-primary-orange rounded-full"></div>}
                  <button className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 transition-all p-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={`p-4 border-t ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'}`}>
            <Link
              to="/"
              className="w-full inline-flex items-center justify-center py-2 bg-primary-orange hover:bg-[#d9700a] text-white text-xs font-bold rounded-lg transition-colors uppercase tracking-widest"
              onClick={() => setIsOpen(false)}
            >
              View all alert Xchanges
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
