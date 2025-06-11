
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
// ThemeToggleButton foi removido da barra principal, pode ser adicionado em Configurações se desejado.
import { CalendarIcon, UsersIcon, ChartBarIcon, WhatsAppIcon as FollowUpIcon, CogIcon, LogoutIcon, HomeIcon as DashboardIcon } from '../components/icons';

const AdminLayout: React.FC = () => {
  const { config, logout } = useAppContext(); // theme e toggleTheme removidos daqui, pois o botão foi removido
  const navigate = useNavigate();

  // O botão de logout foi movido para a página de Configurações implicitamente
  // ou pode ser adicionado lá explicitamente em uma futura modificação.
  // const handleLogout = () => {
  //   logout();
  //   navigate('/login');
  // };

  const navItems = [
    { to: '/admin', text: 'Painel', icon: <DashboardIcon className="w-6 h-6" /> },
    { to: '/admin/agenda', text: 'Agenda', icon: <CalendarIcon className="w-6 h-6" /> },
    { to: '/admin/clientes', text: 'Clientes', icon: <UsersIcon className="w-6 h-6" /> },
    { to: '/admin/financeiro', text: 'Financeiro', icon: <ChartBarIcon className="w-6 h-6" /> },
    { to: '/admin/retornos', text: 'Retornos', icon: <FollowUpIcon className="w-6 h-6" /> },
    { to: '/admin/configuracoes', text: 'Ajustes', icon: <CogIcon className="w-6 h-6" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-100 dark:bg-slate-950">
      {/* Main Content Area */}
      {/* Adicionado pb-20 para espaço da navegação inferior, print:pb-0 para impressão */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 print:pb-0">
        <Outlet />
      </main>

      {/* Bottom Tab Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-[0_-2px_6px_rgba(0,0,0,0.08)] dark:shadow-[0_-2px_6px_rgba(0,0,0,0.2)] flex justify-around items-stretch print:hidden z-40">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'} // `end` prop para o painel
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 pt-2 pb-1 text-xs transition-colors duration-200 relative focus:outline-none focus:bg-purple-100 dark:focus:bg-purple-800/50
              ${isActive
                ? 'text-purple-600 dark:text-purple-400'
                : 'text-slate-500 dark:text-slate-400 hover:text-purple-500 dark:hover:text-purple-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-purple-600 dark:bg-purple-400 rounded-b-sm"></span>}
                <div className="mb-0.5">{item.icon}</div>
                <span className="truncate w-full text-center">{item.text}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminLayout;
