import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { Database, AlertCircle, Info, Search } from 'lucide-react';
import Button from './Button';

/**
 * EmptyState Component
 * A premium, flexible empty state display for lists, tables, and search results.
 * 
 * Props:
 *   icon: Lucide icon component
 *   title: Main title text
 *   description: Supporting description text
 *   action: { label, icon, onClick } - Primary action button
 *   secondaryAction: { label, icon, onClick } - Secondary action button
 *   variant: 'large' | 'compact' | 'table'
 *   searchTerm: if provided, displays a search-specific empty state
 */
const EmptyState = ({ 
  icon: Icon = Database, 
  title, 
  description, 
  action, 
  secondaryAction,
  variant = 'large',
  searchTerm,
  className = ""
}) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const isSearch = !!searchTerm;
  const DisplayIcon = isSearch ? Search : Icon;
  const displayTitle = isSearch ? `No results for "${searchTerm}"` : (title || "No data available");
  const displayDesc = isSearch 
    ? "Check the spelling or try a more general search term." 
    : (description || "There's currently no information to display in this section.");

  if (variant === 'table') {
    return (
      <div className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}>
        <div className={`p-4 rounded-full mb-4 ${isDark ? 'bg-white/5 text-gray-500' : 'bg-gray-50 text-gray-400'}`}>
          <DisplayIcon size={32} />
        </div>
        <h3 className={`text-sm font-bold mb-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{displayTitle}</h3>
        <p className={`text-xs max-w-xs mx-auto ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{displayDesc}</p>
        
        {(action || secondaryAction) && (
          <div className="flex items-center gap-3 mt-6">
            {secondaryAction && (
              <Button 
                variant="secondary" 
                size="sm"
                icon={secondaryAction.icon ? <secondaryAction.icon size={14} /> : null} 
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.label}
              </Button>
            )}
            {action && (
              <Button 
                variant="primary" 
                size="sm"
                icon={action.icon ? <action.icon size={14} /> : null} 
                onClick={action.onClick}
              >
                {action.label}
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  const isCompact = variant === 'compact';

  return (
    <div className={`flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500 ${isCompact ? 'py-10' : 'py-20'} ${className}`}>
      <div className={`${isCompact ? 'w-16 h-16' : 'w-20 h-20'} rounded-3xl flex items-center justify-center mb-6 relative group`}>
        {/* Glow effect */}
        <div className={`absolute inset-0 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity bg-primary-orange`} />
        
        <div className={`relative w-full h-full rounded-3xl flex items-center justify-center border ${
          isDark 
            ? 'bg-secondary-dark-bg/80 border-white/10 text-primary-orange' 
            : 'bg-white border-gray-100 text-primary-orange shadow-sm'
        }`}>
          <DisplayIcon size={isCompact ? 28 : 36} />
        </div>
      </div>

      <h2 className={`${isCompact ? 'text-lg' : 'text-xl'} font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {displayTitle}
      </h2>
      
      <p className={`text-sm max-w-sm mx-auto mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {displayDesc}
      </p>

      {(action || secondaryAction) && (
        <div className="flex items-center gap-4">
          {secondaryAction && (
            <Button 
              variant="secondary" 
              icon={secondaryAction.icon ? <secondaryAction.icon size={18} /> : null} 
              onClick={secondaryAction.onClick}
              className="px-6"
            >
              {secondaryAction.label}
            </Button>
          )}
          {action && (
            <Button 
              variant="primary" 
              icon={action.icon ? <action.icon size={18} /> : null} 
              onClick={action.onClick}
              className="px-8 shadow-lg shadow-primary-orange/20"
            >
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
