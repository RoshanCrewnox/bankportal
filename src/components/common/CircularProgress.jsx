import React from 'react';

/**
 * CircularProgress - Presentational helper component for table cells.
 * Mandatory Rules: Presentational only, no business logic.
 */
const CircularProgress = ({ value, total, size = 36, color = "#3b82f6" }) => {
  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const percentage = total > 0 ? Math.min((value / total) * 100, 100) : 0;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          className="text-gray-200 dark:text-gray-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold text-white drop-shadow-[0_0_2px_rgba(0,0,0,0.8)]">
          {value}
        </span>
      </div>
    </div>
  );
};

export default CircularProgress;
