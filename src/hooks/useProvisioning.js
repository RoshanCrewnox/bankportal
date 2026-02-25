import { useState, useEffect, useCallback } from 'react';
import provisioningService from '../services/provisioningService';

const useProvisioning = () => {
    const [activeTab, setActiveTab] = useState('TPP');
    const [data, setData] = useState({
        TPP: { items: [], total: 0 },
        Products: { items: [], total: 0 },
        APIs: { items: JSON.parse(localStorage.getItem('PROVISIONED_APIS') || '[]'), total: 0 },
        Customer: { items: [], total: 0 }
    });
    const [currentPage, setCurrentPage] = useState({
        TPP: 1,
        Products: 1,
        APIs: 1,
        Customer: 1
    });
    const [loading, setLoading] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [drawerMode, setDrawerMode] = useState('view'); // 'view', 'edit', 'create'

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            let result;
            const page = currentPage[activeTab];
            switch (activeTab) {
                case 'TPP':
                    result = await provisioningService.getTPPs(page);
                    break;
                case 'Products':
                    result = await provisioningService.getProducts(page);
                    break;
                case 'APIs':
                    result = await provisioningService.getAPIs(page);
                    break;
                case 'Customer':
                    result = await provisioningService.getCustomers(page);
                    break;
                default:
                    result = { data: { items: [], total: 0 } };
            }
            setData(prev => {
                let items = result.data.items || [];
                // For APIs, the user specifically requested to show only created data from localStorage
                // But we might want to seed it with some mock data if it's empty
                if (activeTab === 'APIs') {
                    const localData = JSON.parse(localStorage.getItem('PROVISIONED_APIS') || '[]');
                    items = localData;
                }
                
                return {
                    ...prev,
                    [activeTab]: {
                        items: items,
                        total: result.data.total || items.length
                    }
                };
            });
        } catch (error) {
            console.error("Error fetching provisioning data:", error);
        } finally {
            setLoading(false);
        }
    }, [activeTab, currentPage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedItem(null); // Clear selection on tab change
    };

    const handlePageChange = (page) => {
        setCurrentPage(prev => ({
            ...prev,
            [activeTab]: page
        }));
    };

    const openDrawer = (item, mode = 'view') => {
        setSelectedItem(item);
        setDrawerMode(mode);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setSelectedItem(null);
        setDrawerMode('view');
        setDrawerOpen(false);
    };

    const saveItem = async (formData) => {
        setLoading(true);
        try {
            if (activeTab === 'APIs') {
                const localData = JSON.parse(localStorage.getItem('PROVISIONED_APIS') || '[]');
                const newProvisionedApi = {
                    ...formData,
                    id: formData.id || `PROV-${Date.now()}`,
                    onboardingDate: formData.onboardingDate || new Date().toISOString().split('T')[0],
                    api_status: 'LAUNCHED'
                };
                
                const index = localData.findIndex(item => item.id === newProvisionedApi.id);
                if (index !== -1) {
                    localData[index] = newProvisionedApi;
                } else {
                    localData.push(newProvisionedApi);
                }
                
                localStorage.setItem('PROVISIONED_APIS', JSON.stringify(localData));
            }
            
            console.log("Saving item:", formData, "Mode:", drawerMode);
            closeDrawer();
            await fetchData(); // Refresh data
        } catch (error) {
            console.error("Error saving provisioning item:", error);
        } finally {
            setLoading(false);
        }
    };

    return {
        activeTab,
        data: data[activeTab].items,
        totalItems: data[activeTab].total,
        currentPage: currentPage[activeTab],
        loading,
        drawerOpen,
        selectedItem,
        drawerMode,
        handleTabChange,
        handlePageChange,
        openDrawer,
        closeDrawer,
        saveItem
    };
};

export default useProvisioning;
