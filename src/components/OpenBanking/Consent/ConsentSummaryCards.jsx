import React from 'react';
import { Shield, CheckCircle, Clock, XCircle } from 'lucide-react';

const ConsentSummaryCards = ({ stats, isDark }) => {
  const cards = [
    { label: 'Total', value: stats.total, icon: <Shield className="w-4 h-4" />, color: isDark ? 'text-gray-400' : 'text-gray-500' },
    { label: 'Active', value: stats.active, icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-500' },
    { label: 'Pending', value: stats.pending, icon: <Clock className="w-4 h-4" />, color: 'text-amber-500' },
    { label: 'Revoked', value: stats.revoked, icon: <XCircle className="w-4 h-4" />, color: 'text-red-500' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, i) => (
        <div key={i} className={`p-5 rounded-xl border ${isDark ? 'bg-secondary-dark-bg/40 border-white/5' : 'bg-white border-gray-100 shadow-sm'} flex flex-col gap-3 transition-all hover:scale-[1.02] hover:shadow-md`}>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">{card.label}</span>
            <div className={`${card.color}`}>
              {card.icon}
            </div>
          </div>
          <div className="text-2xl font-bold dark:text-white leading-none tracking-tight">
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConsentSummaryCards;
