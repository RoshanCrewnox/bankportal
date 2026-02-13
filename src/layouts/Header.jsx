import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { ThemeContext } from "../components/common/ThemeContext";
import SearchBar from "../components/header/SearchBar";
import NavActions from "../components/header/NavActions";

const Header = ({ onSidebarToggle }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <header className="sticky top-0 z-[40] w-full px-4 py-3">
      <nav 
        className={`flex items-center justify-between px-4 py-2 rounded-xl shadow-lg border transition-all duration-300 border-transparent
          ${theme === 'dark' 
            ? 'bg-[#2F3349] border-white/5 shadow-black/20 text-white' 
            : 'bg-white border-gray-100 shadow-gray-200 text-gray-800'
          }`}
      >
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden mr-4">
          <button
            onClick={onSidebarToggle}
            className="p-2 rounded-lg text-gray-400 hover:text-primary-orange hover:bg-white/5 transition-all outline-none"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="grow flex items-center justify-start min-w-0">
          <SearchBar />
        </div>

        {/* Right Side Actions */}
        <div className="shrink-0 ml-4">
          <NavActions />
        </div>
      </nav>
    </header>
  );
};

export default Header;