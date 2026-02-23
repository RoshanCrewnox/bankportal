// import React from "react";
// import { Edit, Eye, Rocket } from "lucide-react";
// import { formatStatus } from '../../../utils/formatStatus';
// import { hasPermissionById } from "../../../utils/rbacUtils";

// const AssetTable = ({ activeTab, paginatedAssets, getAssetColumnName, onEdit, onView, onLaunch, roleData }) => {

//     // Permission Map for Tabs
//     const tabPermissionMap = {
//         'apis': 'CX-015-001',
//         'products': 'CX-015-002',
//         'smartMeters': 'CX-015-003',
//         'sandboxSmartMeters': 'CX-015-004'
//     };

//     const baseId = tabPermissionMap[activeTab];
//     const canViewAction = hasPermissionById(roleData, `${baseId}-001`);
//     const canEditAction = hasPermissionById(roleData, `${baseId}-002`);
//     const canLaunchAction = hasPermissionById(roleData, `${baseId}-003`);

//     // ... (keep statusColors map and helper functions)

//     const statusColors = {
//         'On Track': 'bg-green-100 text-green-800',
//         'Exceeded': 'bg-red-100 text-red-800',
//         // Meters
//         'SAVED': 'bg-orange-100 text-orange-800',
//         'DRAFT': 'bg-orange-100 text-orange-800',
//         'PUBLISH': 'bg-blue-100 text-blue-800',
//         'PUBLISHED': 'bg-blue-100 text-blue-800',
//         'SUBSCRIBED': 'bg-emerald-100 text-emerald-800',
//         'LAUNCHED': 'bg-emerald-100 text-emerald-800',
//         'ATTACHED': 'bg-emerald-100 text-emerald-800',
//         'ACTIVE': 'bg-green-100 text-green-800',
//         'SHARED': 'bg-green-100 text-green-800',
//         // Products / General
//         'Active': 'bg-green-100 text-green-800',
//         'Inactive': 'bg-red-100 text-red-800',
//         'Public': 'bg-blue-100 text-blue-800',
//         'Private': 'bg-gray-100 text-gray-800',
//     };

//     const formatDate = (dateString) => {
//         if (!dateString) return '-';
//         return new Date(dateString).toLocaleDateString();
//     };

//     const getStatusBadgeColor = (status) => {
//         if (!status) return 'bg-gray-100 text-gray-800';
//         // Check exact match first, then case-insensitive
//         if (statusColors[status]) return statusColors[status];

//         const upperStatus = status.toUpperCase();
//         if (statusColors[upperStatus]) return statusColors[upperStatus];

//         // Fallback or specific logic from before
//         const lowerStatus = status.toLowerCase();
//         if (['shared', 'attached', 'saved', 'active', 'launched'].includes(lowerStatus)) {
//              // Keep existing fallback for safety if not in map
//              if (lowerStatus === 'saved') return 'bg-orange-100 text-orange-800';
//              return 'bg-green-100 text-green-800';
//         }
//         return 'bg-gray-100 text-gray-800';
//     };

//     const renderTableHeaders = () => {
//         let headers = [];

//         if (activeTab === 'smartMeters' || activeTab === 'sandboxSmartMeters') {
//             headers = [
//                 { key: 'name', label: 'Meter Name' },
//                 { key: 'is_shared', label: 'Is Shared' },
//                 { key: 'is_custom_meter', label: 'Custom Meter' },
//                 { key: 'meter_type', label: 'Meter Type' },
//                 { key: 'commercial_type', label: 'Commercial Type' },
//                 { key: 'estimated_cost', label: 'Est. Cost' },
//                 { key: 'actual_cost', label: 'Actual Cost' },
//                 { key: 'status', label: 'Status' },
//                 { key: 'updatedBy', label: 'Updated By' },
//                 { key: 'actions', label: 'Action' }
//             ];
//         } else if (activeTab === 'products') {
//             headers = [
//                 { key: 'name', label: 'Name' },
//                 { key: 'category', label: 'Category' },
//                 { key: 'commercial_type', label: 'Commercial Type' },
//                 { key: 'is_shared', label: 'Is Shared' },
//                 { key: 'visibility', label: 'Visibility' },
//                 { key: 'status', label: 'Status' },
//                 { key: 'subscriptionCount', label: 'Subscription Count' },
//                 { key: 'updatedBy', label: 'Updated By' },
//                 { key: 'actions', label: 'Action' }
//             ];
//         } else {
//             // Default (e.g., APIs)
//             headers = [
//                 { key: 'name', label: getAssetColumnName() },
//                 { key: 'lastUpdated', label: 'Last Updated' },
//                 { key: 'status', label: 'Status' },
//                 { key: 'actions', label: 'Action' }
//             ];

//              if (activeTab === 'apis') {
//                   // Insert specific headers for APIs if needed, though not requested
//                   // Keeping default simple based on request, or can expand if needed
//                   headers = [
//                      { key: 'name', label: 'API Name' },
//                       { key: 'version', label: 'Version' },
//                      { key: 'commercial_type', label: 'Commercial Type' },
//                      { key: 'is_shared', label: 'Is Shared' },
//                      { key: 'is_public', label: 'Is Public' },
//                      { key: 'api_type', label: 'API Type' },
//                      { key: 'amount', label: 'Amount' },
//                      { key: 'status', label: 'Status' },
//                      { key: 'updatedBy', label: 'Updated By' },
//                      { key: 'actions', label: 'Action' }
//                   ]
//              }
//         }

//         return (
//             <thead className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#3e425a]">
//                 <tr>
//                     {headers.map(header => (
//                         <th key={header.key} className="text-left py-4 px-6 font-semibold text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
//                             {header.label}
//                         </th>
//                     ))}
//                 </tr>
//             </thead>
//         );
//     };

//     const renderTableBody = () => {
//         return (
//             <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
//                 {paginatedAssets.map((asset) => (
//                     <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0">
//                         {/* Render columns based on activeTab */}
//                         {(activeTab === 'smartMeters' || activeTab === 'sandboxSmartMeters') ? (
//                             <>
//                                 <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">{asset.name}</td>
//                                 <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.is_shared_object ? 'Yes' : 'No'}</td>
//                                 <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.is_custom_meter ? 'Yes' : 'No'}</td>
//                                 <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.meter_type || asset.cluster || '-'}</td>
//                                 <td className="py-4 px-6">
//                                     {asset.actual_cost == 0 || asset.meter_amount == 0 ? (
//                                         <span className="inline-flex items-center h-6 px-3 py-0 rounded-full text-xs font-semibold whitespace-nowrap bg-green-100 text-green-800">Free</span>
//                                     ) : (
//                                         <span className="inline-flex items-center h-6 px-3 py-0 rounded-full text-xs font-semibold whitespace-nowrap bg-purple-100 text-purple-800">Elite</span>
//                                     )}
//                                 </td>
//                                 <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.estimated_cost || '-'}</td>
//                                 <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.actual_cost || '-'}</td>
//                                 <td className="py-4 px-6">
//                                     <span className={`inline-flex items-center h-6 px-3 py-0 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusBadgeColor(asset.status || asset.meter_status)}`}>
//                                         {formatStatus(asset.status || asset.meter_status)}
//                                     </span>
//                                 </td>
//                                 <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.updatedBy || '-'}</td>
//                             </>
//                         ) : activeTab === 'products' ? (
//                             <>
//                                 <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">{asset.name}</td>
//                                 <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.category || '-'}</td>
//                                 <td className="py-4 px-6">
//                                     {asset.commercial_type === 'ELITE' ? (
//                                         <span className="inline-flex items-center h-6 px-3 py-0 rounded-full text-xs font-semibold whitespace-nowrap bg-purple-100 text-purple-800">Elite</span>
//                                     ) : (
//                                         <span className="inline-flex items-center h-6 px-3 py-0 rounded-full text-xs font-semibold whitespace-nowrap bg-green-100 text-green-800">
//                                             {asset.commercial_type || 'Free'}
//                                         </span>
//                                     )}
//                                 </td>
//                                 <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.is_shared_object ? 'Yes' : 'No'}</td>
//                                 <td className="py-4 px-6">
//                                     <span className={`inline-flex items-center h-6 px-3 py-0 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusBadgeColor(asset.visibility)}`}>
//                                         {formatStatus(asset.visibility)}
//                                     </span>
//                                 </td>
//                                 <td className="py-4 px-6">
//                                      <span className={`inline-flex items-center h-6 px-3 py-0 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusBadgeColor(asset.status || asset.product_status)}`}>
//                                         {formatStatus(asset.status || asset.product_status)}
//                                     </span>
//                                 </td>
//                                 <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.subscriptionCount || 0}</td>
//                                 <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.updatedBy || '-'}</td>
//                             </>
//                         ) : (
//                             // Default / APIs
//                             <>
//                                 <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">
//                                     <div className="flex flex-col gap-1">
//                                         <div className="flex items-center gap-2">
//                                             {asset.name}
//                                         </div>
//                                         {asset.subOrgs && asset.subOrgs.length > 0 && (
//                                             <span className="text-blue-500 text-xs font-medium">
//                                                 Shared with {asset.subOrgs.length} org(s)
//                                             </span>
//                                         )}
//                                     </div>
//                                 </td>
//                                 {activeTab === 'apis' && (
//                                     <>
//                                          <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.version || '-'}</td>
//                                          <td className="py-4 px-6">
//                                             {asset.commercial_type === 'ELITE' ? (
//                                                 <span className="inline-flex items-center h-6 px-3 py-0 rounded-full text-xs font-semibold whitespace-nowrap bg-purple-100 text-purple-800">Elite</span>
//                                             ) : (
//                                                 <span className="inline-flex items-center h-6 px-3 py-0 rounded-full text-xs font-semibold whitespace-nowrap bg-green-100 text-green-800">
//                                                     {asset.commercial_type || 'Free'}
//                                                 </span>
//                                             )}
//                                          </td>
//                                          <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.is_shared_object ? 'Yes' : 'No'}</td>
//                                          <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.is_public ? 'Yes' : 'No'}</td>
//                                          <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.api_type || '-'}</td>
//                                          <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.amount || '-'}</td>
//                                     </>
//                                 )}
//                                 {activeTab !== 'apis' && (
//                                     <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{formatDate(asset.lastUpdated)}</td>
//                                 )}

//                                 <td className="py-4 px-6">
//                                     <span className={`inline-flex items-center h-6 px-3 py-0 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusBadgeColor(asset.status || asset.api_status)}`}>
//                                         {formatStatus(asset.status || asset.api_status)}
//                                     </span>
//                                 </td>
//                                 {activeTab === 'apis' && ( 
//                                       <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.updatedBy || '-'}</td>
//                                 )}
//                             </>
//                         )}

//                         <td className="py-4 px-6">
//                             <div className="flex items-center gap-2">
//                                 {canLaunchAction && (
//                                     <button
//                                         onClick={() => onLaunch && onLaunch(asset)}
//                                         className="text-gray-500 hover:text-orange-600 transition-colors"
//                                         title="Launch for Free"
//                                     >
//                                         <Rocket className="w-5 h-5" />
//                                     </button>
//                                 )}
//                                 {canViewAction && (
//                                     <button
//                                         onClick={() => onView && onView(asset)}
//                                         className="text-gray-500 hover:text-green-600 transition-colors"
//                                         title="View"
//                                     >
//                                         <Eye className="w-5 h-5" />
//                                     </button>
//                                 )}
//                                 {canEditAction && (
//                                     <button
//                                         onClick={() => onEdit && onEdit(asset)}
//                                         className="text-gray-500 hover:text-blue-600 transition-colors"
//                                         title="Edit"
//                                     >
//                                         <Edit className="w-5 h-5" />
//                                     </button>
//                                 )}
//                             </div>
//                         </td>
//                     </tr>
//                 ))}
//             </tbody>
//         );
//     };

//     return (
//         <table className="w-full text-gray-800 dark:text-gray-300">
//             {renderTableHeaders()}
//             {renderTableBody()}
//         </table>
//     );
// };

// export default AssetTable;

import React from "react";
import { Edit, Eye, Rocket, Check, X, FileCode } from "lucide-react";
import { formatStatus } from '../../../utils/formatStatus';
import { hasPermissionById } from "../../../utils/rbacUtils";
import StatusBadge from "../../../components/common/StatusBadge";

const AssetTable = ({ activeTab, paginatedAssets, getAssetColumnName, onEdit, onView, onLaunch, roleData }) => {

    // Permission Map for Tabs
    const tabPermissionMap = {
        'apis': 'CX-015-001',
        'products': 'CX-015-002',
        'smartMeters': 'CX-015-003',
        'sandboxSmartMeters': 'CX-015-004'
    };

    const baseId = tabPermissionMap[activeTab];
    const canViewAction = hasPermissionById(roleData, `${baseId}-001`);
    const canEditAction = hasPermissionById(roleData, `${baseId}-002`);
    const canLaunchAction = hasPermissionById(roleData, `${baseId}-003`);

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

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString();
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

    // Helper function to check if launch button should be disabled
    const shouldDisableLaunch = (asset) => {
        const status = (asset.status || asset.api_status || asset.product_status || asset.meter_status || '').toString();
        const normalizedStatus = status.toUpperCase();
        return normalizedStatus !== 'PENDING_LAUNCH';
    };

    // Helper function to get asset status
    const getAssetStatus = (asset) => {
        return asset.status || asset.api_status || asset.product_status || asset.meter_status || '';
    };

    const renderTableHeaders = () => {
        let headers = [];

        if (activeTab === 'smartMeters' || activeTab === 'sandboxSmartMeters') {
            headers = [
                { key: 'name', label: 'Meter Name' },
                { key: 'sm_type', label: 'SM Type' },
                { key: 'is_shared', label: 'Is Shared' },
                { key: 'meter_type', label: 'Meter Type' },
                { key: 'commercial_type', label: 'Commercial Type' },
                { key: 'estimated_cost', label: 'Est. Cost' },
                { key: 'actual_cost', label: 'Actual Cost' },
                { key: 'status', label: 'Status' },
                { key: 'updatedBy', label: 'Updated By' },
                { key: 'actions', label: 'Action' }
            ];
        } else if (activeTab === 'products') {
            headers = [
                { key: 'name', label: 'Name' },
                { key: 'category', label: 'Category' },
                { key: 'commercial_type', label: 'Commercial Type' },
                { key: 'is_shared', label: 'Is Shared' },
                { key: 'visibility', label: 'Visibility' },
                { key: 'status', label: 'Status' },
                { key: 'subscriptionCount', label: 'Subscription Count' },
                { key: 'updatedBy', label: 'Updated By' },
                { key: 'actions', label: 'Action' }
            ];
        } else if (activeTab === 'sandboxProducts') {
            headers = [
                { key: 'name', label: 'Name' },
                { key: 'category', label: 'Category' },
                { key: 'commercial_type', label: 'Commercial Type' },
                { key: 'is_shared', label: 'Is Shared' },
                { key: 'visibility', label: 'Visibility' },
                { key: 'status', label: 'Status' },
                { key: 'subscriptionCount', label: 'Subscription Count' },
                { key: 'updatedBy', label: 'Updated By' },
                { key: 'actions', label: 'Action' }
            ];
        }
        else {
            // Default (e.g., APIs)
            headers = [
                { key: 'name', label: getAssetColumnName() },
                { key: 'lastUpdated', label: 'Last Updated' },
                { key: 'status', label: 'Status' },
                { key: 'actions', label: 'Action' }
            ];

            if (activeTab === 'apis') {
                headers = [
                    { key: 'name', label: 'API Name' },
                    { key: 'version', label: 'Version' },
                    { key: 'commercial_type', label: 'Commercial Type' },
                    { key: 'is_shared', label: 'Is Shared' },
                    { key: 'is_public', label: 'Is Public' },
                    { key: 'header_policy', label: 'Header Policy' },
                    { key: 'api_type', label: 'API Type' },
                    { key: 'amount', label: 'Amount' },
                    { key: 'status', label: 'Status' },
                    { key: 'updatedBy', label: 'Updated By' },
                    { key: 'actions', label: 'Action' }
                ]
            }
        }

        return (
            <thead className="border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-[#3e425a]">
                <tr>
                    {headers.map(header => (
                        <th key={header.key} className="text-left py-4 px-6 font-semibold text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                            {header.label}
                        </th>
                    ))}
                </tr>
            </thead>
        );
    };

    const renderTableBody = () => {
        return (
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedAssets.map((asset) => {
                    const isLaunchDisabled = shouldDisableLaunch(asset);
                    const assetStatus = getAssetStatus(asset);

                    return (
                        <tr key={asset.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0">
                            {/* Render columns based on activeTab */}
                            {(activeTab === 'smartMeters' || activeTab === 'sandboxSmartMeters') ? (
                                <>
                                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">{asset.name}</td>
                                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">{asset.sm_type || "Standard"}</td>
                                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400">
                                        {asset.is_shared_object ? (
                                            <Check className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <X className="w-5 h-5 text-red-500" />
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-green-400"><i>{asset.meter_type || asset.cluster || '-'}</i></td>
                                    <td className="py-4 px-6">
                                        <StatusBadge status={asset.actual_cost == 0 || asset.meter_amount == 0 ? 'Free' : 'Elite'} />
                                    </td>
                                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.estimated_cost || '-'}</td>
                                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.actual_cost || '-'}</td>
                                    <td className="py-4 px-6">
                                        <StatusBadge status={assetStatus} />
                                    </td>
                                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.updatedBy || '-'}</td>
                                </>
                            ) : activeTab === 'products' ? (
                                <>
                                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">{asset.name}</td>
                                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.category || '-'}</td>
                                    <td className="py-4 px-6">
                                        <StatusBadge status={asset.commercial_type === 'ELITE' ? 'Elite' : (asset.commercial_type || 'Free')} />
                                    </td>
                                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400">
                                        {asset.is_shared_object ? (
                                            <Check className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <X className="w-5 h-5 text-red-500" />
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        <StatusBadge status={asset.visibility} />
                                    </td>
                                    <td className="py-4 px-6">
                                        <StatusBadge status={assetStatus} />
                                    </td>
                                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.subscriptionCount || 0}</td>
                                    <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.updatedBy || '-'}</td>
                                </>
                            ) : (
                                // Default / APIs
                                <>
                                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                {asset.name}
                                            </div>
                                            {asset.subOrgs && asset.subOrgs.length > 0 && (
                                                <span className="text-blue-500 text-xs font-medium">
                                                    Shared with {asset.subOrgs.length} org(s)
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    {activeTab === 'apis' && (
                                        <>
                                            <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.version || '-'}</td>
                                            <td className="py-4 px-6">
                                                <StatusBadge status={asset.commercial_type === 'ELITE' ? 'Elite' : (asset.commercial_type || 'Free')} />
                                            </td>
                                            <td className="py-4 px-6 text-gray-500 dark:text-gray-400">
                                                {asset.is_shared_object ? (
                                                    <Check className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <X className="w-5 h-5 text-red-500" />
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-gray-500 dark:text-gray-400">
                                                {asset.is_public ? (
                                                    <Check className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <X className="w-5 h-5 text-red-500" />
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-gray-500 dark:text-gray-400 text-center">
                                                {asset.ds_header_config && asset.ds_header_config.length > 0 ? (
                                                    <div className="flex items-center justify-center gap-1 text-blue-500">
                                                        <FileCode className="w-4 h-4" />
                                                        <span className="text-xs font-bold">{asset.ds_header_config.length}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.api_type || '-'}</td>
                                            <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.amount || '-'}</td>
                                        </>
                                    )}
                                    {activeTab !== 'apis' && (
                                        <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{formatDate(asset.lastUpdated)}</td>
                                    )}

                                    <td className="py-4 px-6">
                                        <StatusBadge status={assetStatus} />
                                    </td>
                                    {activeTab === 'apis' && (
                                        <td className="py-4 px-6 text-gray-500 dark:text-gray-400">{asset.updatedBy || '-'}</td>
                                    )}
                                </>
                            )}

                            <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                    {canLaunchAction && (
                                        <div className="relative group">
                                            <button
                                                onClick={() => !isLaunchDisabled && onLaunch && onLaunch(asset)}
                                                disabled={isLaunchDisabled}
                                                className={`transition-colors ${isLaunchDisabled
                                                    ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                                                    : 'text-gray-500 hover:text-orange-600'
                                                    }`}
                                                title={isLaunchDisabled ? "Please use edit option" : "Launch for Free"}
                                            >
                                                <Rocket className="w-5 h-5" />
                                            </button>
                                            {/* Optional: Tooltip for disabled state */}
                                            {isLaunchDisabled && (
                                                <div className="absolute z-10 invisible group-hover:visible bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    Please use edit option
                                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {canViewAction && (
                                        <button
                                            onClick={() => onView && onView(asset)}
                                            className="text-gray-500 hover:text-green-600 transition-colors"
                                            title="View"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    )}
                                    {canEditAction && (
                                        <button
                                            onClick={() => onEdit && onEdit(asset)}
                                            className="text-gray-500 hover:text-blue-600 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        );
    };

    return (
        <table className="w-full text-gray-800 dark:text-gray-300">
            {renderTableHeaders()}
            {renderTableBody()}
        </table>
    );
};

export default AssetTable;