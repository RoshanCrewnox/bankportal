import React, { useContext } from 'react';
import { Search, ChevronDown, ChevronUp, User, LayoutGrid, Cpu, Building2 } from 'lucide-react';
import { ThemeContext } from '../../components/common/ThemeContext';
import { useConsentCenter } from '../../hooks/OpenBanking/useConsentCenter';
import StatusBadge from '../../components/OpenBanking/StatusBadge';
import CustomSelect from '../../components/OpenBanking/CustomSelect';
import EnableDrawer from '../../components/OpenBanking/EnableDrawer';

const ConsentCenter = () => {
    const { theme } = useContext(ThemeContext);
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
        filteredManagement
    } = useConsentCenter();

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Consent Center</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Monitor and manage user-granted data sharing permissions across APIs and Products.</p>
            </div>

            {/* Main Tabs */}
            <div className={`flex gap-1 p-1 rounded-lg ${theme === 'dark' ? 'bg-darkbg' : 'bg-gray-100'} w-fit`}>
                {['Ledger', 'Consent Mngts'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setMainTab(tab)}
                        className={`px-6 py-2 text-sm font-medium rounded-md transition-all duration-200 ${mainTab === tab ? 'bg-primary-orange text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 dark:bg-secondary-dark-bg'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {mainTab === 'Ledger' ? (
                <div className="space-y-4">
                    <div className="flex justify-end gap-3">
                        <div className="relative w-64 group">
                            <input
                                type="text"
                                placeholder="Search by TPP"
                                value={searchTPP}
                                onChange={(e) => setSearchTPP(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-darkbg border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-primary-orange/50 focus:border-primary-orange outline-none transition-all dark:text-white"
                            />
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-orange transition-colors" />
                        </div>
                        <div className="relative w-64 group">
                            <input
                                type="text"
                                placeholder="Search by CustomerID"
                                value={searchCustomerID}
                                onChange={(e) => setSearchCustomerID(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-darkbg border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-primary-orange/50 focus:border-primary-orange outline-none transition-all dark:text-white"
                            />
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-orange transition-colors" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {filteredLedger.map((customer) => {
                            const isOpen = openAccordion === customer.customerId;
                            const activeInternalTab = internalTabs[customer.customerId] || 'APIs';
                            return (
                                <div key={customer.customerId} className={`border border-gray-200 dark:border-white/5 rounded-xl overflow-hidden transition-all ${isOpen ? 'ring-1 ring-primary-orange/30 shadow-lg' : 'hover:border-gray-300 dark:hover:border-white/10 shadow-sm'}`}>
                                    <div onClick={() => toggleAccordion(customer.customerId)} className={`flex items-center justify-between px-6 py-4 cursor-pointer transition-colors ${isOpen ? 'bg-primary-orange/5 dark:bg-primary-orange/5' : 'bg-white dark:bg-secondary-dark-bg hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${isOpen ? 'bg-primary-orange text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400'}`}>
                                                <User className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white">{customer.customerId}</h3>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">{customer.customerName}</p>
                                            </div>
                                        </div>
                                        {isOpen ? <ChevronUp className="w-5 h-5 text-primary-orange" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                    </div>
                                    {isOpen && (
                                        <div className="p-6 bg-white dark:bg-darkbg border-t border-gray-200 dark:border-white/10 space-y-8">
                                            <div className="space-y-4">
                                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                                                    <LayoutGrid className="w-3.5 h-3.5" /> Customer Details
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {['Email', 'Phone', 'Status'].map((f) => (
                                                        <div key={f} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                                            <p className="text-[9px] text-gray-500 uppercase font-bold mb-0.5">{f}</p>
                                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{customer.details[f.toLowerCase()]}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="flex border-b border-gray-100 dark:border-white/10">
                                                    {['APIs', 'Products'].map((tab) => (
                                                        <button key={tab} onClick={() => setInternalTab(customer.customerId, tab)} className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${activeInternalTab === tab ? 'border-primary-orange text-primary-orange' : 'border-transparent text-gray-400 hover:text-gray-300'}`}>{tab}</button>
                                                    ))}
                                                </div>
                                                <div className="space-y-8 pl-2">
                                                    {(activeInternalTab === 'APIs' ? customer.apis : customer.products).map((item, idx) => (
                                                        <div key={idx} className="space-y-4">
                                                            <div className="inline-flex items-center px-6 py-2 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 shadow-sm">
                                                                <span className="text-xs font-bold text-gray-700 dark:text-gray-300 tracking-wide uppercase">{item.name}</span>
                                                            </div>
                                                            <div className="space-y-2.5 pl-6">
                                                                {item.consents.map((consent, cIdx) => (
                                                                    <div key={cIdx} className="flex items-center gap-4 px-6 py-3 bg-white dark:bg-secondary-dark-bg border border-gray-100 dark:border-white/5 rounded-xl hover:border-primary-orange/30 hover:shadow-md transition-all group overflow-hidden relative">
                                                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-primary-orange transition-colors" />
                                                                        <div className="min-w-[100px] flex items-center"><StatusBadge status={consent.status} /></div>
                                                                        <div className="flex-1 flex items-center justify-between gap-4">
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-[10px] text-gray-400 uppercase font-black opacity-50">Who:</span>
                                                                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">{consent.granter}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <span className="text-[10px] text-gray-400 uppercase font-black opacity-50">When:</span>
                                                                                <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{consent.date}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-end gap-3 items-start relative">
                        <div className="relative">
                            <button onClick={() => setIsConfigOpen(!isConfigOpen)} className={`flex items-center gap-2 px-6 py-2 rounded-lg border text-sm font-bold transition-all ${isConfigOpen ? 'bg-primary-orange text-white border-primary-orange shadow-lg hover:brightness-110' : 'bg-primary-orange text-white border-primary-orange hover:brightness-110'}`}>Configuration</button>
                            {isConfigOpen && (
                                <div ref={popoverRef} className="absolute top-12 left-0 w-80 bg-white dark:bg-secondary-dark-bg border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl p-6 space-y-6 z-50 animate-in fade-in zoom-in duration-200">
                                    <div className="space-y-5">
                                        <CustomSelect label="Consent Duration" value={config.duration} isOpen={openConfigDropdown === 'duration'} onToggle={() => setOpenConfigDropdown(openConfigDropdown === 'duration' ? null : 'duration')} options={['30 Days', '60 Days', '90 Days', '180 Days', '1 Year']} onChange={(val) => setConfig({...config, duration: val})} />
                                        <CustomSelect label="Allowed Regions" value={config.regions} searchable={true} isOpen={openConfigDropdown === 'regions'} onToggle={() => setOpenConfigDropdown(openConfigDropdown === 'regions' ? null : 'regions')} options={['UK, EU', 'Global', 'APAC', 'North America', 'Middle East', 'South America', 'Africa', 'India', 'Southeast Asia']} onChange={(val) => setConfig({...config, regions: val})} />
                                    </div>
                                    <button onClick={handleSaveConfig} className="w-full py-3 bg-primary-orange text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-orange/20 hover:brightness-110 active:scale-[0.98] transition-all uppercase tracking-widest">Save Configuration</button>
                                </div>
                            )}
                        </div>
                        <div className="relative w-72 group">
                            <input type="text" placeholder="Search Bar - CustomerID" value={searchMngtCustomerID} onChange={(e) => setSearchMngtCustomerID(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white dark:bg-darkbg border border-gray-200 dark:border-white/10 rounded-lg text-sm focus:ring-2 focus:ring-primary-orange/50 focus:border-primary-orange outline-none transition-all dark:text-white shadow-sm" />
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary-orange transition-colors" />
                        </div>
                    </div>
                    <div className="space-y-3">
                        {filteredManagement.map((customer) => {
                            const isOpen = openAccordion === customer.customerId;
                            const activeInternalTab = internalTabs[customer.customerId] || 'APIs';
                            return (
                                <div key={customer.customerId} className={`border border-gray-200 dark:border-white/5 rounded-xl overflow-hidden transition-all ${isOpen ? 'ring-1 ring-primary-orange/30 shadow-lg' : 'hover:border-gray-300 dark:hover:border-white/10 shadow-sm'}`}>
                                    <div onClick={() => toggleAccordion(customer.customerId)} className={`flex items-center justify-between px-6 py-4 cursor-pointer transition-colors ${isOpen ? 'bg-primary-orange/5 dark:bg-primary-orange/5' : 'bg-white dark:bg-secondary-dark-bg hover:bg-gray-50 dark:hover:bg-white/5'}`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`p-2 rounded-lg ${isOpen ? 'bg-primary-orange text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400'}`}><User className="w-5 h-5" /></div>
                                            <div><h3 className="font-bold text-gray-900 dark:text-white">{customer.customerId}</h3><p className="text-xs text-gray-500 uppercase tracking-wide">{customer.customerName}</p></div>
                                        </div>
                                        {isOpen ? <ChevronUp className="w-5 h-5 text-primary-orange" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                                    </div>
                                    {isOpen && (
                                        <div className="p-6 bg-white dark:bg-darkbg border-t border-gray-200 dark:border-white/10 space-y-8">
                                            <div className="space-y-4">
                                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2 mb-2"><LayoutGrid className="w-3.5 h-3.5" /> Customer Details</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    {['Email', 'Phone', 'Status'].map((f) => (
                                                        <div key={f} className="px-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                                                            <p className="text-[9px] text-gray-500 uppercase font-bold mb-0.5">{f}</p>
                                                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{customer.details[f.toLowerCase()]}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="flex border-b border-gray-100 dark:border-white/10">
                                                    {['APIs', 'Products', 'TPP'].map((tab) => (
                                                        <button key={tab} onClick={() => setInternalTab(customer.customerId, tab)} className={`px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${activeInternalTab === tab ? 'border-primary-orange text-primary-orange' : 'border-transparent text-gray-400 hover:text-gray-300'}`}>{tab}</button>
                                                    ))}
                                                </div>
                                                <div className="space-y-8 pl-2">
                                                    {(activeInternalTab === 'APIs' ? customer.apis : activeInternalTab === 'Products' ? customer.products : customer.tpps).map((item, idx) => (
                                                        <div key={idx} className="space-y-4">
                                                            <div className="flex items-center justify-between gap-4">
                                                                <div className="inline-flex items-center px-6 py-2 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 shadow-sm"><span className="text-xs font-bold text-gray-700 dark:text-gray-300 tracking-wide uppercase">{item.name} Name and Details</span></div>
                                                                <button onClick={() => setDrawerState({ isOpen: true, item })} className="flex items-center gap-2 px-4 py-2 bg-primary-orange/10 text-primary-orange rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-primary-orange/20 transition-all border border-primary-orange/20 shadow-sm"><Cpu className="w-3.5 h-3.5" /> Enable Consent</button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            <EnableDrawer isOpen={drawerState.isOpen} onClose={() => setDrawerState({ isOpen: false, item: null })} item={drawerState.item} onSave={handleEnableSave} />
        </div>
    );
};

export default ConsentCenter;
