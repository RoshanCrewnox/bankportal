import React, { useState, useEffect, useContext } from "react";
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from './Header';
import { ThemeContext } from "../components/common/ThemeContext";

const PrivateLayout = () => {
  const [expanded, setExpanded] = useState(window.innerWidth >= 1024);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const handleResize = () => {
      setExpanded(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`layout-wrapper layout-content-navbar ${theme === 'dark' ? 'dark' : ''} h-screen overflow-hidden`}>
      <div className="layout-container flex h-full">
        {/* Sidebar */}
        <div
          className={`fixed z-[9999] inset-y-0 left-0 transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0 dark:bg-[#2f3349] bg-[#F8F7FA]" : "-translate-x-full"}
            lg:translate-x-0 lg:static lg:z-auto`}
        >
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="layout-page flex flex-col flex-1 h-full">
          <Header onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />

          <div className="layout-content grow overflow-y-auto mt-2 px-4 py-2">
            <main className="grow main-content p-3"><Outlet /></main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivateLayout;
