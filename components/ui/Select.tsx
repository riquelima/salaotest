
import React, { SelectHTMLAttributes } from 'react';
import { LIGHT_THEME_CONFIG, DARK_THEME_CONFIG } from '../../constants';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
}

const Select: React.FC<SelectProps> = ({ label, id, error, options, className, ...props }) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={`w-full ${className}`}>
      {label && <label htmlFor={selectId} className={`block text-sm font-medium text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}] mb-1`}>{label}</label>}
      <select
        id={selectId}
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
          appearance-none
        `}
        {...props}
      >
        {options.map(option => (
          <option 
            key={option.value} 
            value={option.value} 
            className={`bg-[${LIGHT_THEME_CONFIG.cardBackground}] dark:bg-[${DARK_THEME_CONFIG.cardBackground}] text-[${LIGHT_THEME_CONFIG.textPrimary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}]`}
          >
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-400 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default Select;
