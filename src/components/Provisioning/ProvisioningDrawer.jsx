import React, { useState } from 'react';

const EMPTY_OPTIONS = [];

const getOptionLabel = (options, value) => {
    if (!value) return 'N/A';
    const opt = options.find(o => (typeof o === 'object' ? o.value : o) === value);
    return typeof opt === 'object' ? opt.label : opt || value;
};

const ProvisioningField = ({ label, name, type = "text", options = EMPTY_OPTIONS, isViewMode, value, onChange }) => (
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
                className="w-full px-3 py-2 bg-white dark:bg-darkbg border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-orange/50 focus:border-primary-orange outline-none"
            >
                <option value="">Select {label}</option>
                {options.map(opt => {
                    const isObject = typeof opt === 'object';
                    const val = isObject ? opt.value : opt;
                    const lbl = isObject ? opt.label : opt;
                    return <option key={val} value={val}>{lbl}</option>;
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const aispOptions = [
        { label: "AISP (Account Information Service Provider)", value: "AISP" },
        { label: "PISP (Payment Initiation Service Provider)", value: "PISP" },
        { label: "Both (AISP & PISP)", value: "Both" }
    ];

    const regionOptions = ["UK", "EU", "US", "Asia", "Global"];

    return (
        <div className="p-6 space-y-6">
            <div className="space-y-4">
                {activeTab === 'TPP' && (
                    <>
                        <ProvisioningField label="Org Name" name="name" isViewMode={isViewMode} value={formData.name} onChange={handleChange} />
                        <ProvisioningField label="Org Type" name="type" type="select" options={aispOptions} isViewMode={isViewMode} value={formData.type} onChange={handleChange} />
                        <ProvisioningField label="Region" name="region" type="select" options={regionOptions} isViewMode={isViewMode} value={formData.region} onChange={handleChange} />
                        <ProvisioningField label="Open Banking Type" name="openBankingType" type="select" options={aispOptions} isViewMode={isViewMode} value={formData.openBankingType} onChange={handleChange} />
                    </>
                )}

                {activeTab === 'Products' && (
                    <>
                        <ProvisioningField label="Product Name" name="name" isViewMode={isViewMode} value={formData.name} onChange={handleChange} />
                        <ProvisioningField label="Product Type" name="type" isViewMode={isViewMode} value={formData.type} onChange={handleChange} />
                        <ProvisioningField label="Sandbox" name="sandbox" type="select" options={["Enabled", "Disabled"]} isViewMode={isViewMode} value={formData.sandbox} onChange={handleChange} />
                        <ProvisioningField label="Exposure" name="exposure" type="select" options={["Public", "Internal", "Partner"]} isViewMode={isViewMode} value={formData.exposure} onChange={handleChange} />
                    </>
                )}

                {activeTab === 'APIs' && (
                    <>
                        <ProvisioningField label="API Name" name="name" isViewMode={isViewMode} value={formData.name} onChange={handleChange} />
                        <ProvisioningField label="API Type" name="type" isViewMode={isViewMode} value={formData.type} onChange={handleChange} />
                        <ProvisioningField label="Sandbox" name="sandbox" type="select" options={["Enabled", "Disabled"]} isViewMode={isViewMode} value={formData.sandbox} onChange={handleChange} />
                        <ProvisioningField label="Exposure" name="exposure" type="select" options={["Public", "Partner", "Internal"]} isViewMode={isViewMode} value={formData.exposure} onChange={handleChange} />
                    </>
                )}
                 {activeTab === 'Customer' && (
                    <>
                        <ProvisioningField label="Customer Name" name="name" isViewMode={isViewMode} value={formData.name} onChange={handleChange} />
                        <ProvisioningField label="Customer Type" name="type" isViewMode={isViewMode} value={formData.type} onChange={handleChange} />
                        <ProvisioningField label="Region" name="region" type="select" options={regionOptions} isViewMode={isViewMode} value={formData.region} onChange={handleChange} />
                        <ProvisioningField label="Exposure" name="exposure" type="select" options={["Public", "Partner", "Internal"]} isViewMode={isViewMode} value={formData.exposure} onChange={handleChange} />
                    </>
                )}
            </div>

            {!isViewMode && (
                <div className="pt-6">
                    <button 
                        onClick={() => onSave(formData)}
                        className="bg-primary-orange text-white px-4 py-2 rounded-lg hover:bg-primary-orange/90 w-full font-medium shadow-lg shadow-primary-orange/20"
                    >
                         {isCreateMode ? 'Onboard' : 'Save Changes'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProvisioningDrawer;
