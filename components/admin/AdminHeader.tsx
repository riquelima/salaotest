
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { APP_NAME, LIGHT_THEME_CONFIG, DARK_THEME_CONFIG } from '../../constants';
import Button from '../ui/Button';
import { 
  LogoutIcon, 
  Cog6ToothIcon
} from '../icons';

const AdminHeader: React.FC = () => {
  const { logout } = useAuth();

  return (
    <header className={`
      bg-[${LIGHT_THEME_CONFIG.cardBackground}] dark:bg-[${DARK_THEME_CONFIG.cardBackground}] 
      shadow-md dark:shadow-lg dark:shadow-black/20
      sticky top-0 z-40 transition-all duration-300 ease-in-out
      border-b border-[${LIGHT_THEME_CONFIG.borderColor}] dark:border-[${DARK_THEME_CONFIG.borderColor}]
    `}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className={`flex items-center text-xl sm:text-2xl font-semibold text-[${LIGHT_THEME_CONFIG.textPrimary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}] transition-colors duration-300`}>
            <Cog6ToothIcon className={`w-7 h-7 sm:w-8 sm:h-8 mr-2 text-[${LIGHT_THEME_CONFIG.primary}] dark:text-[${DARK_THEME_CONFIG.iconColor}] transition-colors duration-300`} />
            {APP_NAME} - Admin
          </div>
          <Button onClick={logout} variant="danger" size="sm" leftIcon={<LogoutIcon className="w-5 h-5" />}>
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
