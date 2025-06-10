
import React, { ReactNode } from 'react';
import { LIGHT_THEME_CONFIG, DARK_THEME_CONFIG } from '../../constants';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div
      className={`
        bg-white/50 dark:bg-white/10 
        backdrop-blur-md 
        p-4 sm:p-6 rounded-2xl 
        border border-gray-200/50 dark:border dark:border-white/10
        shadow-xl shadow-black/20 
        transition-all duration-300 ease-in-out
        ${onClick ? 'cursor-pointer' : ''} 
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;