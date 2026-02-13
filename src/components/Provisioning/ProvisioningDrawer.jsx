import React, { useState, useEffect } from 'react';

const ProvisioningDrawer = ({ item, activeTab, mode = 'view', onSave }) => {
    const isViewMode = mode === 'view';
    const isCreateMode = mode === 'create';
    
    // Initial state based on item (edit/view) or empty (create)
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (item) {
            setFormData(item);
        } else {
            // Defaults for create mode
            setFormData({});
        }
    }, [item]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const getOptionLabel = (options, value) => {
        if (!value) return 'N/A';
        const opt = options.find(o => (typeof o === 'object' ? o.value : o) === value);
        return typeof opt === 'object' ? opt.label : opt || value;
    };

    const renderField = (label, name, type = "text", options = []) => (
        <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {label}
            </label>
            {isViewMode ? (
                <div className="text-gray-900 dark:text-white font-medium p-2 bg-gray-50 dark:bg-white/5 rounded-md border border-transparent">
                    {type === "select" ? getOptionLabel(options, formData[name]) : (formData[name] || 'N/A')}
                </div>
            ) : type === "select" ? (
                <select
                    name={name}
                    value={formData[name] || ''}
                    onChange={handleChange}
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
                    value={formData[name] || ''}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white dark:bg-darkbg border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-orange/50 focus:border-primary-orange outline-none"
                />
            )}
        </div>
    );

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
                        {renderField("Org Name", "name")}
                        {renderField("Org Type", "type", "select", aispOptions)}
                        {renderField("Region", "region", "select", regionOptions)}
                        {renderField("Open Banking Type", "openBankingType", "select", aispOptions)}
                    </>
                )}

                {activeTab === 'Products' && (
                    <>
                        {renderField("Product Name", "name")}
                        {renderField("Product Type", "type")}
                        {renderField("Sandbox", "sandbox", "select", ["Enabled", "Disabled"])}
                        {renderField("Exposure", "exposure", "select", ["Public", "Internal", "Partner"])}
                    </>
                )}

                {activeTab === 'APIs' && (
                    <>
                        {renderField("API Name", "name")}
                        {renderField("API Type", "type")}
                        {renderField("Sandbox", "sandbox", "select", ["Enabled", "Disabled"])}
                        {renderField("Exposure", "exposure", "select", ["Public", "Partner", "Internal"])}
                    </>
                )}
                 {activeTab === 'Customer' && (
                    <>
                        {renderField("Customer Name", "name")}
                        {renderField("Customer Type", "type")}
                        {renderField("Region", "region", "select", regionOptions)}
                        {renderField("Exposure", "exposure", "select", ["Public", "Partner", "Internal"])}
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
