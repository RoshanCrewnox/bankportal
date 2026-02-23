import React, { useState, useEffect } from 'react';
import { Check, Search } from 'lucide-react';
import partnerService from '../../services/partnerService';
import provisioningService from '../../services/provisioningService';
import MultiSelectDropdown from '../SchemaRegistry/FieldsRegistry/MultiSelectDropdown';

const DOMAIN_OPTIONS = [
    { label: "BFSI", value: "BFSI" },
    { label: "Telcom", value: "Telcom" },
    { label: "Utilities", value: "Utilities" },
    { label: "Retail", value: "Retail" },
    { label: "Oil&Gas", value: "Oil&Gas" },
    { label: "Healthcare", value: "Healthcare" },
    { label: "Lifescience", value: "Lifescience" }
];

const SUBDOMAIN_OPTIONS = [
    "Investments", "Insurance", "Pensions", "Loans", "Credit cards", 
    "Wealth management", "BNPL", "Utility bills", "Telco payments", "Crypto"
];

const CDM_MAPPING = {
    "Full": "CDM-DEFAULT-MAX",
    "Partial": "CDM-DEFAULT-MID",
    "Limited": "CDM-DEFAULT-MIN",
    "Trial": "CDM-DEFAULT-TRIAL"
};

const EMPTY_OPTIONS = [];

const getOptionLabel = (options, value) => {
    if (!value) return 'N/A';
    if (Array.isArray(value)) return value.join(', ');
    const opt = options.find(o => (typeof o === 'object' ? o.value : o) === value);
    return typeof opt === 'object' ? opt.label : opt || value;
};

const ProvisioningField = ({ label, name, type = "text", options = EMPTY_OPTIONS, isViewMode, value, onChange, onToggle, loading = false, placeholder = "", isDark = true }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {label}
        </label>
        {isViewMode ? (
            <div className="text-gray-900 dark:text-white font-medium p-2 bg-gray-50 dark:bg-white/5 rounded-md border border-transparent min-h-[40px]">
                {type === "select" ? getOptionLabel(options, value) : (Array.isArray(value) ? value.join(', ') : (value || 'N/A'))}
            </div>
        ) : type === "multi-select" ? (
            <MultiSelectDropdown 
                options={options} 
                selected={value || []} 
                onToggle={(val) => onToggle(name, val)} 
                isDark={isDark} 
                placeholder={placeholder || `Select ${label}...`} 
            />
        ) : type === "select" ? (
            <select
                name={name}
                value={value || ''}
                onChange={onChange}
                disabled={loading}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-orange/50 focus:border-primary-orange outline-none disabled:opacity-50"
            >
                <option value="">{loading ? `Loading ${label}...` : `Select ${label}`}</option>
                {options.map((opt, idx) => {
                    const isObject = typeof opt === 'object';
                    const val = isObject ? opt.value : opt;
                    const lbl = isObject ? opt.label : opt;
                    return <option key={`${val}-${idx}`} value={val}>{lbl}</option>;
                })}
            </select>
        ) : (
            <input
                type={type}
                name={name}
                value={value || ''}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-orange/50 focus:border-primary-orange outline-none"
            />
        )}
    </div>
);

const ProvisioningDrawer = ({ item, activeTab, mode = 'view', onSave }) => {
    const isViewMode = mode === 'view';
    const isCreateMode = mode === 'create';
    
    const [formData, setFormData] = useState(item || {});
    const [partnerOrgs, setPartnerOrgs] = useState([]);
    const [products, setProducts] = useState([]);
    const [bankCustomers, setBankCustomers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        if (isViewMode) return;

        const fetchData = async () => {
            setLoadingData(true);
            try {
                if (activeTab === 'TPP') {
                    const data = await partnerService.getPartnerOrgs();
                    setPartnerOrgs(data || []);
                } else if (activeTab === 'Products') {
                    const response = await provisioningService.getProducts();
                    setProducts(response.data?.items || []);
                } else if (activeTab === 'Customer' && mode === 'bulk-onboard') {
                    const response = await provisioningService.getBankCustomers();
                    setBankCustomers(response.data || []);
                    // Initialize batch settings if not present
                    if (!formData.region) setFormData(prev => ({ ...prev, region: 'UK', exposure: 'Public' }));
                }
            } catch (error) {
                console.error(`Error fetching data for ${activeTab} drawer:`, error);
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, [activeTab, isViewMode]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newVal = type === 'checkbox' ? checked : value;
        
        // Auto-mapping for CDMID based on Access name if Scope is OF or Both
        if (name === 'access' && (formData.scope === 'OF' || formData.scope === 'Both')) {
            setFormData({ 
                ...formData, 
                [name]: newVal,
                cdmid: CDM_MAPPING[newVal] || formData.cdmid 
            });
        } else {
            setFormData({ ...formData, [name]: newVal });
        }
    };

    const handleToggle = (name, val) => {
        const current = formData[name] || [];
        const updated = current.includes(val)
            ? current.filter(i => i !== val)
            : [...current, val];
        setFormData({ ...formData, [name]: updated });
    };

    const filteredCustomers = bankCustomers.filter(c => 
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const aispOptions = [
        { label: "AISP (Account Information Service Provider)", value: "AISP" },
        { label: "PISP (Payment Initiation Service Provider)", value: "PISP" },
        { label: "Both (AISP & PISP)", value: "Both" }
    ];

    const regionOptions = ["UK", "EU", "US", "Asia", "Global"];
    
    const orgOptions = partnerOrgs.map(org => ({
        label: org.name,
        value: org.name
    }));

    const productOptions = products.map(prod => ({
        label: prod.name,
        value: prod.name
    }));

    return (
        <div className="p-6 space-y-6">
            <div className="space-y-4">
                {activeTab === 'TPP' && (
                    <>
                        <ProvisioningField 
                            label="TPP Name (Org Name)" 
                            name="name" 
                            type="select"
                            options={orgOptions}
                            loading={loadingData}
                            isViewMode={isViewMode} 
                            value={formData.name} 
                            onChange={handleChange} 
                        />
                        <ProvisioningField 
                            label="TPP Scope" 
                            name="scope" 
                            type="select" 
                            options={[
                                { label: "Open Banking", value: "Open Banking" },
                                { label: "Open Finance", value: "Open Finance" }
                            ]} 
                            isViewMode={isViewMode} 
                            value={formData.scope || 'Open Banking'} 
                            onChange={(e) => {
                                const newScope = e.target.value;
                                setFormData({
                                    ...formData,
                                    scope: newScope,
                                    type: newScope === 'Open Banking' ? 'AISP' : 'FIU'
                                });
                            }} 
                        />
                        <ProvisioningField 
                            label="TPP Type" 
                            name="type" 
                            type="select" 
                            options={formData.scope === 'Open Finance' ? [
                                { label: "Financial Information User (FIU)", value: "FIU" },
                                { label: "Financial Information Provider (FIP)", value: "FIP" },
                                { label: "Consent Central Manager (CCM)", value: "CCM" },
                                { label: "Account Aggregator (AA)", value: "AA" },
                                { label: "FIS (Loan)", value: "FIS_Loan" },
                                { label: "FIS (Investment)", value: "FIS_Investment" },
                                { label: "FIS (Insurance)", value: "FIS_Insurance" }
                            ] : aispOptions} 
                            isViewMode={isViewMode} 
                            value={formData.type} 
                            onChange={handleChange} 
                        />
                        <ProvisioningField 
                            label="Email" 
                            name="email" 
                            type="email"
                            placeholder="admin@company.com"
                            isViewMode={isViewMode} 
                            value={formData.email} 
                            onChange={handleChange} 
                        />
                        <ProvisioningField 
                            label="Onboarding Date" 
                            name="onboardingType" 
                            type="select" 
                            options={[
                                { label: "Immediate (Now)", value: "immediate" },
                                { label: "Schedule Later", value: "schedule" }
                            ]} 
                            isViewMode={isViewMode} 
                            value={formData.onboardingType || 'immediate'} 
                            onChange={handleChange} 
                        />
                        {formData.onboardingType === 'schedule' && (
                            <ProvisioningField 
                                label="Schedule Date" 
                                name="onboardingDate" 
                                type="date"
                                isViewMode={isViewMode} 
                                value={formData.onboardingDate} 
                                onChange={handleChange} 
                            />
                        )}
                    </>
                )}

                {activeTab === 'Products' && (
                    <>
                        <ProvisioningField 
                            label="Product Name" 
                            name="product_name" 
                            type="select"
                            options={productOptions}
                            loading={loadingData}
                            isViewMode={isViewMode} 
                            value={formData.product_name} 
                            onChange={handleChange} 
                        />
                        <ProvisioningField 
                            label="Scope" 
                            name="scope" 
                            type="select"
                            options={[
                                { label: "Open Banking (OB)", value: "OB" },
                                { label: "Open Finance (OF)", value: "OF" },
                                { label: "Both", value: "Both" }
                            ]}
                            isViewMode={isViewMode} 
                            value={formData.scope} 
                            onChange={handleChange} 
                        />
                        <ProvisioningField 
                            label="Domain" 
                            name="domain" 
                            type="select"
                            options={DOMAIN_OPTIONS}
                            isViewMode={isViewMode} 
                            value={formData.domain} 
                            onChange={handleChange} 
                        />
                        <ProvisioningField 
                            label="Subdomain" 
                            name="subdomain" 
                            type="multi-select"
                            options={SUBDOMAIN_OPTIONS}
                            isViewMode={isViewMode} 
                            value={formData.subdomain} 
                            onToggle={handleToggle} 
                            placeholder="Select subdomains..."
                        />
                        <ProvisioningField 
                            label="Access" 
                            name="access" 
                            type="select"
                            options={["Full", "Partial", "Limited", "Trial"]}
                            isViewMode={isViewMode} 
                            value={formData.access} 
                            onChange={handleChange} 
                        />
                        <ProvisioningField 
                            label="Onboarding Type" 
                            name="onboardingType" 
                            type="select"
                            options={[
                                { label: "Immediate (Now)", value: "immediate" },
                                { label: "Schedule Later", value: "schedule" }
                            ]} 
                            isViewMode={isViewMode} 
                            value={formData.onboardingType || 'immediate'} 
                            onChange={handleChange} 
                        />
                        {formData.onboardingType === 'schedule' && (
                            <ProvisioningField 
                                label="Schedule Date" 
                                name="onboardingDate" 
                                type="date"
                                isViewMode={isViewMode} 
                                value={formData.onboardingDate} 
                                onChange={handleChange} 
                            />
                        )}
                    </>
                )}

                {activeTab === 'APIs' && (
                    <>
                        <ProvisioningField 
                            label="API Name" 
                            name="api_name" 
                            placeholder="e.g. Payments API v1" 
                            isViewMode={isViewMode} 
                            value={formData.api_name || formData.name} 
                            onChange={handleChange} 
                        />
                        <ProvisioningField 
                            label="Scope" 
                            name="scope" 
                            type="select"
                            options={["OB", "OF", "Both"]}
                            isViewMode={isViewMode} 
                            value={formData.scope} 
                            onChange={handleChange} 
                        />
                        <ProvisioningField 
                            label="Onboarding Type" 
                            name="onboardingType" 
                            type="select"
                            options={[
                                { label: "Immediate (Now)", value: "immediate" },
                                { label: "Schedule Later", value: "schedule" }
                            ]} 
                            isViewMode={isViewMode} 
                            value={formData.onboardingType || 'immediate'} 
                            onChange={handleChange} 
                        />
                        {formData.onboardingType === 'schedule' && (
                            <ProvisioningField 
                                label="Schedule Date" 
                                name="onboardingDate" 
                                type="date"
                                isViewMode={isViewMode} 
                                value={formData.onboardingDate} 
                                onChange={handleChange} 
                            />
                        )}
                        <ProvisioningField 
                            label="Domain" 
                            name="domain" 
                            type="select"
                            options={DOMAIN_OPTIONS}
                            isViewMode={isViewMode} 
                            value={formData.domain} 
                            onChange={handleChange} 
                        />
                        <ProvisioningField 
                            label="Access" 
                            name="access" 
                            type="select" 
                            options={["Full", "Partial", "Limited", "Trial"]} 
                            isViewMode={isViewMode} 
                            value={formData.access} 
                            onChange={handleChange} 
                        />
                        {(formData.scope === 'OF' || formData.scope === 'Both') && (
                            <ProvisioningField 
                                label="CDMID" 
                                name="cdmid" 
                                placeholder="e.g. CDM-882" 
                                isViewMode={isViewMode} 
                                value={formData.cdmid} 
                                onChange={handleChange} 
                            />
                        )}
                        <div className="flex items-center gap-2 mt-2">
                             <input 
                                type="checkbox" 
                                name="strictSchemaValidation" 
                                id="strictSchemaValidation"
                                checked={formData.strictSchemaValidation || false}
                                onChange={handleChange}
                                disabled={isViewMode}
                                className="w-4 h-4 rounded text-primary-orange accent-primary-orange border-white/10"
                             />
                             <label htmlFor="strictSchemaValidation" className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Schema Validation - Strict
                             </label>
                        </div>
                    </>
                )}
                {activeTab === 'Customer' && mode === 'bulk-onboard' && (
                    <div className="space-y-6">
                        {/* Batch Settings Section */}
                        <div className="p-4 bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl space-y-4">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary-orange" />
                                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Batch Settings</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <ProvisioningField 
                                    label="Region" 
                                    name="region" 
                                    type="select" 
                                    options={regionOptions} 
                                    isViewMode={isViewMode} 
                                    value={formData.region} 
                                    onChange={handleChange} 
                                />
                                <ProvisioningField 
                                    label="Exposure" 
                                    name="exposure" 
                                    type="select" 
                                    options={["Public", "Partner", "Internal"]} 
                                    isViewMode={isViewMode} 
                                    value={formData.exposure} 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>

                        {/* Customer Selection Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200 uppercase tracking-tight">Select Customers</h3>
                                <button 
                                    onClick={() => {
                                        const allIds = filteredCustomers.map(c => c.id);
                                        const currentSelected = formData.selectedCustomers || [];
                                        const isAllSelected = allIds.length > 0 && allIds.every(id => currentSelected.includes(id));
                                        
                                        let updatedSelected;
                                        if (isAllSelected) {
                                            // Deselect only the filtered ones
                                            updatedSelected = currentSelected.filter(id => !allIds.includes(id));
                                        } else {
                                            // Add all filtered ones (avoid duplicates)
                                            updatedSelected = [...new Set([...currentSelected, ...allIds])];
                                        }
                                        setFormData({ ...formData, selectedCustomers: updatedSelected });
                                    }}
                                    className="text-xs font-bold text-primary-orange hover:text-primary-orange/80 transition-colors"
                                >
                                    {filteredCustomers.length > 0 && filteredCustomers.every(c => (formData.selectedCustomers || []).includes(c.id)) ? 'Deselect All' : 'Select All Filtered'}
                                </button>
                            </div>

                            {/* Search Bar */}
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text"
                                    placeholder="Search by name, email or type..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-darkbg border border-gray-200 dark:border-white/10 rounded-xl text-sm focus:ring-2 focus:ring-primary-orange/20 focus:border-primary-orange outline-none transition-all dark:text-white"
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {loadingData ? (
                                    <div className="text-center py-10 text-gray-500 italic">Fetching bank customers...</div>
                                ) : filteredCustomers.length === 0 ? (
                                    <div className="text-center py-10 text-gray-400 text-sm">No customers found matching "{searchTerm}"</div>
                                ) : filteredCustomers.map((customer) => {
                                    const isSelected = (formData.selectedCustomers || []).includes(customer.id);
                                    return (
                                        <div 
                                            key={customer.id} 
                                            onClick={() => handleToggle('selectedCustomers', customer.id)}
                                            className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between group ${
                                                isSelected 
                                                    ? 'bg-primary-orange/10 border-primary-orange shadow-lg shadow-primary-orange/5' 
                                                    : 'bg-gray-50/50 dark:bg-white/5 border-gray-100 dark:border-white/5 hover:border-primary-orange/30'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                                                    isSelected ? 'bg-primary-orange text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-500'
                                                }`}>
                                                    {customer.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="font-bold text-sm dark:text-white">{customer.name}</div>
                                                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${
                                                            customer.type === 'Corporate' ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' :
                                                            customer.type === 'SME' ? 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400' :
                                                            'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                                                        }`}>
                                                            {customer.type}
                                                        </span>
                                                    </div>
                                                    <div className="text-[10px] text-gray-400 font-medium">{customer.email}</div>
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                                isSelected ? 'bg-primary-orange border-primary-orange' : 'border-gray-300 dark:border-white/10'
                                            }`}>
                                                {isSelected && <Check size={14} className="text-white stroke-[3px]" />}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        
                        {(formData.selectedCustomers || []).length > 0 && (
                            <div className="p-4 bg-primary-orange/5 border border-primary-orange/20 rounded-2xl animate-in fade-in slide-in-from-bottom-2">
                                <p className="text-xs font-bold text-primary-orange text-center uppercase tracking-wider">
                                    {(formData.selectedCustomers || []).length} Customers selected for onboarding
                                </p>
                            </div>
                        )}
                    </div>
                )}
                 {activeTab === 'Customer' && mode !== 'bulk-onboard' && (
                    <>
                        <ProvisioningField label="Customer name" name="name" placeholder="e.g. Acme Corp" isViewMode={isViewMode} value={formData.name} onChange={handleChange} />
                        <ProvisioningField label="Customer type" name="type" placeholder="e.g. Individual" isViewMode={isViewMode} value={formData.type} onChange={handleChange} />
                        <ProvisioningField label="Region" name="region" type="select" options={regionOptions} isViewMode={isViewMode} value={formData.region} onChange={handleChange} />
                        <ProvisioningField label="Exposure" name="exposure" type="select" options={["Public", "Partner", "Internal"]} isViewMode={isViewMode} value={formData.exposure} onChange={handleChange} />
                    </>
                )}
            </div>

            {!isViewMode && (
                <div className="pt-6">
                    <button 
                        onClick={() => onSave(formData)}
                        className="bg-primary-orange text-white px-6 py-3 rounded-lg hover:bg-primary-orange/90 w-full font-semibold shadow-lg shadow-primary-orange/20 transition-all active:scale-95"
                    >
                         {(isCreateMode || mode === 'bulk-onboard') ? 'Onboard' : 'Save Changes'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProvisioningDrawer;
