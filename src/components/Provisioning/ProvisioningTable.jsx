import React, { useContext } from 'react';
import { ThemeContext } from '../common/ThemeContext';
import { Eye, Pencil } from 'lucide-react';

const ProvisioningTable = ({ data, activeTab, onEdit, onView }) => {
    const { theme } = useContext(ThemeContext);

    // Dynamic headers based on active tab
    const getHeaders = () => {
        switch (activeTab) {
            case 'TPP':
                return ['TPP Name', 'Type', 'Region', 'Status', 'Open Banking', 'Actions'];
            case 'Products':
                return ['Product Name', 'Type', 'Sandbox', 'Exposure', 'Status', 'Actions'];
            case 'APIs':
                return ['API Name', 'Type', 'Sandbox', 'Exposure', 'Status', 'Actions'];
            case 'Customer':
                return ['Customer Name', 'Type', 'Region', 'Exposure', 'Status', 'Actions'];
            default:
                return ['Name', 'Status', 'Actions'];
        }
    };

    const headers = getHeaders();

    return (
        <div className={`overflow-x-auto rounded-xl border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200 bg-white'}`}>
            <table className="w-full text-left">
                <thead>
                    <tr className={`border-b ${theme === 'dark' ? 'border-gray-700 bg-darkbg' : 'border-gray-100 bg-gray-50'}`}>
                        {headers.map((header, index) => (
                            <th key={index} className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700 bg-secondary-dark-bg' : 'divide-gray-100'}`}>
                    {data.map((item, index) => (
                        <tr key={index} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group`}>
                            {/* TPP Columns */}
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

                             {/* Products Columns */}
                             {activeTab === 'Products' && (
                                <>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.name}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.type}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.sandbox}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.exposure}</td>
                                     <td className="px-6 py-4">
                                         <StatusBadge status={item.status} />
                                    </td>
                                </>
                            )}

                             {/* APIs Columns */}
                             {activeTab === 'APIs' && (
                                <>
                                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{item.name}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.type}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.sandbox}</td>
                                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{item.exposure}</td>
                                     <td className="px-6 py-4">
                                         <StatusBadge status={item.status} />
                                    </td>
                                </>
                            )}
                            
                             {/* Customer Columns */}
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
                            
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => onView(item)} 
                                        className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors"
                                        title="View Details"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => onEdit(item)} 
                                        className="p-1.5 text-gray-400 hover:text-primary-orange transition-colors"
                                        title="Edit"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={headers.length} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                No records found for {activeTab}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
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
