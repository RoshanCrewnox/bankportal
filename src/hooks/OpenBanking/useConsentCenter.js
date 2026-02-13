import { useState, useRef, useEffect } from 'react';
import { ledgerData } from '../../services/consentMockData';

export const useConsentCenter = () => {
    const [data, setData] = useState(ledgerData);
    const [mainTab, setMainTab] = useState('Ledger');
    const [openAccordion, setOpenAccordion] = useState(null);
    const [searchTPP, setSearchTPP] = useState('');
    const [searchCustomerID, setSearchCustomerID] = useState('');
    const [internalTabs, setInternalTabs] = useState({}); // { customerId: 'APIs' }
    
    // Consent Management State
    const [isConfigOpen, setIsConfigOpen] = useState(false);
    const [config, setConfig] = useState({
        duration: '90 Days',
        regions: 'UK, EU'
    });
    const [searchMngtCustomerID, setSearchMngtCustomerID] = useState('');
    const [openConfigDropdown, setOpenConfigDropdown] = useState(null); // 'duration' or 'regions'
    const [drawerState, setDrawerState] = useState({ isOpen: false, item: null });
    const popoverRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setIsConfigOpen(false);
                setOpenConfigDropdown(null);
            }
        };

        if (isConfigOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isConfigOpen]);

    const toggleAccordion = (id) => {
        setOpenAccordion(openAccordion === id ? null : id);
        if (!internalTabs[id]) {
            setInternalTabs(prev => ({ ...prev, [id]: 'APIs' }));
        }
    };

    const setInternalTab = (customerId, tab) => {
        setInternalTabs(prev => ({ ...prev, [customerId]: tab }));
    };

    const handleEnableSave = (formData) => {
        const { item } = drawerState;
        if (!item) return;

        setData(prevData => prevData.map(customer => ({
            ...customer,
            apis: customer.apis.map(api => api.name === item.name ? { ...api, consents: api.consents.map(c => ({...c, status: 'Active'})) } : api),
            products: customer.products.map(product => product.name === item.name ? { ...product, consents: product.consents.map(c => ({...c, status: 'Active'})) } : product),
            tpps: customer.tpps.map(tpp => tpp.name === item.name ? { ...tpp, consents: tpp.consents.map(c => ({...c, status: 'Active'})) } : tpp)
        })));

        setDrawerState({ isOpen: false, item: null });
    };

    const handleSaveConfig = () => {
        // Save logic here
        setIsConfigOpen(false);
    };

    const filteredLedger = data.filter(item => 
        item.customerId.toLowerCase().includes(searchCustomerID.toLowerCase()) &&
        (searchTPP === '' || item.apis.some(api => api.name.toLowerCase().includes(searchTPP.toLowerCase())) || 
         item.products.some(p => p.name.toLowerCase().includes(searchTPP.toLowerCase())))
    );

    const filteredManagement = data.filter(item => 
        item.customerId.toLowerCase().includes(searchMngtCustomerID.toLowerCase())
    );

    return {
        data,
        mainTab,
        setMainTab,
        openAccordion,
        toggleAccordion,
        searchTPP,
        setSearchTPP,
        searchCustomerID,
        setSearchCustomerID,
        internalTabs,
        setInternalTab,
        isConfigOpen,
        setIsConfigOpen,
        config,
        setConfig,
        searchMngtCustomerID,
        setSearchMngtCustomerID,
        openConfigDropdown,
        setOpenConfigDropdown,
        drawerState,
        setDrawerState,
        popoverRef,
        handleEnableSave,
        handleSaveConfig,
        filteredLedger,
        filteredManagement
    };
};
