
import React from 'react';
import BaseIcon from './BaseIcon';

const SunIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <BaseIcon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-6.364-.386 1.591-1.591M3 12h2.25m.386-6.364 1.591 1.591M12 12a2.25 2.25 0 0 0-2.25 2.25c0 1.31.876 2.408 2.069 2.616a2.25 2.25 0 0 0 2.431-2.069A2.25 2.25 0 0 0 12 12Z" />
  </BaseIcon>
);
export default SunIcon;
