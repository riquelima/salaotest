
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './contexts/AppContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminLayout from './pages/AdminLayout';
import SchedulingPage from './pages/admin/SchedulingPage';
import ClientsPage from './pages/admin/ClientsPage';
import FinancialsPage from './pages/admin/FinancialsPage';
import FollowUpPage from './pages/admin/FollowUpPage';
import SettingsPage from './pages/admin/SettingsPage';
import AdminDashboard from './pages/admin/AdminDashboard';

const App: React.FC = () => {
  const { theme, isAuthenticated } = useAppContext();

  return (
    <div className={`${theme} font-sans`}>
      <div className="bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 min-h-screen transition-colors duration-300">
        <HashRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={isAuthenticated ? <Navigate to="/admin" /> : <LoginPage />} />
            
            <Route path="/admin" element={isAuthenticated ? <AdminLayout /> : <Navigate to="/login" />}>
              <Route index element={<AdminDashboard />} />
              <Route path="agenda" element={<SchedulingPage />} />
              <Route path="clientes" element={<ClientsPage />} />
              <Route path="financeiro" element={<FinancialsPage />} />
              <Route path="retornos" element={<FollowUpPage />} />
              <Route path="configuracoes" element={<SettingsPage />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </HashRouter>
      </div>
    </div>
  );
};

export default App;