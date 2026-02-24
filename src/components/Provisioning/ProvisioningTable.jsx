import React, { useContext } from 'react';
import { ThemeContext } from '../common/ThemeContext';
import { Eye, Pencil, FilePlus } from 'lucide-react';
import DataTable from '../common/DataTable';

const ProvisioningTable = ({ data, activeTab, onEdit, onView, onAddFields, totalItems, currentPage, onPageChange, context }) => {
    const { theme } = useContext(ThemeContext);

    const getHeaders = () => {
        switch (activeTab) {
            case 'TPP':
                return [
                  {label: 'TPP ID', key: 'id'}, 
                  {label: 'TPP Name', key: 'name'}, 
                  {label: 'TPP Type', key: 'type'}, 
                  {label: 'TPP Scope', key: 'openBankingType'}, 
                  {label: 'Email', key: 'email'}, 
                  {label: 'Access', key: 'access'}, 
                  {label: 'Onboarding Date', key: 'onboardingDate'}, 
                  {label: 'Status', key: 'status'}, 
                  {label: 'Actions', key: null}
                ];
            case 'Products':
                return [
                  {label: 'Product Name', key: 'product_name'}, 
                  {label: 'Scope', key: 'scope'}, 
                  {label: 'Onboarding Date', key: 'onboardingDate'}, 
                  {label: 'Status', key: 'status'}, 
                  {label: 'Domain', key: 'domain'}, 
                  {label: 'Subdomain', key: 'subdomain'}, 
                  {label: 'Access', key: 'access'}, 
                  {label: 'Actions', key: null}
                ];
            case 'APIs':
                return [
                  {label: 'API Name', key: 'api_name'}, 
                  {label: 'Scope', key: 'scope'}, 
                  {label: 'Onboarding Date', key: 'onboardingDate'}, 
                  {label: 'Status', key: 'api_status'}, 
                  {label: 'Domain', key: 'domain'}, 
                  {label: 'Access', key: 'access'}, 
                  {label: 'CDMID', key: 'cdmid'}, 
                  {label: 'Actions', key: null}
                ];
            case 'Customer':
                return [
                  {label: 'Customer Name', key: 'name'}, 
                  {label: 'Type', key: 'type'}, 
                  {label: 'Region', key: 'region'}, 
                  {label: 'Exposure', key: 'exposure'}, 
                  {label: 'Status', key: 'status'}, 
                  {label: 'Actions', key: null}
                ];
            default:
                return [
                  {label: 'Name', key: 'name'}, 
                  {label: 'Status', key: 'status'}, 
                  {label: 'Actions', key: null}
                ];
        }
    };

    const renderRow = (item, index) => {
        return (
            <>
                {activeTab === 'TPP' && (
                    <>
                        <td className="px-6 py-4 font-mono text-xs text-primary-orange font-bold uppercase">{item.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.name}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.type}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">{item.openBankingType}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">{item.email}</td>
                        <td className="px-6 py-4">
                            <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                                {item.access}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">{item.onboardingDate}</td>
                        <td className="px-6 py-4">
                             <StatusBadge status={item.status} />
                        </td>
                    </>
                )}
                {activeTab === 'Products' && (
                    <>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.product_name || item.name}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                item.scope === 'Both' ? 'bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                                item.scope === 'OF' ? 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                                'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            }`}>
                                {item.scope || 'OB'}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">{item.onboardingDate || '2024-02-20'}</td>
                        <td className="px-6 py-4">
                             <StatusBadge status={item.status} />
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">{item.domain || 'Banking'}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">{item.subdomain || 'Retail'}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs font-bold">{item.access || 'Full'}</td>
                    </>
                )}
                {activeTab === 'APIs' && (
                    <>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.api_name || item.name}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                item.scope === 'Both' ? 'bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' :
                                item.scope === 'OF' ? 'bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' :
                                'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            }`}>
                                {item.scope || 'OB'}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">{item.onboardingDate || '2024-02-25'}</td>
                        <td className="px-6 py-4">
                             <StatusBadge status={item.api_status || item.status} />
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">{item.domain || 'BFSI'}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs font-bold">{item.access || 'Full'}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-mono text-xs">{item.cdmid || (item.scope === 'OB' ? 'N/A' : 'CDM-882')}</td>
                    </>
                )}
                {activeTab === 'Customer' && (
                    <>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.name}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.type}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.region}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.exposure}</td>
                         <td className="px-6 py-4">
                             <StatusBadge status={item.status} />
                        </td>
                    </>
                )}
            </>
        );
    };

    const actions = [
        {
            icon: Eye,
            onClick: onView,
            title: "View Details",
            className: "text-gray-400 hover:text-blue-500"
        },
        ...(activeTab === 'TPP' && context === 'OF' ? [{
            icon: FilePlus,
            onClick: onAddFields,
            title: "Add Fields",
            className: "text-gray-400 hover:text-green-500"
        }] : []),
        {
            icon: Pencil,
            onClick: onEdit,
            title: "Edit",
            className: "text-gray-400 hover:text-primary-orange"
        }
    ];

    return (
        <DataTable 
            headers={getHeaders()}
            data={data}
            renderRow={renderRow}
            actions={actions}
            emptyMessage={`No records found for ${activeTab}`}
            pagination={{
                currentPage: currentPage,
                totalItems: totalItems,
                onPageChange: onPageChange,
                itemsPerPage: 10
            }}
        />
    );
};

const StatusBadge = ({ status }) => {
    const getStyles = () => {
        switch (status) {
            case "Active":
            case "LAUNCHED":
                return "bg-green-100 text-green-600";
            case "Pending":
            case "PENDING_LAUNCH":
                return "bg-yellow-100 text-yellow-600";
            case "Suspended":
                return "bg-red-100 text-red-600";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    return (
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStyles()}`}>
            {status?.replace('_', ' ') || 'N/A'}
        </span>
    );
};

export default ProvisioningTable;
