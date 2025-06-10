
import React, { TextareaHTMLAttributes } from 'react';
import { LIGHT_THEME_CONFIG, DARK_THEME_CONFIG } from '../../constants';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea: React.FC<TextareaProps> = ({ label, id, error, className, ...props }) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={`w-full ${className}`}>
      {label && <label htmlFor={textareaId} className={`block text-sm font-medium text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}] mb-1`}>{label}</label>}
      <textarea
        id={textareaId}
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
          resize-vertical min-h-[80px]
        `}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default Textarea;