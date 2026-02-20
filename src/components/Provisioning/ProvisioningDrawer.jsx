import React, { useState, useEffect } from 'react';
import partnerService from '../../services/partnerService';
import provisioningService from '../../services/provisioningService';

const EMPTY_OPTIONS = [];

const getOptionLabel = (options, value) => {
    if (!value) return 'N/A';
    const opt = options.find(o => (typeof o === 'object' ? o.value : o) === value);
    return typeof opt === 'object' ? opt.label : opt || value;
};

const ProvisioningField = ({ label, name, type = "text", options = EMPTY_OPTIONS, isViewMode, value, onChange, loading = false }) => (
    <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
            {label}
        </label>
        {isViewMode ? (
            <div className="text-gray-900 dark:text-white font-medium p-2 bg-gray-50 dark:bg-white/5 rounded-md border border-transparent">
                {type === "select" ? getOptionLabel(options, value) : (value || 'N/A')}
            </div>
        ) : type === "select" ? (
            <select
                name={name}
                value={value || ''}
                onChange={onChange}
                disabled={loading}
                className="w-full px-3 py-2 bg-white dark:bg-darkbg border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-orange/50 focus:border-primary-orange outline-none disabled:opacity-50"
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
                className="w-full px-3 py-2 bg-white dark:bg-darkbg border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-orange/50 focus:border-primary-orange outline-none"
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
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

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
                            label="Org name" 
                            name="name" 
                            type="select"
                            options={orgOptions}
                            loading={loadingData}
                            isViewMode={isViewMode} 
                            value={formData.name} 
                            onChange={handleChange} 
                        />
                        <ProvisioningField label="Org type" name="type" type="select" options={aispOptions} isViewMode={isViewMode} value={formData.type} onChange={handleChange} />
                        <ProvisioningField label="Region" name="region" type="select" options={regionOptions} isViewMode={isViewMode} value={formData.region} onChange={handleChange} />
                        <ProvisioningField label="Open banking type" name="openBankingType" type="select" options={aispOptions} isViewMode={isViewMode} value={formData.openBankingType} onChange={handleChange} />
                    </>
                )}

                {activeTab === 'Products' && (
                    <>
                        <ProvisioningField 
                            label="Product name" 
                            name="name" 
                            type="select"
                            options={productOptions}
                            loading={loadingData}
                            isViewMode={isViewMode} 
                            value={formData.name} 
                            onChange={handleChange} 
                        />
                        <ProvisioningField label="Product type" name="type" isViewMode={isViewMode} value={formData.type} onChange={handleChange} />
                        <ProvisioningField label="Exposure" name="exposure" type="select" options={["Public", "Internal", "Partner"]} isViewMode={isViewMode} value={formData.exposure} onChange={handleChange} />
                    </>
                )}

                {activeTab === 'APIs' && (
                    <>
                        <ProvisioningField label="API name" name="name" isViewMode={isViewMode} value={formData.name} onChange={handleChange} />
                        <ProvisioningField label="API type" name="type" isViewMode={isViewMode} value={formData.type} onChange={handleChange} />
                        <ProvisioningField label="Exposure" name="exposure" type="select" options={["Public", "Partner", "Internal"]} isViewMode={isViewMode} value={formData.exposure} onChange={handleChange} />
                    </>
                )}
                 {activeTab === 'Customer' && (
                    <>
                        <ProvisioningField label="Customer name" name="name" isViewMode={isViewMode} value={formData.name} onChange={handleChange} />
                        <ProvisioningField label="Customer type" name="type" isViewMode={isViewMode} value={formData.type} onChange={handleChange} />
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
                         {isCreateMode ? 'Onboard' : 'Save Changes'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProvisioningDrawer;
