import { useState, useEffect, useCallback } from 'react';
import provisioningService from '../services/provisioningService';

const useProvisioning = () => {
    const [activeTab, setActiveTab] = useState('TPP');
    const [data, setData] = useState({
        TPP: [],
        Products: [],
        APIs: [],
        Customer: []
    });
    const [loading, setLoading] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [drawerMode, setDrawerMode] = useState('view'); // 'view', 'edit', 'create'

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            let result;
            switch (activeTab) {
                case 'TPP':
                    result = await provisioningService.getTPPs();
                    break;
                case 'Products':
                    result = await provisioningService.getProducts();
                    break;
                case 'APIs':
                    result = await provisioningService.getAPIs();
                    break;
                case 'Customer':
                    result = await provisioningService.getCustomers();
                    break;
                default:
                    result = { data: { items: [] } };
            }
            setData(prev => ({
                ...prev,
                [activeTab]: result.data.items || []
            }));
        } catch (error) {
            console.error("Error fetching provisioning data:", error);
        } finally {
            setLoading(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedItem(null); // Clear selection on tab change
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
        // Placeholder for saving logic
        console.log("Saving item:", formData, "Mode:", drawerMode);
        closeDrawer();
        await fetchData(); // Refresh data
    };

    return {
        activeTab,
        data: data[activeTab],
        loading,
        drawerOpen,
        selectedItem,
        drawerMode,
        handleTabChange,
        openDrawer,
        closeDrawer,
        saveItem
    };
};

export default useProvisioning;
