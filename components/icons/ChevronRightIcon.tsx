
import React from 'react';
import BaseIcon from './BaseIcon';

const ChevronRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <BaseIcon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </BaseIcon>
);
export default ChevronRightIcon;