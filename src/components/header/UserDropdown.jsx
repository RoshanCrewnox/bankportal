import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Settings, LogOut } from "lucide-react";
import services from "../../services";
import { getUserData } from "../auth/localStorage";
import { toCamelCaseValueWithCapital } from "../../utils/globalCamelCase";
import Alert from "../common/Alert";
import { ThemeContext } from "../common/ThemeContext";
import { useContext } from "react";

const getUserInitial = (userData) => {
  if (!userData) return { initial: "?", color: "bg-gray-500" };

  let initial = "?";
  if (userData.first_name && userData.last_name) {
    initial = (userData.first_name.charAt(0) + userData.last_name.charAt(0)).toUpperCase();
  } else if (userData.email) {
    initial = userData.email.charAt(0).toUpperCase();
  } else if (userData.username) {
    initial = userData.username.charAt(0).toUpperCase();
  }

  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-orange-500",
    "bg-pink-500",
  ];
  const colorIndex = initial.charCodeAt(0) % colors.length;
  return { initial, color: colors[colorIndex] };
};

const UserDropdown = () => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await services.user.USER_PROFILE();
        if (response.data) {
          setUserData(response.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { initial, color } = getUserInitial(userData);

  const handleLogout = () => {
    services.auth.LOGOUT();
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="flex items-center space-x-2 focus:outline-none group text-gray-400 hover:text-primary-orange transition-all"
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${color} border-2 border-transparent group-hover:border-primary-orange transition-all relative`}>
          {initial}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#2F3349] rounded-full"></span>
        </div>
      </button>

      {isOpen && (
        <div 
          className={`absolute top-full right-0 mt-3 w-72 rounded-xl shadow-2xl border transition-all duration-300 overflow-hidden z-[100]
            ${theme === 'dark' 
              ? 'bg-[#2F3349] border-white/5 shadow-black/40' 
              : 'bg-white border-gray-100 shadow-gray-200'
            }`}
        >
          {/* Popup Header with Large Avatar */}
          <div className={`p-6 border-b ${theme === 'dark' ? 'border-white/5' : 'border-gray-100'} flex items-center space-x-3`}>
             <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${color} relative shrink-0`}>
              {initial}
              <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 rounded-full ${theme === 'dark' ? 'border-[#2F3349]' : 'border-white'}`}></span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className={`text-sm font-semibold truncate leading-tight ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                {userData?.first_name} {userData?.last_name}
              </span>
              <span className={`text-xs capitalize truncate mt-0.5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {userData?.role_name || "Admin"}
              </span>
            </div>
          </div>

          <div className="py-2">
            {[
              { icon: User, label: 'My Profile', path: '/profile' },
              { icon: Settings, label: 'Settings', path: '/cx/settings' },
            ].map((item, idx) => (
              <Link
                key={idx}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`w-full px-6 py-2.5 flex items-center transition-colors text-sm group
                  ${theme === 'dark' 
                    ? 'text-gray-300 hover:bg-white/5' 
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <item.icon className="w-5 h-5 mr-3 text-gray-400 group-hover:text-primary-orange transition-colors" />
                <span className="font-medium group-hover:text-primary-orange transition-colors">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="px-4 pb-4 pt-1">
            <button
              onClick={() => {
                setIsLogoutConfirmOpen(true);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary-orange hover:bg-[#d9700a] text-white rounded-lg transition-all text-sm font-bold shadow-lg shadow-primary-orange/20"
            >
              <span>Logout</span>
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {isLogoutConfirmOpen && (
        <Alert
          showAlert={isLogoutConfirmOpen}
          type="confirm"
          title="Logout"
          message="Are you sure you want to log out?"
          onConfirm={handleLogout}
          onCancel={() => setIsLogoutConfirmOpen(false)}
          confirmText="Yes, Logout"
          cancelText="Cancel"
          showCancelButton={true}
        />
      )}
    </div>
  );
};

export default UserDropdown;
