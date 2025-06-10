
import React from 'react';
import BaseIcon from './BaseIcon';

const XMarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <BaseIcon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </BaseIcon>
);
export default XMarkIcon;