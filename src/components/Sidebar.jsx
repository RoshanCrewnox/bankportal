import React, { useState, useContext, useEffect } from "react";
import { ChevronRight, X, LayoutDashboard, Settings2, ShieldCheck, Building2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ZeroTeq from "../assets/Mosura12.png";
import ZeroTeqLogo from "../assets/Mosura12.png";
import { Icons } from "./common/icon.jsx";
import { ThemeContext } from "./common/ThemeContext";
import { useSelector } from "react-redux";

import { sidebarItems } from "../utils/sidebarItems";

const NewSidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const [openMenus, setOpenMenus] = useState({});
  const { theme } = useContext(ThemeContext);
  const [filteredNavItems, setFilteredNavItems] = useState([]);
  const roleData = useSelector((state) => state.role.roleData);

  const toggleSubmenu = (id) => {
    setOpenMenus((prev) => {
      const isCurrentlyOpen = prev[id];
      return { [id]: !isCurrentlyOpen };
    });
  };

  const normalizeName = (name) => {
    return name.replace(/ -N$/, "").trim().toLowerCase();
  };

  useEffect(() => {
    // Start with items from config
    setFilteredNavItems(sidebarItems);
  }, [roleData]);

  const isPathActive = (path) => {
    if (!path) return false;
    if (currentPath === path) return true;
    return currentPath.startsWith(path + "/");
  };

  const isSubActive = (submenu) => {
    if (!submenu || !submenu.length) return false;
    return submenu.some((s) => isPathActive(s.pathname));
  };

  return (
    <div
      className={`sidebar h-[calc(100vh)] overflow-y-auto transition-all duration-300 ${
        theme === "dark" ? "bg-secondary-dark-bg" : "bg-white"
      }`}
      style={{ width: "260px" }}
    >
      <div className="flex flex-col h-full">
        <div className="w-full px-6 py-8">
          <div className="flex items-center justify-between ">
            <div className="flex items-center w-full">
              <img
                src={theme === "dark" ? ZeroTeq : ZeroTeqLogo}
                alt="ZeroTeq Logo"
                role="button"
                tabIndex={0}
                onClick={() => navigate("/")}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") navigate("/"); }}
                className="w-full cursor-pointer object-contain transition-transform hover:scale-105"
              />
            </div>
            {sidebarOpen && (
              <X
                className="cursor-pointer text-gray-400 lg:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}
          </div>
        </div>

        <div className="overflow-auto grow pb-10">
          <ul className="flex flex-col gap-1">
            {filteredNavItems?.map((item) => {
              const isActive = item.hasSubmenu ? isSubActive(item.submenu) : isPathActive(item.pathname);
              const isItemExpanded = openMenus[item.id] || (isActive && openMenus[item.id] !== false);

              return (
                <li key={item.id} className="w-full">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => item.hasSubmenu ? toggleSubmenu(item.id) : navigate(item.pathname)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); item.hasSubmenu ? toggleSubmenu(item.id) : navigate(item.pathname); } }}
                    className={`flex items-center py-3 px-4 cursor-pointer rounded-md transition-all duration-200 ${
                      isActive
                        ? "bg-primary-orange text-white shadow-lg shadow-primary-orange/20"
                        : theme === "light"
                        ? "text-gray-700 hover:bg-gray-100"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className={`mr-3 flex items-center shrink-0 ${isActive ? "text-white" : "text-gray-500"}`}>
                      {item?.icon}
                    </span>
                    <span className="text-sm font-medium">{item?.name}</span>
                    {item?.hasSubmenu && (
                      <ChevronRight
                        className={`ml-auto transition-transform duration-300 ${isItemExpanded ? "rotate-90" : ""}`}
                        size={16}
                      />
                    )}
                  </div>

                  {item?.hasSubmenu && isItemExpanded && (
                    <ul className="flex flex-col ml-2 mt-1 gap-1">
                      {item.submenu.map((subitem) => {
                        const isSubSubActive = isPathActive(subitem.pathname);
                        return (
                          <li key={subitem.id} className="w-full">
                            <Link
                              to={subitem.pathname}
                              className={`py-2 px-4 rounded-md flex items-center transition-all duration-200 group ${
                                isSubSubActive
                                  ? theme === 'light' ? "bg-orange-50 text-primary-orange" : "bg-white/5 text-primary-orange"
                                  : theme === 'light'
                                    ? "text-gray-600 hover:text-primary-orange hover:bg-gray-50"
                                    : "text-gray-400 hover:text-primary-orange hover:bg-white/2"
                              }`}
                            >
                              <div className={`w-1.5 h-1.5 rounded-md mr-3 transition-all ${
                                isSubSubActive ? "bg-primary-orange scale-125" : theme === 'light' ? "bg-gray-300 group-hover:bg-primary-orange" : "bg-gray-600 group-hover:bg-primary-orange"
                              }`} />
                              <span className="text-sm font-medium">{subitem.name}</span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NewSidebar;
