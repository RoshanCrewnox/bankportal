import React, { useContext } from 'react';
import { ThemeContext } from '../../components/common/ThemeContext';
import { Settings } from 'lucide-react';
import DataMasking from './components/DataMasking';

const Configuration = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className=" min-h-screen">
      <div className="flex items-center gap-3 mb-8">
        <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-orange-500/10 text-orange-500' : 'bg-orange-100 text-orange-600'}`}>
          <Settings size={28} />
        </div>
        <div>
          <h1 className={`text-3xl font-extrabold tracking-tight ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            System Configuration
          </h1>
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            Manage global settings, security policies, and data protection rules
          </p>
        </div>
      </div>

      <div className="pt-2 mt-5">
        <DataMasking />
      </div>
    </div>
  );
};

export default Configuration;
