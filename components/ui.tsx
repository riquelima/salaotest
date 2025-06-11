
import React, { ReactNode, useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from './icons'; 
import { Theme } from '../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyle = "font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const lightModeColors = {
    primary: "bg-[#8B5CF6] hover:bg-[#7C3AED] text-white focus:ring-[#7C3AED] focus:ring-offset-[#F9FAFB]",
    secondary: "bg-[#E5E7EB] hover:bg-[#D1D5DB] text-[#1F2937] focus:ring-[#D1D5DB] focus:ring-offset-[#F9FAFB]",
    danger: "bg-[#F87171] hover:bg-[#EF4444] text-white focus:ring-[#EF4444] focus:ring-offset-[#F9FAFB]",
    ghost: "bg-transparent hover:bg-[#8B5CF6]/10 text-[#8B5CF6] focus:ring-[#8B5CF6]/30 focus:ring-offset-[#F9FAFB]",
  };

  // Dark mode colors are now handled by Tailwind's dark: prefix
  const variantStyles = {
    primary: `${lightModeColors.primary} dark:bg-[#8B5CF6] dark:hover:bg-[#7C3AED] dark:text-white dark:focus:ring-[#7C3AED] dark:focus:ring-offset-[#1E1E2F]`,
    secondary: `${lightModeColors.secondary} dark:bg-[#374151] dark:hover:bg-[#4B5563] dark:text-[#F4F4F5] dark:focus:ring-[#4B5563] dark:focus:ring-offset-[#1E1E2F]`,
    danger: `${lightModeColors.danger} dark:bg-[#F87171] dark:hover:bg-[#EF4444] dark:text-white dark:focus:ring-[#EF4444] dark:focus:ring-offset-[#1E1E2F]`,
    ghost: `${lightModeColors.ghost} dark:bg-transparent dark:hover:bg-[#8B5CF6]/20 dark:text-[#A78BFA] dark:focus:ring-[#A78BFA]/40 dark:focus:ring-offset-[#1E1E2F]`,
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, error, className, type = "text", ...props }) => {
  const baseInputStyle = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm transition-colors duration-300";
  const themeStyle = "bg-white dark:bg-[#2C2C3B] border-[#E5E7EB] dark:border-[#4B5563] placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:ring-[#8B5CF6] focus:border-[#8B5CF6] text-[#111827] dark:text-[#F4F4F5]";
  const errorStyle = "border-[#F87171] focus:ring-[#F87171] focus:border-[#F87171]";
  const labelStyle = "text-[#374151] dark:text-[#D1D5DB]";
  
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className={`block text-sm font-medium ${labelStyle}`}>{label}</label>}
      <input
        id={id}
        type={type}
        className={`${baseInputStyle} ${themeStyle} ${error ? errorStyle : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[#F87171] dark:text-[#FCA5A5]">{error}</p>}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, id, error, className, ...props }) => {
  const baseInputStyle = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm transition-colors duration-300";
  const themeStyle = "bg-white dark:bg-[#2C2C3B] border-[#E5E7EB] dark:border-[#4B5563] placeholder-[#6B7280] dark:placeholder-[#9CA3AF] focus:ring-[#8B5CF6] focus:border-[#8B5CF6] text-[#111827] dark:text-[#F4F4F5]";
  const errorStyle = "border-[#F87171] focus:ring-[#F87171] focus:border-[#F87171]";
  const labelStyle = "text-[#374151] dark:text-[#D1D5DB]";
  
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className={`block text-sm font-medium ${labelStyle}`}>{label}</label>}
      <textarea
        id={id}
        className={`${baseInputStyle} ${themeStyle} ${error ? errorStyle : ''} ${className}`}
        rows={3}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-[#F87171] dark:text-[#FCA5A5]">{error}</p>}
    </div>
  );
};


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 10); 
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false); 
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); 
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) {
    return null;
  }

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div 
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4 
        bg-black transition-opacity duration-300 ease-in-out
        ${isVisible ? 'bg-opacity-50 dark:bg-opacity-70' : 'bg-opacity-0'}
      `}
      onClick={onClose} 
    >
      <div 
        className={`
          bg-white dark:bg-[#2C2C3B] rounded-xl shadow-xl p-6 w-full ${sizeClasses[size]}
          transform transition-all duration-300 ease-in-out
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
        `}
        onClick={(e) => e.stopPropagation()} 
      >
        {title && <h3 className="text-xl font-semibold text-[#111827] dark:text-[#F4F4F5] mb-4">{title}</h3>}
        <div>{children}</div>
      </div>
    </div>
  );
};


interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const baseStyle = "rounded-xl shadow-sm p-4 transition-all duration-300 ease-in-out";
  const themeStyle = "bg-white dark:bg-[#2C2C3B] border border-[#E5E7EB] dark:border-[#374151]";
  const hoverStyle = onClick ? "hover:shadow-md cursor-pointer" : "";

  return (
    <div className={`${baseStyle} ${themeStyle} ${hoverStyle} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

interface ToggleSwitchProps {
  isOn: boolean;
  handleToggle: () => void;
  onIcon?: ReactNode;
  offIcon?: ReactNode;
  label?: string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isOn, handleToggle, onIcon, offIcon, label }) => {
  const labelStyle = "text-[#374151] dark:text-[#D1D5DB]";
  return (
    <label htmlFor="toggle-switch" className="flex items-center cursor-pointer select-none">
      {label && <span className={`mr-3 text-sm font-medium ${labelStyle}`}>{label}</span>}
      <div className="relative">
        <input type="checkbox" id="toggle-switch" className="sr-only" checked={isOn} onChange={handleToggle} />
        <div className={`block w-14 h-8 rounded-full transition-colors ${isOn ? 'bg-[#8B5CF6]' : 'bg-[#E5E7EB] dark:bg-[#4B5563]'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform flex items-center justify-center ${isOn ? 'transform translate-x-6' : ''}`}>
          {isOn ? onIcon : offIcon}
        </div>
      </div>
    </label>
  );
};

export const ThemeToggleButton: React.FC<{ theme: Theme; toggleTheme: () => void }> = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-[#E5E7EB]/80 dark:hover:bg-[#374151]/80 transition-colors duration-300"
      aria-label={theme === 'dark' ? "Mudar para tema claro" : "Mudar para tema escuro"}
    >
      {theme === 'dark' ? <SunIcon className="w-6 h-6 text-[#FBBF24]" /> : <MoonIcon className="w-6 h-6 text-[#8B5CF6]" />}
    </button>
  );
};

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, id, error, className, options, ...props }) => {
  const baseSelectStyle = "mt-1 block w-full pl-3 pr-10 py-2 text-base border rounded-md shadow-sm focus:outline-none sm:text-sm transition-colors duration-300";
  const themeStyle = "bg-white dark:bg-[#2C2C3B] border-[#E5E7EB] dark:border-[#4B5563] focus:ring-[#8B5CF6] focus:border-[#8B5CF6] text-[#111827] dark:text-[#F4F4F5]";
  const errorStyle = "border-[#F87171] focus:ring-[#F87171] focus:border-[#F87171]";
  const labelStyle = "text-[#374151] dark:text-[#D1D5DB]";

  return (
    <div className="w-full">
      {label && <label htmlFor={id} className={`block text-sm font-medium ${labelStyle}`}>{label}</label>}
      <select
        id={id}
        className={`${baseSelectStyle} ${themeStyle} ${error ? errorStyle : ''} ${className}`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value} className="dark:bg-[#2C2C3B] dark:text-[#F4F4F5]">{option.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-[#F87171] dark:text-[#FCA5A5]">{error}</p>}
    </div>
  );
};
