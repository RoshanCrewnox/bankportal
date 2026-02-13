import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Ship } from "lucide-react";
import { ThemeContext } from "../common/ThemeContext";
import ThemeSwitcher from "../common/ThemeSwitcher";
import ShortcutsDropdown from "./ShortcutsDropdown";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";

const NavActions = () => {
  const { theme } = React.useContext(ThemeContext);
  const roleData = useSelector((state) => state.role.roleData);

  return (
    <div className="flex items-center space-x-2 md:space-x-4">
      {/* Interceptor Icon */}
      {roleData?.["header-items"]?.["CX-HR-001"]?.is_enabled && (
        <Link
          to="/cx/session-data"
          className={`p-2 rounded-full transition-all focus:outline-none 
            ${theme === 'dark' 
              ? 'text-gray-400 hover:text-white hover:bg-white/5' 
              : 'text-gray-500 hover:text-primary-orange hover:bg-gray-100'
            }`}
          title="Interceptor"
        >
          <Ship className="w-5 h-5" />
        </Link>
      )}

      {/* Theme Switcher */}
      <div className="flex items-center">
        <ThemeSwitcher />
      </div>

      {/* Shortcuts */}
      <ShortcutsDropdown />

      {/* Notifications */}
      <NotificationDropdown />

      {/* User Dropdown */}
      <UserDropdown />
    </div>
  );
};

export default NavActions;
