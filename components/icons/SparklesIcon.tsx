
import React from 'react';
import BaseIcon from './BaseIcon';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <BaseIcon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L22.5 5.25l-.813 2.846a4.5 4.5 0 0 0-3.09 3.09L15.75 12l2.846.813a4.5 4.5 0 0 0 3.09 3.09L22.5 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L18.25 12Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 1.5V4.5M12 19.5V22.5M4.5 12H1.5M22.5 12H19.5" />
  </BaseIcon>
);
export default SparklesIcon;
