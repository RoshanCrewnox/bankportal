import React, { useContext, useState } from 'react';
import { List, ArrowLeft } from 'lucide-react';
import { ThemeContext } from '../../components/common/ThemeContext';
import { useConsentCenter } from '../../hooks/OpenBanking/useConsentCenter';
import EnableDrawer from '../../components/OpenBanking/EnableDrawer';
import ConsentSummaryCards from '../../components/OpenBanking/Consent/ConsentSummaryCards';
import AuditTable from '../../components/OpenBanking/Consent/AuditTable';
import ConsentLedger from '../../components/OpenBanking/Consent/ConsentLedger';
import ConsentManagement from '../../components/OpenBanking/Consent/ConsentManagement';

const ConsentCenter = () => {
    const { theme } = useContext(ThemeContext);
    const isDark = theme === 'dark';
    const {
        mainTab, setMainTab,
        openAccordion, toggleAccordion,
        searchTPP, setSearchTPP,
        searchCustomerID, setSearchCustomerID,
        internalTabs, setInternalTab,
        isConfigOpen, setIsConfigOpen,
        config, setConfig,
        searchMngtCustomerID, setSearchMngtCustomerID,
        openConfigDropdown, setOpenConfigDropdown,
        drawerState, setDrawerState,
        popoverRef,
        handleEnableSave,
        handleSaveConfig,
        filteredLedger,
        filteredManagement,
        consentStats,
        auditLogs
    } = useConsentCenter();
    const [showLedger, setShowLedger] = useState(false);

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom duration-500 pb-20">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Consent Center</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Monitor and manage user-granted data sharing permissions across APIs and Products.</p>
                </div>
                <button 
                    onClick={() => setShowLedger(!showLedger)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-bold transition-all active:scale-95 ${
                        showLedger 
                        ? 'bg-primary-orange text-white border-primary-orange shadow-lg hover:brightness-110' 
                        : 'bg-white dark:bg-secondary-dark-bg border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-primary-orange hover:text-primary-orange shadow-sm'
                    }`}
                >
                    {showLedger ? <ArrowLeft size={14} /> : <List size={14} />}
                    {showLedger ? 'Back to Audit' : 'Consent Ledger'}
                </button>
            </div>

            {/* Summary Cards */}
            <ConsentSummaryCards stats={consentStats} isDark={isDark} />

            {showLedger ? (
                <ConsentLedger 
                    searchTPP={searchTPP}
                    setSearchTPP={setSearchTPP}
                    searchCustomerID={searchCustomerID}
                    setSearchCustomerID={setSearchCustomerID}
                    filteredLedger={filteredLedger}
                    openAccordion={openAccordion}
                    toggleAccordion={toggleAccordion}
                    internalTabs={internalTabs}
                    setInternalTab={setInternalTab}
                />
            ) : (
                <div className="space-y-6 animate-in fade-in duration-500">
                    <div className={`flex gap-1 p-1 rounded-lg ${theme === 'dark' ? 'bg-darkbg' : 'bg-gray-100'} w-fit`}>
                        {['Audit', 'Consent Mngts'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setMainTab(tab)}
                                className={`px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ${mainTab === tab ? 'bg-primary-orange text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 dark:bg-secondary-dark-bg'}`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {mainTab === 'Audit' ? (
                        <AuditTable auditLogs={auditLogs} isDark={isDark} />
                    ) : (
                        <ConsentManagement 
                            filteredManagement={filteredManagement}
                            openAccordion={openAccordion}
                            toggleAccordion={toggleAccordion}
                            internalTabs={internalTabs}
                            setInternalTab={setInternalTab}
                            isConfigOpen={isConfigOpen}
                            setIsConfigOpen={setIsConfigOpen}
                            config={config}
                            setConfig={setConfig}
                            searchMngtCustomerID={searchMngtCustomerID}
                            setSearchMngtCustomerID={setSearchMngtCustomerID}
                            openConfigDropdown={openConfigDropdown}
                            setOpenConfigDropdown={setOpenConfigDropdown}
                            popoverRef={popoverRef}
                            handleSaveConfig={handleSaveConfig}
                            setDrawerState={setDrawerState}
                        />
                    )}
                </div>
            )}
            <EnableDrawer isOpen={drawerState.isOpen} onClose={() => setDrawerState({ isOpen: false, item: null })} item={drawerState.item} onSave={handleEnableSave} />
        </div>
    );
};

export default ConsentCenter;
