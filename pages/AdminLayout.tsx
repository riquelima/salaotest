
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { CalendarIcon, ProfileIcon, ChartBarIcon, WhatsAppIcon as FollowUpIcon, CogIcon, LogoutIcon, HomeIcon as DashboardIcon } from '../components/icons'; 

const AdminLayout: React.FC = () => {
  const { theme } = useAppContext(); 

  const navItems = [
    { to: '/admin', text: 'Painel', icon: <DashboardIcon className="w-6 h-6" />, activeColor: 'text-[#8B5CF6]', activeBarColor: 'bg-[#8B5CF6]' },
    { to: '/admin/agenda', text: 'Agenda', icon: <CalendarIcon className="w-6 h-6" />, activeColor: 'text-[#FBBF24]', activeBarColor: 'bg-[#FBBF24]' },
    { to: '/admin/clientes', text: 'Clientes', icon: <ProfileIcon className="w-6 h-6" />, activeColor: 'text-[#4ADE80]', activeBarColor: 'bg-[#4ADE80]' }, 
    { to: '/admin/financeiro', text: 'Financeiro', icon: <ChartBarIcon className="w-6 h-6" />, activeColor: 'text-[#60A5FA]', activeBarColor: 'bg-[#60A5FA]' },
    { to: '/admin/retornos', text: 'Retornos', icon: <FollowUpIcon className="w-6 h-6" />, activeColor: 'text-[#F87171]', activeBarColor: 'bg-[#F87171]' },
    { to: '/admin/configuracoes', text: 'Ajustes', icon: <CogIcon className="w-6 h-6" />, activeColor: 'text-[#8B5CF6]', activeBarColor: 'bg-[#8B5CF6]' }, 
  ];
  
  const inactiveColor = theme === 'dark' ? 'text-[#9CA3AF]' : 'text-[#6B7280]';
  const hoverColor = theme === 'dark' ? 'hover:text-[#D1D5DB]' : 'hover:text-[#374151]';


  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB] dark:bg-[#1E1E2F]">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-20 print:pb-0">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-[#2C2C3B] border-t border-[#E5E7EB] dark:border-[#374151] shadow-[0_-2px_6px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_6px_rgba(0,0,0,0.15)] flex justify-around items-stretch print:hidden z-40">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/admin'} 
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 pt-2 pb-1 text-xs transition-colors duration-200 relative focus:outline-none focus:bg-[#8B5CF6]/5 dark:focus:bg-[#8B5CF6]/10
              ${isActive
                ? item.activeColor 
                : `${inactiveColor} ${hoverColor}`
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && <span className={`absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 ${item.activeBarColor} rounded-b-sm`}></span>}
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