import React from 'react';

/**
 * Reusable Button component for consistent styling across the app.
 * 
 * @param {string} variant - 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
 * @param {string} size - 'sm' | 'md' | 'lg'
 * @param {React.ReactNode} children - Button content
 * @param {React.ReactNode} icon - Optional icon element (rendered before text)
 * @param {boolean} disabled - Disabled state
 * @param {string} className - Additional classes
 * @param {object} props - All other props passed to button element
 */
const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  icon, 
  disabled = false, 
  className = '', 
  ...props 
}) => {
  const baseClass = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

  const variants = {
    primary: 'bg-primary-orange hover:bg-primary-orange/90 text-white shadow-lg shadow-primary-orange/20',
    secondary: 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10',
    outline: 'border border-primary-orange text-primary-orange hover:bg-primary-orange/10',
    ghost: 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5',
    danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-bold gap-1.5',
    md: 'px-4 py-2 text-sm font-semibold gap-2',
    lg: 'px-6 py-2.5 text-sm font-semibold gap-2',
  };

  return (
    <button
      className={`${baseClass} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
