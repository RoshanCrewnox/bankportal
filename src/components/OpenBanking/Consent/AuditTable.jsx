import React from 'react';
import StatusBadge from '../StatusBadge';

const AuditTable = ({ auditLogs, isDark }) => {
  return (
    <div className="space-y-4 animate-in slide-in-from-right duration-300">
      <div className={`rounded-2xl border overflow-hidden ${isDark ? 'border-white/5 bg-white/2' : 'border-gray-100 bg-white shadow-sm'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${isDark ? 'bg-white/5' : 'bg-gray-50'} border-b border-gray-100 dark:border-white/5`}>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Consent ID</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">TPP ID</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Asset Type</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Details</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Lifecycle</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Validity</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Duration</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Requester</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Approver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {auditLogs.map((log, i) => (
                <tr key={i} className={`text-[11px] transition-colors ${isDark ? 'hover:bg-white/2' : 'hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 font-mono text-primary-orange font-bold uppercase">{log.id}</td>
                  <td className="px-6 py-4 font-bold dark:text-gray-300">{log.tpp}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase border ${
                      log.type === 'API' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                    }`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-medium">{log.details}</td>
                  <td className="px-6 py-4 font-bold text-gray-700 dark:text-gray-200">{log.lifecycle}</td>
                  <td className="px-6 py-4"><StatusBadge status={log.status} /></td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 italic">{log.validity}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-bold">{log.duration}</td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{log.requester}</td>
                  <td className="px-6 py-4 text-right font-black text-primary-orange/80">{log.approver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuditTable;
