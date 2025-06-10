
import React from 'react';
import { AdminView } from '../../pages/AdminDashboard'; 
import { 
  CalendarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  ArrowDownTrayIcon
} from '../icons';
import { LIGHT_THEME_CONFIG, DARK_THEME_CONFIG } from '../../constants';

interface AdminBottomNavProps {
  currentView: AdminView;
  onNavigate: (view: AdminView) => void;
}

const AdminBottomNav: React.FC<AdminBottomNavProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'schedule' as AdminView, label: 'Agenda', icon: <CalendarIcon className="w-5 h-5 mb-1" /> },
    { id: 'clients' as AdminView, label: 'Clientes', icon: <UserGroupIcon className="w-5 h-5 mb-1" /> },
    { id: 'finance' as AdminView, label: 'Financeiro', icon: <CurrencyDollarIcon className="w-5 h-5 mb-1" /> },
    { id: 'followup' as AdminView, label: 'Retornos', icon: <ChatBubbleLeftRightIcon className="w-5 h-5 mb-1" /> },
    { id: 'export' as AdminView, label: 'Exportar', icon: <ArrowDownTrayIcon className="w-5 h-5 mb-1" /> },
  ];

  return (
    <nav 
        className={`
          fixed bottom-0 left-0 right-0 
          bg-[${LIGHT_THEME_CONFIG.cardBackground}] dark:bg-[${DARK_THEME_CONFIG.cardBackground}] 
          shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.2)]
          border-t border-[${LIGHT_THEME_CONFIG.borderColor}] dark:border-[${DARK_THEME_CONFIG.borderColor}]
          z-50 transition-all duration-300 ease-in-out
        `}
    >
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex justify-around items-center overflow-x-auto scrollbar-hide whitespace-nowrap h-16">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center px-3 py-2 text-xs font-medium min-w-[70px] h-full
                ${currentView === item.id 
                  ? `text-[${LIGHT_THEME_CONFIG.primary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}] border-t-2 border-[${LIGHT_THEME_CONFIG.primary}] dark:border-[${DARK_THEME_CONFIG.textPrimary}]` 
                  : `text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}] hover:text-[${LIGHT_THEME_CONFIG.textPrimary}] dark:hover:text-[${DARK_THEME_CONFIG.textPrimary}]`}
                transition-all duration-150 ease-in-out focus:outline-none`}
              aria-current={currentView === item.id ? 'page' : undefined}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default AdminBottomNav;
