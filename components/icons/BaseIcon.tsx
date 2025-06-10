
import React from 'react';

interface BaseIconProps extends React.SVGProps<SVGSVGElement> {
  children: React.ReactNode;
}

const BaseIcon: React.FC<BaseIconProps> = ({ children, className = 'w-6 h-6', ...props }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24" 
      strokeWidth={1.5} 
      stroke="currentColor" 
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
};

export default BaseIcon;