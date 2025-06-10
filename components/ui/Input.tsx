
import React, { InputHTMLAttributes } from 'react';
import { LIGHT_THEME_CONFIG, DARK_THEME_CONFIG } from '../../constants';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, id, error, icon, className, ...props }) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={`w-full ${className}`}>
      {label && <label htmlFor={inputId} className={`block text-sm font-medium text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}] mb-1`}>{label}</label>}
      <div className="relative">
        {icon && <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.iconColor}]`}>{icon}</div>}
        <input
          id={inputId}
          className={`
            w-full px-3 py-2 rounded-md
            bg-[${LIGHT_THEME_CONFIG.cardBackground}] dark:bg-[${DARK_THEME_CONFIG.cardBackground}] 
            text-[${LIGHT_THEME_CONFIG.textPrimary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}] 
            border 
            ${error ? 
              `border-red-500 dark:border-red-400 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500 dark:focus:ring-red-400` : 
              `border-[${LIGHT_THEME_CONFIG.borderColor}] dark:border-[${DARK_THEME_CONFIG.borderColor}] focus:border-[${LIGHT_THEME_CONFIG.focusRing}] dark:focus:border-[${DARK_THEME_CONFIG.focusRing}] focus:ring-[${LIGHT_THEME_CONFIG.focusRing}] dark:focus:ring-[${DARK_THEME_CONFIG.focusRing}]`}
            focus:outline-none focus:ring-1 
            transition-colors duration-200 ease-in-out
            shadow-sm
            ${icon ? 'pl-10' : ''}
          `}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default Input;
