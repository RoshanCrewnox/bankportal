import React, { useState, useEffect } from 'react';
import services from '../../../services';
import { formatStatus } from '../../../utils/formatStatus';

const policyDetailsMap = {
    'OAUTH': { name: 'OAuth 2.0', description: 'Authenticate using an external organization-wide OAuth server with password, Authorization Code, or Implicit grant Types.' },
    'JWT': { name: 'JWT Native', description: 'Provide your authentication details provided by you by the product enabling to use the Client Credentials grant type.' },
    'AUTHENTICATION': { name: 'Authentication', description: 'Use a username and password to securely access your endpoint via Basic Authentication.' },
    'X-SIGNATURE': { name: 'Key Signature Verification', description: 'Server validates this signature using the selected hashing (MD5, SHA256, etc.) to ensure authenticity and prevent attacks.' },
    'CORS': { name: 'CORS', description: 'Cross-Origin Resource Sharing (CORS) is a mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served.' },
    'IP_CONFIG': { name: 'IP Config', description: 'IP filtering allows you to control which IP addresses can access your APIs.' },
};

const EditProductForm = ({ formData, productId, onSubmit, onReject, viewMode = false }) => {
    const [viewProductData, setViewProductData] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        services.product.FETCH_PRODUCT_CATEGORY_LIST()
            .then(response => {
                setCategories(response.data.product_categories || []);
            })
            .catch(error => {
                console.error("Failed to fetch product categories:", error);
            });

        if (productId) {
            services.product.FETCH_PRODUCT_DETAILS(productId)
                .then(response => {
                    const product = response.data;

                    const securityPolicies = [];
                    if (product.auth_policy && policyDetailsMap[product.auth_policy]) {
                        securityPolicies.push(policyDetailsMap[product.auth_policy]);
                    }

                    if (product.enable_xsignature_policy || product.enable_x_signature) {
                        const sigPolicy = { ...policyDetailsMap['X-SIGNATURE'] };
                        sigPolicy.formData = {
                            hashing: product.x_signature_hashing || product.xsignature_hashing_algo || 'Not set',
                            ttl: product.x_signature_ttl || product.xsignature_ttl_min || 'Not set'
                        };
                        securityPolicies.push(sigPolicy);
                    }

                    setViewProductData({
                        addProduct: {
                            productName: product.product_name,
                            description: product.product_description,
                            productCategory: product.category_uuid,
                            category_name: product.category_name,
                            commercialType: product.commercial_type === 'ELITE',
                            enableSandbox: product.sandbox_enabled,
                            product_uuid: product.product_uuid,
                        },
                        connectApi: (product.attached_apis || []).map(api => ({
                            id: api.api_uuid,
                            name: api.api_name,
                            allowedMethods: api.method_csv ? api.method_csv.split(',').reduce((acc, method) => ({ ...acc, [method.trim()]: true }), {}) : {},
                        })),
                        chooseLiveMeter: (product.attached_smart_meters || []).map(meter => ({
                            id: meter.meter_uuid,
                            name: meter.meter_name || 'N/A',
                            type: meter.meter_type || 'N/A',
                            status: meter.meter_status || 'N/A',
                            amount: meter.meter_amount ?? 'N/A',
                            updatedAmount: meter.updated_meter_amount ?? 'N/A',
                        })),
                        sandboxProduct: (product.attached_sb_smart_meters || []).map(meter => ({
                            id: meter.meter_uuid,
                            name: meter.meter_name || 'N/A',
                            type: meter.meter_type || 'N/A',
                            status: meter.meter_status || 'N/A',
                            amount: meter.meter_amount ?? 'N/A',
                            updatedAmount: meter.updated_meter_amount ?? 'N/A',
                        })),
                        applySecurity: securityPolicies,
                    });
                })
                .catch(error => {
                    console.error("Failed to fetch product details:", error);
                });
        }
    }, [productId]);

    const dataToRender = productId ? viewProductData : formData;

    const renderDetailRow = (label, value) => (
        <div className="grid grid-cols-2 gap-4 py-2 border-b dark:border-gray-700">
            <p className="dark:text-gray-400 text-left">{label}</p>
            <p className="dark:text-white text-left break-words">{value}</p>
        </div>
    );

    const renderSection = (title, children) => (
        <div className="mb-8">
            <h3 className="text-lg font-semibold dark:text-white mb-4 text-left">{title}</h3>
            <div className="p-4 rounded-lg  border dark:border-gray-700">
                {children}
            </div>
        </div>
    );

    const finalData = dataToRender || {};

    const {
        addProduct = { productName: 'N/A', description: 'N/A', productCategory: '' },
        connectApi = [],
        chooseLiveMeter = [],
        sandboxProduct = [],
        applySecurity = [],
    } = finalData;

    const categoryName = addProduct?.category_name || categories.find(c => c.category_uuid === addProduct?.productCategory)?.category_name || 'N/A';

    const showLiveUpdatedAmount = chooseLiveMeter.some(meter => meter.updatedAmount !== 'N/A');
    const showSandboxUpdatedAmount = sandboxProduct.some(meter => meter.updatedAmount !== 'N/A');

    const statusColors = {
        'On Track': 'bg-green-100 text-green-800',
        'Exceeded': 'bg-red-100 text-red-800',
        // Meters
        'SAVED': 'bg-orange-100 text-orange-800',
        'DRAFT': 'bg-orange-100 text-orange-800',
        'PUBLISH': 'bg-blue-100 text-blue-800',
        'PUBLISHED': 'bg-blue-100 text-blue-800',
        'SUBSCRIBED': 'bg-emerald-100 text-emerald-800',
        'LAUNCHED': 'bg-emerald-100 text-emerald-800',
        'ATTACHED': 'bg-emerald-100 text-emerald-800',
        'ACTIVE': 'bg-green-100 text-green-800',
        'SHARED': 'bg-green-100 text-green-800',
        // Products / General
        'Active': 'bg-green-100 text-green-800',
        'Inactive': 'bg-red-100 text-red-800',
        'Public': 'bg-blue-100 text-blue-800',
        'Private': 'bg-gray-100 text-gray-800',
    };

    const getStatusBadgeColor = (status) => {
        if (!status) return 'bg-gray-100 text-gray-800';
        // Check exact match first, then case-insensitive
        if (statusColors[status]) return statusColors[status];

        const upperStatus = status.toUpperCase();
        if (statusColors[upperStatus]) return statusColors[upperStatus];

        // Fallback or specific logic from before
        const lowerStatus = status.toLowerCase();
        if (['shared', 'attached', 'saved', 'active', 'launched'].includes(lowerStatus)) {
            // Keep existing fallback for safety if not in map
            if (lowerStatus === 'saved') return 'bg-orange-100 text-orange-800';
            return 'bg-green-100 text-green-800';
        }
        return 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="p-6 overflow-auto ">
            {!productId && <h2 className="text-xl font-bold mb-6 dark:text-white  text-left ">Deployment Summary</h2>}


            {/* Product Details */}
            {renderSection("Product Details", (
                <div>
                    {renderDetailRow("Product Name", addProduct.productName || 'N/A')}
                    {renderDetailRow("Product Category", categoryName)}
                    {renderDetailRow("Description", addProduct.description || 'N/A')}
                    {renderDetailRow("Commercial Type", addProduct.commercialType ? 'Elite' : 'Standard')}
                    {renderDetailRow("Sandbox Mode", addProduct.enableSandbox ? 'Enabled' : 'Disabled')}
                </div>
            ))}


            {/* Connected APIs */}
            {connectApi.length > 0 && renderSection("Connected APIs", (
                <table className="w-full">
                    <thead className="border-b dark:border-gray-700">
                        <tr>
                            <th className="text-left py-2 px-4 font-semibold text-sm dark:text-white">API Name</th>
                            <th className="text-left py-2 px-4 font-semibold text-sm dark:text-white">Allowed Methods</th>
                            <th className="text-left py-2 px-4 font-semibold text-sm dark:text-white">Launch Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {connectApi.map(api => {
                            // यहां condition को सही करें
                            const allowedMethodsArray = Object.entries(api.allowedMethods)
                                .filter(([, enabled]) => enabled)
                                .map(([method]) => method);

                            const isPendingLaunch = api.status === "PENDING_LAUNCH" ||
                                (allowedMethodsArray.length === 1 &&
                                    allowedMethodsArray[0] === "GET");

                            return (
                                <tr key={api.id} className="">
                                    {/* सिर्फ text color change, bg नहीं */}
                                    <td className={`py-3 px-4 ${isPendingLaunch ? 'text-red-500 dark:text-red-400' : 'dark:text-white'} text-left`}>
                                        {api.name}
                                    </td>
                                    <td className={`py-3 px-4 ${isPendingLaunch ? 'text-red-500 dark:text-red-400' : 'dark:text-gray-300'} text-left`}>
                                        {allowedMethodsArray.join(', ') || 'None'}
                                    </td>
                                    {/* <td className="py-3 px-4 text-left">
                                        <span className={`inline-flex items-center h-6 px-3 py-0 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusBadgeColor(api.status || "SAVED")}`}>
                                            {formatStatus(api.status || "SAVED")}
                                        </span>
                                    </td> */}
                                    <td className={`py-3 px-4 ${isPendingLaunch ? 'text-red-500 dark:text-red-400' : 'dark:text-white'} text-left`}>
                                        <i>{api.status || "Pending Launch"}</i>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            ))}

            {/* Live Meters */}
            {chooseLiveMeter.length > 0 && renderSection("Live Meters", (
                <table className="w-full">
                    <thead className="border-b dark:border-gray-700">
                        <tr>
                            <th className="text-left py-2 px-4 font-semibold text-sm dark:text-white">Meter Name</th>
                            <th className="text-left py-2 px-4 font-semibold text-sm dark:text-white">Type</th>
                            <th className="text-left py-2 px-4 font-semibold text-sm dark:text-white">Amount</th>
                            {showLiveUpdatedAmount && <th className="text-left py-2 px-4 font-semibold text-sm dark:text-white">Updated Amount</th>}
                            <th className="text-left py-2 px-4 font-semibold text-sm dark:text-white">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {chooseLiveMeter.map(meter => (
                            <tr key={meter.id} className="">
                                <td className="py-3 px-4 dark:text-white text-left">{meter.name}</td>
                                <td className="py-3 px-4 dark:text-gray-300 text-left">{meter.type}</td>
                                <td className="py-3 px-4 dark:text-gray-300 text-left">{meter.amount}</td>
                                {showLiveUpdatedAmount && <td className="py-3 px-4 dark:text-gray-300 text-left">{meter.updatedAmount}</td>}
                                <td className="py-3 px-4 dark:text-gray-300 text-left"><i>{meter.status}</i></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ))}

            {/* Sandbox Meters - Only show if sandbox is enabled */}
            {addProduct.enableSandbox && sandboxProduct.length > 0 && renderSection("Sandbox Meters", (
                <table className="w-full">
                    <thead className="border-b dark:border-gray-700">
                        <tr>
                            <th className="text-left py-2 px-4 font-semibold text-sm dark:text-white">Meter Name</th>
                            <th className="text-left py-2 px-4 font-semibold text-sm dark:text-white">Type</th>
                            <th className="text-left py-2 px-4 font-semibold text-sm dark:text-white">Status</th>
                            <th className="text-left py-2 px-4 font-semibold text-sm dark:text-white">Amount</th>
                            {showSandboxUpdatedAmount && <th className="text-left py-2 px-4 font-semibold text-sm dark:text-white">Updated Amount</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {sandboxProduct.map(meter => (
                            <tr key={meter.id} className="">
                                <td className="py-3 px-4 dark:text-white text-left">{meter.name}</td>
                                <td className="py-3 px-4 dark:text-gray-300 text-left">{meter.type}</td>
                                <td className="py-3 px-4 dark:text-gray-300 text-left"><i>{meter.status}</i></td>
                                <td className="py-3 px-4 dark:text-gray-300 text-left">{meter.amount}</td>
                                {showSandboxUpdatedAmount && <td className="py-3 px-4 dark:text-gray-300 text-left">{meter.updatedAmount}</td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ))}

            {/* Security Policies */}
            {applySecurity.length > 0 && renderSection("Security Policies", (
                <table className="w-full">
                    <thead className="border-b dark:border-gray-700">
                        <tr>
                            <th className="text-left py-2 px-4 font-semibold text-sm dark:text-white">Policy</th>
                            <th className="text-left py-2 px-4 font-semibold text-sm dark:text-white">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applySecurity.map(policy => (
                            <React.Fragment key={policy.name}>
                                <tr className="">
                                    <td className="py-3 px-4 dark:text-white text-left">{policy.name}</td>
                                    <td className="py-3 px-4 dark:text-gray-300 text-left">{policy.description}</td>
                                </tr>
                                {policy.name === 'Key Signature Verification' && policy.formData && (
                                    <tr className="bg-[#282a3f]">
                                        <td colSpan={2} className="p-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm font-medium dark:text-gray-400">Hashing Algo</p>
                                                    <p className="text-sm dark:text-white">{policy.formData.hashing || 'Not set'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium dark:text-gray-400">TTL</p>
                                                    <p className="text-sm dark:text-white">{policy.formData.ttl ? `${policy.formData.ttl} minute(s)` : 'Not set'}</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            ))}

            {!viewMode && (
                <div className="flex justify-end pt-4 space-x-2">
                    <button
                        type="button"
                        onClick={onReject}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-md transition-colors shadow-sm"
                    >
                        Reject
                    </button>
                    <button
                        type="button"
                        onClick={() => onSubmit && onSubmit(viewProductData)}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-md transition-colors shadow-sm"
                    >
                        Launch
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditProductForm;
