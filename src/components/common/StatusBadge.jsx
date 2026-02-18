import React from 'react';
import { formatStatus } from '../../utils/formatStatus';

/**
 * StatusBadge - A unified badge component for status display
 * 
 * @param {string} status - The status value to display (case-insensitive)
 * @param {string} variant - Size variant: 'sm' (default) or 'md'
 * @param {string} className - Additional CSS classes
 */

const STATUS_COLORS = {
  // Workflow States
  'SAVED': 'bg-orange-100 text-orange-800',
  'DRAFT': 'bg-orange-100 text-orange-800',
  'PENDING_LAUNCH': 'bg-yellow-100 text-yellow-800',
  'PUBLISH': 'bg-blue-100 text-blue-800',
  'PUBLISHED': 'bg-blue-100 text-blue-800',
  'LAUNCHED': 'bg-emerald-100 text-emerald-800',
  'ATTACHED': 'bg-emerald-100 text-emerald-800',
  'SUBSCRIBED': 'bg-emerald-100 text-emerald-800',
  
  // State Badges
  'ACTIVE': 'bg-green-100 text-green-800',
  'INACTIVE': 'bg-red-100 text-red-800',
  'SHARED': 'bg-green-100 text-green-800',
  'ENABLED': 'bg-green-100 text-green-800',
  'DISABLED': 'bg-gray-100 text-gray-800',
  
  // Visibility Badges
  'PUBLIC': 'bg-blue-100 text-blue-800',
  'PRIVATE': 'bg-gray-100 text-gray-800',
  
  // Commercial Type Badges
  'FREE': 'bg-green-100 text-green-800',
  'ELITE': 'bg-purple-100 text-purple-800',
  
  // Delivery/Tracking Badges
  'DELIVERED': 'bg-green-100 text-green-800',
  'PENDING': 'bg-yellow-100 text-yellow-800',
  'ON_TRACK': 'bg-green-100 text-green-800',
  'ON TRACK': 'bg-green-100 text-green-800',
  'EXCEEDED': 'bg-red-100 text-red-800',
  
  // Default fallback
  'DEFAULT': 'bg-gray-100 text-gray-800',
};

const VARIANT_CLASSES = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
};

const StatusBadge = ({ status, variant = 'sm', className = '' }) => {
  if (!status) return null;

  // Normalize status for lookup
  const normalizedStatus = String(status).toUpperCase().trim();
  
  // Get color classes - check exact match first, then fallback
  const colorClasses = STATUS_COLORS[normalizedStatus] || STATUS_COLORS['DEFAULT'];
  
  // Get size variant classes
  const sizeClasses = VARIANT_CLASSES[variant] || VARIANT_CLASSES.sm;
  
  // Format display text using existing utility
  const displayText = formatStatus ? formatStatus(status) : status;

  return (
    <span
      className={`inline-flex items-center rounded-md font-semibold whitespace-nowrap ${colorClasses} ${sizeClasses} ${className}`}
    >
      {displayText}
    </span>
  );
};

export default StatusBadge;
