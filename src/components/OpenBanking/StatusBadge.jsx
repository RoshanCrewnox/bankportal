import React from 'react';

const StatusBadge = ({ status }) => {
    const styles = {
        Active: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
        Suspended: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        Revoked: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        Expired: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    };
    return (
        <span className={`inline-flex items-center justify-center px-2.5 h-5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${styles[status] || styles.Active}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
