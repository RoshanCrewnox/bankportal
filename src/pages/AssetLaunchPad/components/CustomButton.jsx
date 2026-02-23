import React from "react";

const CustomButton = ({ children, className = "", onClick, variant = "default", size = "sm", ...props }) => {
    const baseClasses =
        "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
    const variantClasses =
        variant === "ghost"
            ? "hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300"
            : "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
    const sizeClasses = size === "sm" ? "px-3 py-2 text-sm" : "px-4 py-2 text-sm"

    return (
        <button className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`} onClick={onClick} {...props}>
            {children}
        </button>
    )
}

export default CustomButton;
