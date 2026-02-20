import React from 'react';
import StatusBadge from '../StatusBadge';
import DataTable from '../../common/DataTable';

const AuditTable = ({ auditLogs, isDark }) => {
  const headers = [
    'Consent ID',
    'TPP ID',
    'Type',
    'Details',
    'Lifecycle',
    'Status',
    'Validity',
    'Duration',
    'Requester',
    'Approver'
  ];

  const renderRow = (log) => (
    <>
      <td className="px-6 py-4 font-mono text-primary-orange font-bold text-xs capitalize">{log.id}</td>
      <td className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300 text-xs">{log.tpp}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
          log.type === 'API' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-purple-500/10 text-purple-500 border-purple-500/20'
        }`}>
          {log.type}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-medium text-xs">{log.details}</td>
      <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200 text-xs">{log.lifecycle}</td>
      <td className="px-6 py-4"><StatusBadge status={log.status} /></td>
      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 italic text-xs">{log.validity}</td>
      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-bold text-xs">{log.duration}</td>
      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs">{log.requester}</td>
      <td className="px-6 py-4 text-right font-black text-primary-orange/80 text-xs">{log.approver}</td>
    </>
  );

  return (
    <div className="space-y-4 animate-in slide-in-from-right duration-300">
      <DataTable 
        headers={headers}
        data={auditLogs}
        renderRow={renderRow}
        emptyMessage="No audit logs found"
      />
    </div>
  );
};

export default AuditTable;
