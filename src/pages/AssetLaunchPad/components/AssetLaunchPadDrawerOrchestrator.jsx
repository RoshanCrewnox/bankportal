import React from 'react';
import Drawer from '../../../components/common/Drawer';
import EditApiForm from './EditApiForm';
import EditProductForm from './EditProductForm';
import EditBudgetForm from './EditBudgetForm';

/**
 * AssetLaunchPadDrawerOrchestrator - Manages drawer content for Asset LaunchPad.
 * Mandatory Rules: Presentational logic only, no API calls.
 */
const AssetLaunchPadDrawerOrchestrator = ({ 
  isDrawerOpen, 
  setIsDrawerOpen, 
  isDrawerLoading, 
  selectedAsset, 
  activeTab, 
  isViewMode,
  handlers // from useAssetLaunchPad hook
}) => {
  if (!selectedAsset && !isDrawerLoading) return null;

  return (
    <Drawer
      width="1000px"
      isOpen={isDrawerOpen}
      onClose={() => setIsDrawerOpen(false)}
      title={isDrawerLoading ? "Loading..." : selectedAsset?.name}
    >
      {isDrawerLoading ? (
        <div className="flex h-full items-center justify-center p-8">
          <p className="text-gray-500 dark:text-gray-400">Loading details...</p>
        </div>
      ) : (
        <div className="p-1">
          {activeTab === "products" ? (
            <EditProductForm
              productId={selectedAsset.id}
              viewMode={isViewMode}
              onSubmit={handlers.handleLaunchAsset}
              onReject={handlers.handleReject}
            />
          ) : activeTab === "apis" ? (
            <EditApiForm
              asset={selectedAsset}
              viewMode={isViewMode}
              onSave={handlers.handleSaveApi}
              onReject={handlers.handleReject}
            />
          ) : (
            <EditBudgetForm
              budget={selectedAsset}
              viewMode={isViewMode}
              onSave={handlers.handleSaveBudget}
            />
          )}
        </div>
      )}
    </Drawer>
  );
};

export default AssetLaunchPadDrawerOrchestrator;
