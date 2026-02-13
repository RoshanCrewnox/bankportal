
import React, { useContext } from 'react';
import { ThemeContext } from '../common/ThemeContext';

const ProvisioningTabs = ({ activeTab, onTabChange }) => {
    const { theme } = useContext(ThemeContext);
    const tabs = ['TPP', 'Products', 'APIs', 'Customer'];

    return (
        <div className={`flex gap-1 p-1 rounded-lg ${theme === 'dark' ? 'bg-darkbg' : 'bg-gray-100'} w-fit`}>
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`
                        px-4 py-2 text-sm font-medium rounded-md transition-all duration-200
                        ${activeTab === tab
                            ? 'bg-primary-orange text-white shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 dark:bg-secondary-dark-bg'}
                    `}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

export default ProvisioningTabs;
