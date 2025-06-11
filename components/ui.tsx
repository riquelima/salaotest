import React, { ReactNode, useState } from 'react';
import { SunIcon, MoonIcon } from './icons'; 
import { Theme } from '../types';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyle = "font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const lightModeColors = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500",
    secondary: "bg-slate-200 hover:bg-slate-300 text-slate-800 focus:ring-slate-400",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500",
    ghost: "bg-transparent hover:bg-slate-200 text-slate-700 focus:ring-slate-400",
  };

  const darkModeColors = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500",
    secondary: "bg-slate-700 hover:bg-slate-600 text-slate-100 focus:ring-slate-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    ghost: "bg-transparent hover:bg-slate-700 text-purple-400 focus:ring-purple-500",
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  // Assuming theme is toggled by a class on html or body. For simplicity, we'll check html.
  // In a real app, this would come from a ThemeContext.
  const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const colors = isDarkMode ? darkModeColors : lightModeColors;

  return (
    <button
      className={`${baseStyle} ${colors[variant]} ${sizes[size]} ${className}`}
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
  const lightModeStyle = "bg-white border-slate-300 placeholder-slate-400 focus:ring-purple-500 focus:border-purple-500 text-slate-900";
  const darkModeStyle = "bg-slate-700 border-slate-600 placeholder-slate-400 focus:ring-purple-500 focus:border-purple-500 text-slate-100";
  const errorStyle = "border-red-500 focus:ring-red-500 focus:border-red-500";
  
  const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const modeStyle = isDarkMode ? darkModeStyle : lightModeStyle;

  return (
    <div className="w-full">
      {label && <label htmlFor={id} className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{label}</label>}
      <input
        id={id}
        type={type}
        className={`${baseInputStyle} ${modeStyle} ${error ? errorStyle : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, id, error, className, ...props }) => {
  const baseInputStyle = "mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm transition-colors duration-300";
  const lightModeStyle = "bg-white border-slate-300 placeholder-slate-400 focus:ring-purple-500 focus:border-purple-500 text-slate-900";
  const darkModeStyle = "bg-slate-700 border-slate-600 placeholder-slate-400 focus:ring-purple-500 focus:border-purple-500 text-slate-100";
  const errorStyle = "border-red-500 focus:ring-red-500 focus:border-red-500";

  const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const modeStyle = isDarkMode ? darkModeStyle : lightModeStyle;
  
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{label}</label>}
      <textarea
        id={id}
        className={`${baseInputStyle} ${modeStyle} ${error ? errorStyle : ''} ${className}`}
        rows={3}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>}
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
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75 transition-opacity duration-300 ease-in-out">
      <div className={`bg-slate-100 dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full ${sizeClasses[size]} transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow`}>
        {title && <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4">{title}</h3>}
        <div>{children}</div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose}>Fechar</Button>
        </div>
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
  const baseStyle = "rounded-xl shadow-lg p-6 transition-all duration-300 ease-in-out";
  const themeStyle = "bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700";
  const hoverStyle = onClick ? "hover:shadow-xl hover:scale-[1.02] cursor-pointer" : "";

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
  return (
    <label htmlFor="toggle-switch" className="flex items-center cursor-pointer select-none">
      {label && <span className="mr-3 text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>}
      <div className="relative">
        <input type="checkbox" id="toggle-switch" className="sr-only" checked={isOn} onChange={handleToggle} />
        <div className={`block w-14 h-8 rounded-full transition-colors ${isOn ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
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
      className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-300"
      aria-label={theme === 'dark' ? "Mudar para tema claro" : "Mudar para tema escuro"}
    >
      {theme === 'dark' ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-slate-700" />}
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
  const lightModeStyle = "bg-white border-slate-300 focus:ring-purple-500 focus:border-purple-500 text-slate-900";
  const darkModeStyle = "bg-slate-700 border-slate-600 focus:ring-purple-500 focus:border-purple-500 text-slate-100";
  const errorStyle = "border-red-500 focus:ring-red-500 focus:border-red-500";

  const isDarkMode = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  const modeStyle = isDarkMode ? darkModeStyle : lightModeStyle;

  return (
    <div className="w-full">
      {label && <label htmlFor={id} className={`block text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{label}</label>}
      <select
        id={id}
        className={`${baseSelectStyle} ${modeStyle} ${error ? errorStyle : ''} ${className}`}
        {...props}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
};