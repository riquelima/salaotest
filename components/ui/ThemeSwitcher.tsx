
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { SunIcon, MoonIcon } from '../icons';
import Button from './Button';
import { LIGHT_THEME_CONFIG, DARK_THEME_CONFIG } from '../../constants';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="primary" // Button component handles themed primary style
      className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 rounded-full p-3 shadow-lg z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[${LIGHT_THEME_CONFIG.background}] dark:focus:ring-offset-[${DARK_THEME_CONFIG.background}]`}
      aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      <div className="relative w-6 h-6">
        <SunIcon
          className={`absolute inset-0 w-6 h-6 transition-opacity duration-300 ease-in-out ${
            theme === 'dark' ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <MoonIcon
          className={`absolute inset-0 w-6 h-6 transition-opacity duration-300 ease-in-out ${
            theme === 'light' ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </Button>
  );
};

export default ThemeSwitcher;
