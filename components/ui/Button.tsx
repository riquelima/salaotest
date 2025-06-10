
import React, { ReactNode } from 'react';
import { LIGHT_THEME_CONFIG, DARK_THEME_CONFIG } from '../../constants'; 

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  leftIcon, 
  rightIcon, 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-all duration-300 ease-in-out inline-flex items-center justify-center shadow-md hover:shadow-xl dark:shadow-md dark:shadow-black/20';
  
  let variantStyles = '';
  switch (variant) {
    case 'primary':
      variantStyles = `bg-[${LIGHT_THEME_CONFIG.primary}] hover:bg-[${LIGHT_THEME_CONFIG.primaryHover}] text-white 
                       dark:bg-[${DARK_THEME_CONFIG.primary}] dark:hover:bg-[${DARK_THEME_CONFIG.primaryHover}] dark:text-[${DARK_THEME_CONFIG.textLight}] 
                       focus:ring-[${LIGHT_THEME_CONFIG.focusRing}] dark:focus:ring-[${DARK_THEME_CONFIG.focusRing}]`;
      break;
    case 'secondary':
      variantStyles = `bg-gray-200 hover:bg-gray-300 text-gray-800 
                       dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 
                       focus:ring-gray-400 dark:focus:ring-gray-500`;
      break;
    case 'danger':
      variantStyles = `bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white 
                       focus:ring-red-500 dark:focus:ring-red-600`;
      break;
    case 'ghost':
      variantStyles = `bg-transparent hover:bg-indigo-50 text-[${LIGHT_THEME_CONFIG.primary}] border border-[${LIGHT_THEME_CONFIG.primary}]
                       dark:hover:bg-gray-700/50 dark:text-[${DARK_THEME_CONFIG.textSecondary}] dark:border-[${DARK_THEME_CONFIG.borderColor}]
                       focus:ring-[${LIGHT_THEME_CONFIG.focusRing}] dark:focus:ring-[${DARK_THEME_CONFIG.focusRing}]`;
      break;
    case 'success': 
      variantStyles = `bg-[${LIGHT_THEME_CONFIG.green}] hover:opacity-90 text-white
                       dark:bg-[${DARK_THEME_CONFIG.green}] dark:hover:opacity-90 dark:text-white 
                       focus:ring-[${LIGHT_THEME_CONFIG.green}] dark:focus:ring-[${DARK_THEME_CONFIG.green}]`;
      break;
  }

  let sizeStyles = '';
  switch (size) {
    case 'sm':
      sizeStyles = 'px-3 py-1.5 text-sm';
      break;
    case 'md':
      sizeStyles = 'px-4 py-2 text-base';
      break;
    case 'lg':
      sizeStyles = 'px-6 py-3 text-lg';
      break;
  }

  return (
    <button
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;