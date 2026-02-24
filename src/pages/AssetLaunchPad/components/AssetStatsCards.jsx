import React from 'react';
import CustomButton from './CustomButton';

/**
 * AssetStatsCards - Component for the top tab navigation and stats badges.
 * Mandatory Rules: Presentational only.
 */
const AssetStatsCards = ({ screens, activeTab, setActiveTab, visitedTabs, setVisitedTabs, launchpadAssets, setCurrentPage, setSearchTerm }) => {
  const handleTabClick = (screen) => {
    setActiveTab(screen.id);
    if (screen.id === "launchpad") {
      setVisitedTabs([]);
    } else {
      setVisitedTabs(prev => prev.includes(screen.id) ? prev : [...prev, screen.id]);
    }
    setCurrentPage(1);
    setSearchTerm("");
  };

  return (
    <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-600 mb-6 overflow-x-auto">
      <div className="flex items-center space-x-1 py-4 p-2 gap-2">
        {screens?.map((screen) => (
          <CustomButton
            key={screen.id}
            variant={activeTab === screen.id ? "default" : "ghost"}
            size="sm"
            onClick={() => handleTabClick(screen)}
            className="whitespace-nowrap relative"
            disabled={screen.disabled}
          >
            <span className="relative inline-block">
              {screen.name}
              {["APIs", "Products", "TPP", "Customer"].includes(screen.name) && !visitedTabs.includes(screen.id) && (
                <span className="absolute -top-2 -right-3 rounded-full bg-danger text-white text-[10px] px-1.5 leading-none border">
                  {screen.name === "APIs" ? launchpadAssets?.pending_apis :
                   screen.name === "Products" ? launchpadAssets?.pending_products :
                   screen.name === "TPP" ? launchpadAssets?.pending_tpp :
                   screen.name === "Customer" ? launchpadAssets?.pending_customers : "0"}
                </span>
              )}
            </span>
          </CustomButton>
        ))}
      </div>
    </div>
  );
};

export default AssetStatsCards;
