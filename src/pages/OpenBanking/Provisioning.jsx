import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import useProvisioning from '../../hooks/useProvisioning';
import ProvisioningTabs from '../../components/Provisioning/ProvisioningTabs';
import ProvisioningTable from '../../components/Provisioning/ProvisioningTable';
import ProvisioningDrawer from '../../components/Provisioning/ProvisioningDrawer';
import Drawer from '../../components/common/Drawer';

const Provisioning = () => {
  const navigate = useNavigate();
  const {
    activeTab,
    data,
    loading,
    drawerOpen,
    selectedItem,
    drawerMode,
    handleTabChange,
    openDrawer,
    closeDrawer,
    saveItem,
  } = useProvisioning();

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Provisioning Management</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage TPP access and API provisioning for Open Banking.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <ProvisioningTabs activeTab={activeTab} onTabChange={handleTabChange} />
             
             <div className="flex flex-1 justify-end items-center gap-3">
                 <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                    type="text" 
                    placeholder={`Search ${activeTab}...`}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-primary-orange/20 focus:border-primary-orange outline-none transition-all dark:text-white"
                    />
                </div>
                 <div className="flex items-center gap-3">
                    {activeTab === 'TPP' && (
                        <button 
                            onClick={() => navigate('/open-banking/tpp-onboarding')}
                            className="flex items-center gap-2 bg-[#f8f9fa] dark:bg-white/5 hover:bg-[#eff1f3] dark:hover:bg-white/10 text-gray-700 dark:text-white px-4 py-2 rounded-lg font-bold border border-gray-200 dark:border-white/10 transition-all whitespace-nowrap"
                        >
                            <Plus className="w-4 h-4 text-primary-orange" />
                            Onboard TPP
                        </button>
                    )}
                    <button 
                        onClick={() => openDrawer(null, 'create')}
                        className="flex items-center gap-2 bg-primary-orange hover:bg-primary-orange/90 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg shadow-primary-orange/20 whitespace-nowrap"
                    >
                        <Plus className="w-4 h-4" />
                        Add {activeTab === "TPP" ? "TPP" : activeTab === "Products" ? "Product" : activeTab === "APIs" ? "API" : "Customer"}
                    </button>
                 </div>
             </div>
        </div>

        <div className="overflow-hidden p-4">
            {loading ? (
                <div className="py-20 text-center text-gray-500">Loading...</div>
            ) : (
                <ProvisioningTable 
                    data={data} 
                    activeTab={activeTab} 
                    onView={(item) => openDrawer(item, 'view')}
                    onEdit={(item) => openDrawer(item, 'edit')} 
                />
            )}
        </div>
      </div>

      <Drawer 
        isOpen={drawerOpen} 
        onClose={closeDrawer} 
        title={`${drawerMode === 'create' ? 'Onboard New' : drawerMode === 'edit' ? 'Edit' : 'View'} ${activeTab}`}
        width="600px"
      >
        <ProvisioningDrawer 
            item={selectedItem} 
            activeTab={activeTab} 
            mode={drawerMode}
            onSave={saveItem}
        />
      </Drawer>
    </div>
  );
};

export default Provisioning;
