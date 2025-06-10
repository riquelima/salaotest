
import React, { ReactNode } from 'react';
import { XMarkIcon } from '../icons';
import { LIGHT_THEME_CONFIG, DARK_THEME_CONFIG } from '../../constants';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  let sizeClasses = '';
  switch(size) {
    case 'sm': sizeClasses = 'max-w-sm'; break;
    case 'md': sizeClasses = 'max-w-md'; break;
    case 'lg': sizeClasses = 'max-w-lg'; break;
    case 'xl': sizeClasses = 'max-w-xl'; break;
    default: sizeClasses = 'max-w-md';
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 dark:bg-black dark:bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out"
      onClick={onClose}
    >
      <div
        className={`
          bg-[${LIGHT_THEME_CONFIG.cardBackground}] dark:bg-[${DARK_THEME_CONFIG.cardBackground}] 
          rounded-xl shadow-2xl w-full ${sizeClasses} p-6 
          transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modalShow
          border border-[${LIGHT_THEME_CONFIG.borderColor}] dark:border-[${DARK_THEME_CONFIG.borderColor}]
        `}
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex items-center justify-between mb-4">
          {title && <h3 className={`text-xl font-semibold text-[${LIGHT_THEME_CONFIG.textPrimary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}]`}>{title}</h3>}
          <button
            onClick={onClose}
            className={`
              p-1 rounded-full 
              text-gray-500 hover:text-gray-800 dark:text-[${DARK_THEME_CONFIG.textSecondary}] dark:hover:text-[${DARK_THEME_CONFIG.textPrimary}]
              hover:bg-gray-100 dark:hover:bg-[${DARK_THEME_CONFIG.primaryHover}]
              focus:outline-none focus:ring-2 focus:ring-[${LIGHT_THEME_CONFIG.focusRing}] dark:focus:ring-[${DARK_THEME_CONFIG.focusRing}]
              transition-colors duration-150
            `}
            aria-label="Close modal"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <div className={`text-[${LIGHT_THEME_CONFIG.textPrimary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}]`}>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
