import React from 'react';
import { Lock } from 'lucide-react';

const AccessDenied = ({ 
    title = "Access Denied", 
    message = "You don't have permission to access this resource. Please contact your administrator for access." 
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-white shadow-sm dark:!bg-[#2F3349]">
            <Lock size={60} className="text-5xl mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-gray-400 text-center">{message}</p>
        </div>
    );
};

export default AccessDenied;
