import React from 'react';

// This allows all standard SVG props, including className, title, etc.
// By explicitly adding title?: string, we ensure TypeScript recognizes it even if
// there's an issue with how it infers inherited props in this context.
interface IconProps extends React.SVGProps<SVGSVGElement> {
  title?: string;
}

export const LoginIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
  </svg>
);

export const WhatsAppIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className || "w-6 h-6"} {...props}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.31 20.59C8.76 21.39 10.37 21.82 12.04 21.82C17.5 21.82 21.95 17.37 21.95 11.91C21.95 9.27 20.92 6.83 19.17 4.96C17.42 3.1 14.82 2 12.04 2M12.04 3.67C14.22 3.67 16.23 4.48 17.79 5.95C19.35 7.42 20.25 9.49 20.25 11.91C20.25 16.42 16.59 20.12 12.04 20.12C10.53 20.12 9.09 19.72 7.84 19L7.2 18.63L4.7 19.33L5.43 16.94L5.05 16.28C4.19 14.93 3.82 13.41 3.82 11.91C3.82 7.4 7.48 3.67 12.04 3.67M17.27 14.45C17.03 14.91 16.03 15.44 15.42 15.56C14.88 15.68 14.39 15.74 14.07 15.62C13.67 15.47 13.06 15.23 12.04 14.3C10.78 13.14 10.03 11.75 9.79 11.29C9.56 10.83 10.03 10.58 10.24 10.38C10.43 10.19 10.61 10.02 10.77 9.83C10.92 9.64 11.02 9.49 10.88 9.24C10.74 9 10.11 7.38 9.87 6.91C9.62 6.45 9.38 6.54 9.19 6.53C9.04 6.53 8.81 6.53 8.59 6.53C8.37 6.53 8.04 6.62 7.76 6.89C7.48 7.16 6.85 7.73 6.85 8.8C6.85 9.87 7.79 10.95 7.94 11.14C8.08 11.33 9.44 13.58 11.83 14.56C13.69 15.3 14.23 15.12 14.69 15.08C15.15 15.03 16.06 14.48 16.27 14.24C16.48 14 16.63 14.15 16.73 14.27C16.83 14.39 17.27 14.45 17.27 14.45Z" />
  </svg>
);

export const CalendarIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-3.75h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372M17.375 17.75c-1.062 0-2.073-.25-2.938-.686M15 19.128v2.124M15 19.128c-1.062 0-2.073-.25-2.938-.686m4.125 0A4.498 4.498 0 0017.375 12c0-1.31-.493-2.527-1.34-3.468M15 19.128c-1.062 0-2.073-.25-2.938-.686M6.25 19.128a9.38 9.38 0 012.625.372M4.625 17.75c1.062 0 2.073-.25 2.938-.686M6.25 19.128v2.124M6.25 19.128c1.062 0 2.073-.25 2.938-.686m-4.125 0A4.498 4.498 0 014.625 12c0-1.31.493-2.527 1.34-3.468m0 0a4.498 4.498 0 016.036 0m0 0A4.498 4.498 0 0113.375 12c0 1.31-.493-2.527-1.34 3.468m0 0c-1.062.25-2.073.25-3.134 0" />
  </svg>
);

export const ChartBarIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);

export const ArrowDownTrayIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

export const CogIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527c.47-.336 1.06-.039 1.15.485l.743 4.193c.067.382-.032.787-.292 1.078l-.744.825c-.387.43-.44 1.002-.125 1.44l.839 1.118c.317.422.385.954.188 1.41l-.494 1.16c-.198.464-.64.802-1.125.802h-1.375c-.484 0-.91-.338-1.063-.796l-.262-1.048c-.079-.317-.346-.576-.643-.707-.297-.131-.635-.131-.932 0-.297.131-.564.39-.643.707l-.262 1.048c-.152.458-.579.796-1.063.796h-1.375c-.484 0-.926-.338-1.125-.802l-.494-1.16c-.198-.464-.13-.988.188-1.41l.839-1.118c.317-.422.262-.954-.125-1.44l-.744-.825c-.26-.29-.359-.696-.292-1.078l.743-4.193c.09-.524.68-.821 1.15-.485l.737.527c.35.25.807.272 1.205.108.395-.166.71-.506.78-.93l.149-.894z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const SunIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591M12 12a2.25 2.25 0 00-2.25 2.25 2.25 2.25 0 002.25 2.25c.383 0 .75-.093 1.073-.264M12 12a2.25 2.25 0 012.25-2.25 2.25 2.25 0 012.25 2.25c-.383 0-.75.093-1.073.264M7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0z" />
  </svg>
);

export const MoonIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
  </svg>
);

export const ShareIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.195.04.396.074.6.091M7.217 10.907v2.186m0-2.186c0 .191.012.38.034.566m-1.471.491a2.25 2.25 0 10-4.5 0 2.25 2.25 0 004.5 0m0 0v.001M16.183 13.093a2.25 2.25 0 100-2.186m0 2.186c-.195-.04-.396-.074-.6-.091m.6.091v-2.186m0 2.186c0-.191-.012-.38-.034-.566m1.471-.491a2.25 2.25 0 104.5 0 2.25 2.25 0 00-4.5 0m0 0v-.001m-3.512 0a2.25 2.25 0 100-2.186m0 2.186c.195.04.396.074.6.091M12.683 10.907v2.186m0-2.186c0 .191.012.38.034.566m0 0a2.25 2.25 0 100 2.186 2.25 2.25 0 000-2.186zm-4.434 4.434a2.25 2.25 0 100-2.186m0 2.186c.195-.04.396-.074.6-.091m-.6.091v-2.186m0 2.186a2.25 2.25 0 100-2.186m-2.217-4.434a2.25 2.25 0 100 2.186m0-2.186c-.195.04-.396.074-.6.091M10.466 6.473v2.186m0-2.186c0 .191.012.38.034.566M10.5 8.75a2.25 2.25 0 100-2.186 2.25 2.25 0 000 2.186z" />
  </svg>
);

export const HomeIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
  </svg>
);

export const StoreIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A2.25 2.25 0 0011.25 11.25H10.5M13.5 21H18M13.5 21H9M18 21V8.625c0-1.023-.827-1.85-1.85-1.85H7.85A1.85 1.85 0 006 8.625V21M18 21h2.25M6 21H3.75m0 0A2.25 2.25 0 011.5 18.75V16.5m19.5 0V18.75a2.25 2.25 0 01-2.25 2.25M3.75 16.5c0-1.023.827-1.85 1.85-1.85h12.8c1.023 0 1.85.827 1.85 1.85M3.75 16.5V13.5M12 13.5V9.75M14.25 13.5V11.25M9.75 13.5V11.25M12 3.75L13.5 6.75H10.5L12 3.75z" />
  </svg>
);

export const PlusIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c.342.052.682.107 1.022.166m0 0c.342.052.682.107 1.022.166m0 0l.004.004c.018.014.032.028.046.042m0 0l.004.004M6.706 7.5h10.588M5.28 7.5h13.44" />
  </svg>
);

export const EditIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
);

export const LogoutIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
  </svg>
);

export const CheckCircleIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const XCircleIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const EyeIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const EyeSlashIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.575M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"} {...props}>
    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.423 3.251c-.805.767-.02 2.072.992 2.072H4.41l1.83 4.401c.321.772 1.415.772 1.736 0l1.83-4.401 4.753-.39 3.423-3.251c.805.767.02-2.072-.992-2.072H15.6l-1.83-4.401zM9.462 5.344a.5.5 0 01.076-.583l.79-.79a.5.5 0 01.708 0l.79.79a.5.5 0 01-.584.658A3.486 3.486 0 0010 3.5a3.486 3.486 0 00-1.124.206.5.5 0 01-.414-.462zM6.558 7.603a.5.5 0 01.583-.076L8 8.058a.5.5 0 010 .708l-.79.79a.5.5 0 01-.658.584A3.486 3.486 0 003.5 10a3.486 3.486 0 00.206 1.124.5.5 0 01.462.414zM14.656 9.462a.5.5 0 01.583.076l.79.79a.5.5 0 010 .708l-.79.79a.5.5 0 01-.658-.584A3.486 3.486 0 0010 16.5a3.486 3.486 0 00-1.124-.206.5.5 0 01-.414.462zm-5.238-3.32a.5.5 0 01.076.583l-.79.79a.5.5 0 01-.708 0l-.79-.79a.5.5 0 01.584-.658A3.486 3.486 0 0010 3.5a3.486 3.486 0 001.124.206.5.5 0 01.414.462z" clipRule="evenodd" />
  </svg>
);

export const ProfileIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-12 h-12"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const BanIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
);