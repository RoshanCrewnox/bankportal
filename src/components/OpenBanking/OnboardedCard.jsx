import React, { useContext } from 'react';
import { ThemeContext } from '../common/ThemeContext';

const OnboardedCard = ({ title, subscribed = 0, drafts = 0, published = 0, status = 'healthy', Icon }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  
  const statusBorderMap = {
    healthy: 'border-blue-400',
    warning: 'border-yellow-400',
    critical: 'border-red-400'
  };

  return (
    <div className={`rounded-2xl p-4 border-l-4 ${statusBorderMap[status] || 'border-blue-400'} border-y border-r ${isDark ? 'border-gray-700 bg-secondary-dark-bg' : 'border-gray-200 bg-white'} transition-all hover:translate-x-1 cursor-pointer group`}>
       <div className="flex items-center justify-between mb-4">
          <div className="text-start font-bold text-xs text-gray-400 uppercase tracking-widest">{title}</div>
          {Icon && <Icon className="w-5 h-5 text-gray-400 group-hover:text-primary-orange transition-colors" />}
       </div>
       
       <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col">
             <span className="text-xl font-bold text-gray-900 dark:text-white leading-none">{subscribed}</span>
             <span className="text-[10px] text-gray-500 uppercase font-semibold mt-1">Subscribed</span>
          </div>
          <div className="flex flex-col border-x border-gray-100 dark:border-white/5 px-2">
             <span className="text-xl font-bold text-gray-900 dark:text-white leading-none">{drafts}</span>
             <span className="text-[10px] text-gray-500 uppercase font-semibold mt-1">Drafts</span>
          </div>
          <div className="flex flex-col pl-2">
             <span className="text-xl font-bold text-gray-900 dark:text-white leading-none">{published}</span>
             <span className="text-[10px] text-gray-500 uppercase font-semibold mt-1">Published</span>
          </div>
       </div>
    </div>
  );
};

export default OnboardedCard;
