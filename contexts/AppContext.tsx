
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AppConfig, Theme } from '../types';
import { THEME_KEY, AUTH_KEY, CONFIG_KEY, INITIAL_APP_CONFIG } from '../constants';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  config: AppConfig;
  updateConfig: (newConfig: Partial<AppConfig>) => void;
  showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useLocalStorage<Theme>(THEME_KEY, 
    () => (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>(AUTH_KEY, false);
  const [config, setConfig] = useLocalStorage<AppConfig>(CONFIG_KEY, INITIAL_APP_CONFIG);
  const [notification, setNotification] = useState<{ message: string; type: string; id: number } | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Update Tailwind's theme config if it's dynamic, or ensure CSS reflects this.
    // For CDN Tailwind, class on <html> is enough.
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  }, [setTheme]);

  const login = useCallback((password: string): boolean => {
    if (password === config.adminPassword) {
      setIsAuthenticated(true);
      showNotification("Login bem-sucedido!", "success");
      return true;
    }
    showNotification("Senha incorreta.", "error");
    return false;
  }, [config.adminPassword, setIsAuthenticated]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    showNotification("Logout realizado.", "info");
  }, [setIsAuthenticated]);

  const updateConfig = useCallback((newConfig: Partial<AppConfig>) => {
    setConfig(prevConfig => ({ ...prevConfig, ...newConfig }));
    showNotification("Configurações salvas!", "success");
  }, [setConfig]);

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => setNotification(null), 3000);
  }, []);


  return (
    <AppContext.Provider value={{ theme, toggleTheme, isAuthenticated, login, logout, config, updateConfig, showNotification }}>
      {children}
      {notification && (
        <div className={`fixed top-5 right-5 p-4 rounded-md shadow-lg text-white text-sm z-[100] transition-all duration-300 ease-in-out transform ${notification.type === 'success' ? 'bg-green-500' : notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}`}>
          {notification.message}
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
