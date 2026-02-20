import React, { useState } from 'react';

const AuthorizedIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 12L11 14L15 9.99999M20 12C20 16.4611 14.54 19.6937 12.6414 20.683C12.4361 20.79 12.3334 20.8435 12.191 20.8712C12.08 20.8928 11.92 20.8928 11.809 20.8712C11.6666 20.8435 11.5639 20.79 11.3586 20.683C9.45996 19.6937 4 16.4611 4 12V8.21759C4 7.41808 4 7.01833 4.13076 6.6747C4.24627 6.37113 4.43398 6.10027 4.67766 5.88552C4.9535 5.64243 5.3278 5.50207 6.0764 5.22134L11.4382 3.21067C11.6461 3.13271 11.75 3.09373 11.857 3.07827C11.9518 3.06457 12.0482 3.06457 12.143 3.07827C12.25 3.09373 12.3539 3.13271 12.5618 3.21067L17.9236 5.22134C18.6722 5.50207 19.0465 5.64243 19.3223 5.88552C19.566 6.10027 19.7537 6.37113 19.8692 6.6747C20 7.01833 20 7.41808 20 8.21759V12Z" stroke="#4ADE80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const UnauthorizedIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.5 9.50011L14.5 14.5001M14.5 9.50011L9.5 14.5001M20 12.0001C20 16.4612 14.54 19.6939 12.6414 20.6831C12.4361 20.7901 12.3334 20.8436 12.191 20.8713C12.08 20.8929 11.92 20.8929 11.809 20.8713C11.6666 20.8436 11.5639 20.7901 11.3586 20.6831C9.45996 19.6939 4 16.4612 4 12.0001V8.21772C4 7.4182 4 7.01845 4.13076 6.67482C4.24627 6.37126 4.43398 6.10039 4.67766 5.88564C4.9535 5.64255 5.3278 5.50219 6.0764 5.22146L11.4382 3.21079C11.6461 3.13283 11.75 3.09385 11.857 3.07839C11.9518 3.06469 12.0482 3.06469 12.143 3.07839C12.25 3.09385 12.3539 3.13283 12.5618 3.21079L17.9236 5.22146C18.6722 5.50219 19.0465 5.64255 19.3223 5.88564C19.566 6.10039 19.7537 6.37113 19.8692 6.67482C20 7.01845 20 7.4182 20 8.21772V12.0001Z" stroke="#F87171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const HitsStatsSummary = ({ theme, data }) => {
    const isDark = theme === 'dark';
    const [hoveredSegment, setHoveredSegment] = useState(null);

    // Provide default data if none provided
    const stats = data || {
        total: 1250,
        success: 1100,
        failed: 150,
        successPercentage: 88,
        failurePercentage: 12,
        authorizedHits: 1050,
        unauthorizedHits: 200
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="relative shrink-0" style={{ width: 140, height: 140 }}>
                    <svg width="140" height="140" className="transform -rotate-90">
                        <defs>
                            <linearGradient id="successGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#86EFAC" />
                                <stop offset="100%" stopColor="#34D399" />
                            </linearGradient>
                            <linearGradient id="failureGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#FECACA" />
                                <stop offset="100%" stopColor="#F87171" />
                            </linearGradient>
                        </defs>
                        <circle cx="70" cy="70" r="56" stroke={isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0,0,0,0.05)"} strokeWidth="10" fill="none" />
                        <circle
                            cx="70" cy="70" r="56"
                            stroke="url(#successGradient)"
                            strokeWidth="10" fill="none"
                            strokeDasharray="351.86"
                            strokeDashoffset={351.86 - (351.86 * stats.successPercentage / 100)}
                            strokeLinecap="round"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredSegment('success')}
                            onMouseLeave={() => setHoveredSegment(null)}
                        />
                        <circle cx="70" cy="70" r="40" stroke={isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0,0,0,0.05)"} strokeWidth="8" fill="none" />
                        <circle
                            cx="70" cy="70" r="40"
                            stroke="url(#failureGradient)"
                            strokeWidth="8" fill="none"
                            strokeDasharray="251.2"
                            strokeDashoffset={251.2 - (251.2 * stats.failurePercentage / 100)}
                            strokeLinecap="round"
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onMouseEnter={() => setHoveredSegment('failure')}
                            onMouseLeave={() => setHoveredSegment(null)}
                        />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <div className="text-xl font-bold text-gray-900 dark:text-white leading-none">
                            {hoveredSegment === 'success' ? `${stats.successPercentage}%` : hoveredSegment === 'failure' ? `${stats.failurePercentage}%` : stats.total}
                        </div>
                        <div className="text-xs text-gray-500 font-semibold mt-1">
                            {hoveredSegment === 'success' ? 'Success' : hoveredSegment === 'failure' ? 'Failure' : 'Total'}
                        </div>
                    </div>
                </div>

                <div className="flex-1 ml-6">
                    <div className="mb-4">
                        <div className="text-xs text-gray-500 mb-1">Total Hits</div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white leading-none">{stats.total}</div>
                        <div className="h-px w-full bg-gray-200 dark:bg-white/10 mt-2" />
                    </div>
                    <div className="flex gap-10">
                        <div>
                            <div className="text-xs text-green-500 font-semibold mb-1">Success</div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.successPercentage}%</div>
                        </div>
                        <div>
                            <div className="text-xs text-red-500 font-semibold mb-1">Failed</div>
                            <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.failurePercentage}%</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full">
                <div className="h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-600">
                    <div className="h-full flex">
                        <div className="bg-linear-to-r from-green-400 to-green-500" style={{ width: `${stats.successPercentage}%` }}></div>
                        <div className="bg-linear-to-r from-red-400 to-red-500" style={{ width: `${stats.failurePercentage}%` }}></div>
                    </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 font-semibold mt-1">
                    <span>0%</span>
                    <span>100%</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-500/10 border border-green-500/20">
                        <AuthorizedIcon />
                    </div>
                    <div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white leading-none">{stats.authorizedHits} Hits</div>
                        <div className="text-xs text-gray-500 font-semibold mt-1">Authorized</div>
                    </div>
                </div>
                <div className="bg-gray-50 dark:bg-white/3 border border-gray-100 dark:border-white/5 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-500/10 border border-red-500/20">
                        <UnauthorizedIcon />
                    </div>
                    <div>
                        <div className="text-lg font-bold text-gray-900 dark:text-white leading-none">{stats.unauthorizedHits} Hits</div>
                        <div className="text-xs text-gray-500 font-semibold mt-1">Unauthorized</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HitsStatsSummary;
