
import React from 'react';
import BaseIcon from './BaseIcon';

const TrashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <BaseIcon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12.56 0c1.153 0 2.24.032 3.22.096q.376.029.746.065A48.064 48.064 0 0 1 12 5.25c.83 0 1.64.044 2.403.13C15.408 5.42 16.32 5.516 17.228 5.626M9 5.25V3.75c0-.621.504-1.125 1.125-1.125H11.25c.621 0 1.125.504 1.125 1.125V5.25m-3 0h3" />
  </BaseIcon>
);
export default TrashIcon;
