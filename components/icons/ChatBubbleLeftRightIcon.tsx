
import React from 'react';
import BaseIcon from './BaseIcon';

const ChatBubbleLeftRightIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <BaseIcon {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3.684-3.091a1.993 1.993 0 0 0-1.015-.282H6.75A2.25 2.25 0 0 1 4.5 15V6.75A2.25 2.25 0 0 1 6.75 4.5h7.5c.884 0 1.673.342 2.277.941L20.25 8.511Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75V4.5A2.25 2.25 0 0 1 6 2.25h10.5A2.25 2.25 0 0 1 18.75 4.5v1.036C18.75 5.865 18.598 6 18.42 6H5.58C5.402 6 5.25 5.865 5.25 5.536V5.25" />
 </BaseIcon>
);
export default ChatBubbleLeftRightIcon;
