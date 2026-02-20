import { useState, useEffect, useCallback } from 'react';
import provisioningService from '../services/provisioningService';

const useProvisioning = () => {
    const [activeTab, setActiveTab] = useState('TPP');
    const [data, setData] = useState({
        TPP: { items: [], total: 0 },
        Products: { items: [], total: 0 },
        APIs: { items: [], total: 0 },
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
            setData(prev => ({
                ...prev,
                [activeTab]: {
                    items: result.data.items || [],
                    total: result.data.total || 0
                }
            }));
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
        // Placeholder for saving logic
        console.log("Saving item:", formData, "Mode:", drawerMode);
        closeDrawer();
        await fetchData(); // Refresh data
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
