import React, { useContext } from 'react';
import { ThemeContext } from '../common/ThemeContext';
import { Eye, Pencil } from 'lucide-react';
import DataTable from '../common/DataTable';

const ProvisioningTable = ({ data, activeTab, onEdit, onView, totalItems, currentPage, onPageChange }) => {
    const { theme } = useContext(ThemeContext);

    const getHeaders = () => {
        switch (activeTab) {
            case 'TPP':
                return ['Tpp Name', 'Type', 'Region', 'Status', 'Open Banking', 'Actions'];
            case 'Products':
                return ['Product Name', 'Type', 'Exposure', 'Status', 'Actions'];
            case 'APIs':
                return ['API Name', 'Type', 'Exposure', 'Status', 'Actions'];
            case 'Customer':
                return ['Customer Name', 'Type', 'Region', 'Exposure', 'Status', 'Actions'];
            default:
                return ['Name', 'Status', 'Actions'];
        }
    };

    const renderRow = (item, index) => {
        return (
            <>
                {activeTab === 'TPP' && (
                    <>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.name}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.type}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.region}</td>
                        <td className="px-6 py-4">
                             <StatusBadge status={item.status} />
                        </td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.openBankingType}</td>
                    </>
                )}
                {activeTab === 'Products' && (
                    <>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.name}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.type}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.exposure}</td>
                         <td className="px-6 py-4">
                             <StatusBadge status={item.status} />
                        </td>
                    </>
                )}
                {activeTab === 'APIs' && (
                    <>
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.name}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.type}</td>
                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.exposure}</td>
                         <td className="px-6 py-4">
                             <StatusBadge status={item.status} />
                        </td>
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

const StatusBadge = ({ status }) => (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        status === "Active" ? "bg-green-100 text-green-600" :
        status === "Pending" ? "bg-yellow-100 text-yellow-600" :
        "bg-red-100 text-red-600"
    }`}>
        {status}
    </span>
);

export default ProvisioningTable;
