import React from 'react';
import StatusBadge from '../StatusBadge';
import DataTable from '../../common/DataTable';

const AuditTable = ({ auditLogs, isDark }) => {
  const headers = [
    {label: 'Consent ID', key: 'id'},
    {label: 'TPP ID', key: 'tpp'},
    {label: 'Asset Type', key: 'type'},
    {label: 'Asset Name', key: 'details'},
    {label: 'Purpose', key: 'purpose'},
    {label: 'Access Type', key: 'accessType'},
    {label: 'Lifecycle', key: 'lifecycle'},
    {label: 'Status', key: 'status'},
    {label: 'Validity', key: 'validity'},
    {label: 'Duration', key: 'duration'},
    {label: 'Requester', key: 'requester'},
    {label: 'Approver', key: 'approver'}
  ];

  const renderRow = (log) => (
    <>
      <td className="px-6 py-4 font-mono text-primary-orange font-bold text-xs capitalize whitespace-nowrap">{log.id}</td>
      <td className="px-6 py-4 font-bold text-gray-700 dark:text-gray-300 text-xs whitespace-nowrap">{log.tpp}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border inline-block whitespace-nowrap ${
          log.type === 'API' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : 'bg-purple-500/10 text-purple-500 border-purple-500/20'
        }`}>
          {log.type}
        </span>
      </td>
      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-medium text-xs whitespace-nowrap">{log.details}</td>
      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs italic whitespace-nowrap">{log.purpose}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 py-1 rounded bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-[10px] font-bold italic inline-block whitespace-nowrap">
            {log.accessType || 'Full Access'}
        </span>
      </td>
      <td className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-200 text-xs whitespace-nowrap">{log.lifecycle}</td>
      <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={log.status} /></td>
      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 italic text-xs whitespace-nowrap">{log.validity}</td>
      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 font-bold text-xs whitespace-nowrap">{log.duration}</td>
      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap">{log.requester}</td>
      <td className="px-6 py-4 text-left font-black text-primary-orange/80 text-xs whitespace-nowrap">{log.approver}</td>
    </>
  );

  return (
    <div className="space-y-4 animate-in slide-in-from-right duration-300 w-full overflow-hidden">
      <DataTable 
        className="custom-scrollbar pb-6 px-1"
        tableClassName="min-w-[1400px]"
        headers={headers}
        data={auditLogs}
        renderRow={renderRow}
        emptyMessage="No audit logs found"
      />
    </div>
  );
};

export default AuditTable;
