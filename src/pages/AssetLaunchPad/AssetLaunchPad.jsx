import React, { useContext } from "react";
import { Search } from "lucide-react";
import { ThemeContext } from "../../components/common/ThemeContext";
import Pagination from "../../components/common/Pagination";
import NewAlertBox from "../../components/common/NewAlertBox";
import AssetTable from "./components/AssetTable";
import { useAssetLaunchPad } from "../../hooks/useAssetLaunchPad";
import LaunchPadDashboard from "./components/LaunchPadDashboard";
import AssetStatsCards from "./components/AssetStatsCards";
import AssetLaunchPadDrawerOrchestrator from "./components/AssetLaunchPadDrawerOrchestrator";
import { getAssetColumnName } from "../../utils/launchpadUtils";

/**
 * AssetLaunchPad - Orchestrator component for the Asset Launch Pad page.
 * Mandatory Rules: Under 300 lines, logic-less, uses custom hooks.
 */
export default function AssetLaunchPad() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  
  const hookData = useAssetLaunchPad();
  const {
    activeTab, setActiveTab, visitedTabs, setVisitedTabs,
    searchTerm, setSearchTerm, currentPage, setCurrentPage,
    assets, totalRecords, launchpadAssets,
    isDrawerOpen, setIsDrawerOpen, isDrawerLoading,
    selectedAsset, isViewMode, alert,
    handleEditAsset, handleViewAsset, handleLaunchAsset, itemsPerPage
  } = hookData;

  const screens = [
    { name: "Launch Pad", id: "launchpad" },
    { name: "APIs", id: "apis" },
    { name: "Products", id: "products" },
    { name: "TPP", id: "tpp" },
    { name: "Customer", id: "customer" },
  ].map(sub => ({ id: sub.id, name: sub.name, disabled: false }));

  const currentAssets = assets[activeTab] || [];
  const columnLabel = getAssetColumnName(activeTab);

  return (
    <div className="min-h-screen text-left">
      <NewAlertBox
        showAlert={alert.showAlert}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onConfirm={alert.onConfirm}
        onCancel={alert.onCancel}
        showCancelButton={alert.showCancelButton}
      />

      <h2 className="text-xl font-bold pb-2 text-gray-800 dark:text-white">
        Asset Launch Pad
      </h2>

      <AssetStatsCards
        screens={screens}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        visitedTabs={visitedTabs}
        setVisitedTabs={setVisitedTabs}
        launchpadAssets={launchpadAssets}
        setCurrentPage={setCurrentPage}
        setSearchTerm={setSearchTerm}
      />

      <div className={`p-6 rounded-2xl shadow-sm  min-h-[500px]`}>
        {activeTab === "launchpad" ? (
          <LaunchPadDashboard
            theme={theme}
            launchpadAssets={launchpadAssets}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            setCurrentPage={setCurrentPage}
            setSearchTerm={setSearchTerm}
            setVisitedTabs={setVisitedTabs}
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h3 className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                {columnLabel.replace(" Name", "s")}
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-xl border outline-none transition-all ${
                    isDark ? "bg-white/5 border-white/10 text-white focus:ring-blue-500/50" : "bg-gray-50 border-gray-200 text-gray-800 focus:ring-blue-500/30"
                  } focus:ring-4 text-sm w-64`}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </div>

            <div className="overflow-x-auto ">
              <AssetTable
                activeTab={activeTab}
                paginatedAssets={currentAssets}
                onEdit={handleEditAsset}
                onView={handleViewAsset}
                onLaunch={handleLaunchAsset}
              />
            </div>

            {currentAssets.length > 0 && (
              <Pagination
                totalItems={totalRecords}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                isDark={isDark}
              />
            )}
          </>
        )}
      </div>

      <AssetLaunchPadDrawerOrchestrator
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        isDrawerLoading={isDrawerLoading}
        selectedAsset={selectedAsset}
        activeTab={activeTab}
        isViewMode={isViewMode}
        handlers={hookData}
      />
    </div>
  );
}
