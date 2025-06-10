
import React from 'react';
import BaseIcon from './BaseIcon';

const PlusIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <BaseIcon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </BaseIcon>
);
export default PlusIcon;
