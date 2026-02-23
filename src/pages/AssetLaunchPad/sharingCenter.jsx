import React, { useState, useContext, useEffect, useCallback } from "react";
import { Search, Lock, Check, X } from 'lucide-react';
import { ThemeContext } from '../../../shared/components/common/ThemeContext';
import Pagination from '../common/Pagination';
import services from '../../../services';
import { useSelector } from "react-redux";
import { hasPermissionById } from "../../../utils/rbacUtils";

const CustomButton = ({ children, className = "", onClick, variant = "default", size = "sm", ...props }) => {
    const baseClasses =
        "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
    const variantClasses =
        variant === "ghost"
            ? "hover:bg-gray-100 "
            : "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
    const sizeClasses = size === "sm" ? "px-3 py-2 text-sm" : "px-4 py-2 text-sm"

    return (
        <button className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`} onClick={onClick} {...props}>
            {children}
        </button>
    )
}

const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    if (dateTimeStr.includes(' ')) {
        const [date, time] = dateTimeStr.split(' ');
        return `${date} ${time}`;
    }
    return dateTimeStr;
};

export default function SharingCenter() {
    const { theme } = useContext(ThemeContext);
    const [activeTab, setActiveTab] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const itemsPerPage = 5;
    const roleData = useSelector((state) => state.role.roleData);
    const [screens, setScreens] = useState([]);

    useEffect(() => {
        if (roleData) {
            const subModules = [
                { name: "Api List", id: "apis", permissionId: "CX-009-002-001" },
                { name: "Product List", id: "products", permissionId: "CX-009-002-002" },
                { name: "Smart Meter List", id: "smartMeters", permissionId: "CX-009-002-003" },
                { name: "Sandbox Smart Meters List", id: "sandboxSmartMeters", permissionId: "CX-009-002-004" }
            ];

            const mappedScreens = subModules.map(sub => ({
                id: sub.id,
                name: sub.name === "Sandbox Smart Meters List" ? "Sandbox Smart Meters" : sub.name.replace(" List", "s"),
                disabled: !hasPermissionById(roleData, sub.permissionId),
                component: null
            }));

            setScreens(mappedScreens);

            const firstEnabledScreen = mappedScreens.find(s => !s.disabled);
            if (firstEnabledScreen && !activeTab) {
                setActiveTab(firstEnabledScreen.id);
            }
        }
    }, [roleData, activeTab]);

    const [assets, setAssets] = useState({
        apis: [],
        products: [],
        smartMeters: [],
        sandboxSmartMeters: [],
    });

    const fetchAssets = useCallback(async () => {
        if (!activeTab) return;
        let response;
        try {
            setAssets(prev => ({ ...prev, [activeTab]: [] }));
            setTotalRecords(0);

            switch (activeTab) {
                case 'apis':
                    response = await services.assetSharing.API_GOVERNANCE_LIST(currentPage);
                    if (response.data && Array.isArray(response.data.apis)) {
                        const mappedApis = response.data.apis.map(api => ({
                            id: api.api_uuid,
                            name: api.api_name,
                            status: api.cross_shared_object ? 'Shared' : 'Not-Shared',
                            lastUpdated: api.updated_at,
                            subOrgs: [],
                            version: api.api_version,
                            commercial_type: api.commercial_type,
                            is_public: api.is_public_apis,
                            api_status: api.api_status,
                            is_shared_object: api.is_shared_object,
                        }));
                        setAssets(prev => ({ ...prev, apis: mappedApis }));
                        setTotalRecords(response.data.TOTAL_RECORDS || 0);
                    }
                    break;
                case 'products':
                    response = await services.assetSharing.PRODUCT_GOVERNANCE_LIST(currentPage);
                    if (response.data && Array.isArray(response.data.products)) {
                        const mappedProducts = response.data.products.map(product => ({
                            id: product.product_uuid,
                            name: product.product_name,
                            status: product.cross_shared_object ? 'Shared' : 'Not-Shared',
                            lastUpdated: product.updated_at,
                            subOrgs: [],
                            is_public: product.is_public_products,
                            commercial_type: product.commercial_type,
                            sandbox_enabled: product.sandbox_enabled,
                            product_status: product.status,
                            is_shared_object: product.is_shared_object,
                        }));
                        setAssets(prev => ({ ...prev, products: mappedProducts }));
                        setTotalRecords(response.data.TOTAL_RECORDS || 0);
                    }
                    break;
                case 'smartMeters':
                    response = await services.assetSharing.SM_GOVERNANCE_LIST(currentPage);
                    if (response.data && Array.isArray(response.data.smart_meters)) {
                        const mappedMeters = response.data.smart_meters.map(meter => ({
                            id: meter.meter_uuid,
                            name: meter.meter_name,
                            status: meter.cross_shared_object ? 'Shared' : 'Not-Shared',
                            lastUpdated: meter.updated_at,
                            subOrgs: [],
                            meter_type: meter.meter_type,
                            meter_status: meter.meter_status,
                            is_shared_object: meter.is_shared_object,
                        }));
                        setAssets(prev => ({ ...prev, smartMeters: mappedMeters }));
                        setTotalRecords(response.data.TOTAL_RECORDS || 0);
                    }
                    break;
                case 'sandboxSmartMeters':
                    response = await services.assetSharing.SANDBOX_SM_GOVERNANCE_LIST(currentPage);
                    if (response.data && Array.isArray(response.data.smart_meters)) {
                        const mappedSandboxMeters = response.data.smart_meters.map(meter => ({
                            id: meter.meter_uuid,
                            name: meter.meter_name,
                            status: meter.cross_shared_object ? 'Shared' : 'Not-Shared',
                            lastUpdated: meter.updated_at,
                            subOrgs: [],
                            meter_type: meter.meter_type,
                            meter_status: meter.meter_status,
                            is_shared_object: meter.is_shared_object,
                        }));
                        setAssets(prev => ({ ...prev, sandboxSmartMeters: mappedSandboxMeters }));
                        setTotalRecords(response.data.TOTAL_RECORDS || 0);
                    }
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error(`Error fetching ${activeTab} assets:`, error);
            setAssets(prev => ({ ...prev, [activeTab]: [] }));
            setTotalRecords(0);
        }
    }, [activeTab, currentPage]);

    useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

    const currentAssets = assets[activeTab] || [];

    const filteredAssets = currentAssets.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (asset.status && asset.status.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(totalRecords / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAssets = filteredAssets.slice(startIndex, startIndex + itemsPerPage);

    const getAssetColumnName = () => {
        switch (activeTab) {
            case 'apis':
                return 'API Name';
            case 'products':
                return 'Product Name';
            case 'smartMeters':
                return 'Smart Meter Name';
            case 'sandboxSmartMeters':
                return 'Sandbox Smart Meter Name';
            default:
                return 'Asset Name';
        }
    };

    const statusSharedClass = 'bg-green-100 text-green-800';
    const statusNotSharedClass = 'bg-red-100 text-red-800';

    const renderTableHeaders = () => {
        const baseHeaders = [
            { key: 'name', label: getAssetColumnName() },
            { key: 'status', label: 'Status' },
            { key: 'is_shared_object', label: 'Is Shared' },
            { key: 'cross_shared_object', label: 'Cross Shared' },
        ];

        let specificHeaders = [];
        if (activeTab === 'apis') {
            specificHeaders = [
                { key: 'version', label: 'Version' },
                { key: 'commercial_type', label: 'Commercial Type' },
                { key: 'is_public', label: 'Is Public' },
                { key: 'api_status', label: 'API Status' },
            ];
        } else if (activeTab === 'products') {
            specificHeaders = [
                { key: 'is_public', label: 'Is Public' },
                { key: 'commercial_type', label: 'Commercial Type' },
                { key: 'sandbox_enabled', label: 'Sandbox Enabled' },
                { key: 'product_status', label: 'Product Status' },
            ];
        } else if (activeTab === 'smartMeters' || activeTab === 'sandboxSmartMeters') {
            specificHeaders = [
                { key: 'meter_type', label: 'Meter Type' },
                { key: 'meter_status', label: 'Meter Status' },
            ];
        }

        const allHeaders = [...baseHeaders, ...specificHeaders];

        return (
            <thead className="border-b border-gray-200 dark:border-gray-600 bg-gray-200 dark:bg-[#3e425a]">
                <tr>
                    {allHeaders.map(header => (
                        <th key={header.key} className="text-left py-3 px-4 font-medium text-sm">
                            {header.label}
                        </th>
                    ))}
                </tr>
            </thead>
        );
    };

    const renderTableBody = () => {
        return (
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {paginatedAssets.map((asset) => (
                    <tr key={asset.id} className="hover:bg-gray-200 dark:hover:bg-[#3e425a] transition-colors">
                        <td className="py-3 px-4 text-left text-sm">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                {asset.name}
                                {asset.subOrgs.length > 0 && (
                                    <span className="text-blue-500 text-xs font-medium">
                                        Shared with {asset.subOrgs.length} org(s)
                                    </span>
                                )}
                            </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-start">
                            {activeTab === 'apis' && asset.api_status ? (
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${asset.api_status === 'ATTACHED' ? statusSharedClass : statusNotSharedClass}`}>
                                    <i>{asset.api_status}</i>
                                </span>
                            ) : activeTab === 'products' && asset.product_status ? (
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${asset.product_status === 'SAVED' ? statusSharedClass : statusNotSharedClass}`}>
                                    <i>{asset.product_status}</i>
                                </span>
                            ) : (activeTab === 'smartMeters' || activeTab === 'sandboxSmartMeters') && asset.meter_status ? (
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${asset.meter_status === 'ATTACHED' ? statusSharedClass : statusNotSharedClass}`}>
                                    <i>{asset.meter_status}</i>
                                </span>
                            ) : (
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${asset.status === 'Shared' ? statusSharedClass : statusNotSharedClass}`}>
                                    <i>{asset.status}</i>
                                </span>
                            )}
                        </td>
                        <td className="py-3 px-4 text-left text-sm">
                            {asset.is_shared_object ? (
                                <Check className="w-5 h-5 text-green-500" />
                            ) : (
                                <X className="w-5 h-5 text-red-500" />
                            )}
                        </td>
                        <td className="py-3 px-4 text-left text-sm">
                            {asset.cross_shared_object ? (
                                <Check className="w-5 h-5 text-green-500" />
                            ) : (
                                <X className="w-5 h-5 text-red-500" />
                            )}
                        </td>
                        {activeTab === 'apis' && (
                            <>
                                <td className="py-3 px-4 text-left text-sm"><i>{asset.version}</i></td>
                                <td className="py-3 px-4 text-left text-sm">{asset.commercial_type === 'ELITE' ? 'Elite' : 'Standard'}</td>
                                <td className="py-3 px-4 text-left text-sm">
                                    {asset.is_public ? (
                                        <Check className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <X className="w-5 h-5 text-red-500" />
                                    )}
                                </td>
                                <td className="py-3 px-4 text-left text-sm"><i>{asset.api_status}</i></td>
                            </>
                        )}
                        {activeTab === 'products' && (
                            <>
                                <td className="py-3 px-4 text-left text-sm">
                                    {asset.is_public ? (
                                        <Check className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <X className="w-5 h-5 text-red-500" />
                                    )}
                                </td>
                                <td className="py-3 px-4 text-left text-sm">{asset.commercial_type === 'ELITE' ? 'Elite' : 'Standard'}</td>
                                <td className="py-3 px-4 text-left text-sm">
                                    {asset.sandbox_enabled ? (
                                        <Check className="w-5 h-5 text-green-500" />
                                    ) : (
                                        <X className="w-5 h-5 text-red-500" />
                                    )}
                                </td>
                                <td className="py-3 px-4 text-left text-sm"><i>{asset.product_status}</i></td>
                            </>
                        )}
                        {(activeTab === 'smartMeters' || activeTab === 'sandboxSmartMeters') && (
                            <>
                                <td className="py-3 px-4 text-left text-sm">{asset.meter_type}</td>
                                <td className="py-3 px-4 text-left text-sm"><i>{asset.meter_status}</i></td>
                            </>
                        )}
                    </tr>
                ))}
            </tbody>
        );
    };

    const canViewAnyTab = screens.some(s => !s.disabled);

    if (!canViewAnyTab && screens.length > 0) {
        return (
            <div className="min-h-screen p-6">
                <div className="flex flex-col items-center justify-center w-full h-full p-8 rounded-2xl bg-white shadow-sm dark:!bg-[#2F3349]">
                    <Lock className="text-5xl mb-4 text-gray-400" />
                    <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                    <p className="text-gray-400 text-center">You don't have permission to view the Asset Sharing Center.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <h2 className="text-xl font-semibold text-left 0 pb-2 text-gray-800 dark:text-white">
                Asset Sharing Center
            </h2>

            <div className="border-b border-gray-200 dark:border-gray-600 mb-6">
                <div className="flex items-center space-x-1 py-4 p-2 gap-2 overflow-x-auto">
                    {screens?.map((screen) => (
                        <CustomButton
                            key={screen.id}
                            variant={activeTab === screen?.id ? "default" : "ghost"}
                            size="sm"
                            onClick={() => {
                                setActiveTab(screen?.id);
                                setCurrentPage(1);
                                setSearchTerm("");
                            }}
                            className={`whitespace-nowrap`}
                            disabled={screen.disabled}
                            title={screen.disabled ? "You don't have permission" : screen.name}
                        >
                            {screen?.name}
                        </CustomButton>
                    ))}
                </div>
            </div>

            <div className="bg-gray-100 dark:bg-secondary-dark-bg p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-left`}>
                        {getAssetColumnName().replace(' Name', 's')}
                    </h3>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="p-2 px-10 rounded bg-gray-100 dark:bg-[#3e425a] border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-gray-800 dark:text-gray-300">
                        {renderTableHeaders()}
                        {renderTableBody()}
                    </table>
                </div>

                <Pagination
                    totalPages={totalPages}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
    );
}