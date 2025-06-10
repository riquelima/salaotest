
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { LIGHT_THEME_CONFIG, DARK_THEME_CONFIG } from '../constants';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  colors: typeof LIGHT_THEME_CONFIG; // Type will match either light or dark config
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // This function runs once on component mount to determine the initial theme.
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      if (storedTheme === 'light' || storedTheme === 'dark') {
        return storedTheme; // Use stored theme if valid
      }
      // If no valid stored theme, use system preference.
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; // Default for SSR or environments without window
  });

  useEffect(() => {
    // This effect runs whenever the theme state changes.
    if (typeof window !== 'undefined') {
      const root = window.document.documentElement;
      
      // Apply or remove the 'dark' class to the HTML element.
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      
      // Persist the selected theme to localStorage.
      localStorage.setItem('theme', theme);
    }
  }, [theme]); // Re-run effect if theme state changes.

  const toggleTheme = useCallback(() => {
    // Callback to switch the theme state.
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []); // Empty dependency array means this function is created once.

  // Determine the color palette based on the current theme.
  const currentColors = theme === 'light' ? LIGHT_THEME_CONFIG : DARK_THEME_CONFIG;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, colors: currentColors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
