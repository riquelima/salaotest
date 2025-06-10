
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import ThemeSwitcher from './components/ui/ThemeSwitcher';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/admin" 
        element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/" replace />} 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <DataProvider>
          <ThemeProvider>
            <div className="min-h-screen flex flex-col bg-[#F9FAFB] text-[#111827] dark:bg-[#191919] dark:text-[#E0E0E0] transition-colors duration-300">
              {/* Removed fixed top-right logo from here */}
              <AppContent />
              <ThemeSwitcher />
            </div>
          </ThemeProvider>
        </DataProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;