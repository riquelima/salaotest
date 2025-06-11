
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG as QRCode } from 'qrcode.react'; 
import { useAppContext } from '../contexts/AppContext';
import { Button, Card, Modal } from '../components/ui';
import { ProfileIcon, SparklesIcon, InstagramIcon } from '../components/icons'; 
import ImageCarousel from '../components/ImageCarousel'; 
import { DAYS_OF_WEEK } from '../constants';
import { getWhatsAppLink } from '../utils/helpers';


const carouselImages = [
  { src: 'https://raw.githubusercontent.com/riquelima/salaotest/refs/heads/main/corte1.png', alt: 'Corte de cabelo infantil 1' },
  { src: 'https://raw.githubusercontent.com/riquelima/salaotest/refs/heads/main/corte2.png', alt: 'Corte de cabelo infantil 2' },
  { src: 'https://raw.githubusercontent.com/riquelima/salaotest/refs/heads/main/corte3.png', alt: 'Corte de cabelo infantil 3' },
  { src: 'https://raw.githubusercontent.com/riquelima/salaotest/refs/heads/main/corte4.png', alt: 'Corte de cabelo infantil 4' },
];


const LandingPage: React.FC = () => {
  const { config, showNotification, theme } = useAppContext(); 
  
  const homeServiceDaysText = config.homeServiceDays.map(dayIndex => DAYS_OF_WEEK[dayIndex]).join(' e ');
  const newWhatsAppNumberForScheduling = "5571988624093";

  const [stylistMainName, stylistSubName] = config.stylistName.split(' | ');

  const mainCardBg = theme === 'dark' ? 'bg-slate-800/80' : 'bg-white/90'; // More opaque white
  const mainTitleColor = theme === 'dark' ? 'text-purple-400' : 'text-[#8B5CF6]'; // New purple
  const subTitleColor = theme === 'dark' ? 'text-pink-400' : 'text-pink-500'; // Kept pink accent
  const descriptionColor = theme === 'dark' ? 'text-slate-300' : 'text-[#6B7280]'; // New secondary text
  const infoItemBg = theme === 'dark' ? 'bg-slate-700/60' : 'bg-[#F9FAFB]/90'; // Lighter bg for info
  const infoItemTitle = theme === 'dark' ? 'text-slate-200' : 'text-[#111827]'; // New main text
  const infoItemText = theme === 'dark' ? 'text-slate-300' : 'text-[#6B7280]'; // New secondary text
  const iconFabBg = theme === 'dark' ? 'bg-[#7C3AED]' : 'bg-[#8B5CF6]';
  const iconFabHoverBg = theme === 'dark' ? 'hover:bg-[#8B5CF6]' : 'hover:bg-[#7C3AED]';
  const iconFabRing = theme === 'dark' ? 'focus:ring-[#A78BFA]' : 'focus:ring-[#8B5CF6]';


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-10 sm:p-6 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-indigo-500/10 dark:from-purple-900/40 dark:via-pink-900/40 dark:to-indigo-900/40 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 dark:bg-purple-800/70 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-300 dark:bg-pink-800/70 rounded-full opacity-30 translate-x-1/2 translate-y-1/2 animate-pulse animation-delay-2000"></div>
      
      <Card className={`w-full max-w-2xl z-10 backdrop-blur-md ${mainCardBg} border-none shadow-2xl !p-6 sm:!p-8`}>
        <div className="text-center">
          <SparklesIcon className="mx-auto h-16 w-16 text-purple-500 dark:text-purple-400 mb-4" />
          <h1 className={`text-4xl sm:text-5xl font-bold ${mainTitleColor} mb-1`}>
            {stylistMainName}
          </h1>
          {stylistSubName && (
            <h2 className={`text-2xl sm:text-3xl font-medium ${subTitleColor} mb-3`}>
              {stylistSubName}
            </h2>
          )}
          <p className={`text-lg ${descriptionColor} mb-6`}>
            {config.serviceDescription}
          </p>
        </div>

        <div className="space-y-6 my-8">
          <InfoItem 
            icon="📅" 
            title="Atendimento a Domicílio" 
            text={`Dias fixos: ${homeServiceDaysText}. Agende seu horário!`}
            onActionClick={() => window.open(getWhatsAppLink(newWhatsAppNumberForScheduling, "Olá! Gostaria de agendar um atendimento a domicílio."), '_blank')}
            actionButtonLabel="Agendar atendimento a domicílio via WhatsApp"
            bgColor={infoItemBg}
            titleColor={infoItemTitle}
            textColor={infoItemText}
          />
          <InfoItem 
            icon="🏠" 
            title="Atendimento no Salão" 
            text={`${config.salonAddress}. Por ordem de chegada.`}
            onActionClick={() => window.open(getWhatsAppLink(newWhatsAppNumberForScheduling, "Olá! Gostaria de saber mais sobre o atendimento no salão e os horários de chegada."), '_blank')}
            actionButtonLabel="Consultar sobre atendimento no salão via WhatsApp"
            bgColor={infoItemBg}
            titleColor={infoItemTitle}
            textColor={infoItemText}
          />
        </div>

        <ImageCarousel images={carouselImages} />
        
        <div className="mt-8">
          <a
            href="https://www.instagram.com/tiadeacorteinfantil"
            target="_blank"
            rel="noopener noreferrer"
            className={`
              flex items-center justify-center gap-3 w-full 
              py-3 px-6 rounded-lg shadow-md transition-all duration-300 ease-in-out
              text-white font-semibold text-lg
              bg-[#8B5CF6] hover:bg-[#7C3AED] dark:bg-[#8B5CF6] dark:hover:bg-[#7C3AED]
              focus:outline-none focus:ring-2 focus:ring-[#7C3AED] dark:focus:ring-[#7C3AED] 
              focus:ring-offset-2 focus:ring-offset-[#F9FAFB] dark:focus:ring-offset-[#1E1E2F]
              transform hover:scale-105
            `}
          >
            <InstagramIcon className="w-6 h-6" />
            <span className="font-semibold text-lg">Siga nossas redes sociais</span>
          </a>
        </div>

      </Card>

      <Link
        to="/login"
        className={`fixed bottom-6 right-6 ${iconFabBg} ${iconFabHoverBg} text-white p-4 rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 ${iconFabRing} focus:ring-offset-2 dark:focus:ring-offset-[#1E1E2F] z-50`}
        title="Área Administrativa"
      >
        <ProfileIcon className="w-6 h-6" /> 
      </Link>
    </div>
  );
};

const InfoItem: React.FC<{
  icon: string; 
  title: string; 
  text: string;
  onActionClick?: () => void;
  actionButtonLabel?: string;
  bgColor?: string;
  titleColor?: string;
  textColor?: string;
}> = ({ icon, title, text, onActionClick, actionButtonLabel, bgColor, titleColor, textColor }) => (
  <div className={`flex items-center justify-between p-4 rounded-lg ${bgColor || 'bg-[#F9FAFB] dark:bg-slate-700/50'} shadow hover:shadow-md transition-shadow`}>
    <div className="flex items-start flex-grow">
      <span className="text-3xl mr-4">{icon}</span>
      <div>
        <h3 className={`text-md font-semibold ${titleColor || 'text-[#111827] dark:text-slate-200'}`}>{title}</h3>
        <p className={`text-sm ${textColor || 'text-[#6B7280] dark:text-slate-300'}`}>{text}</p>
      </div>
    </div>
    {onActionClick && (
      <img
        src="https://raw.githubusercontent.com/riquelima/salaotest/refs/heads/main/logoWhatsapp.png"
        alt={actionButtonLabel || `Contatar sobre ${title} via WhatsApp`}
        onClick={onActionClick}
        aria-label={actionButtonLabel || `Contatar sobre ${title} via WhatsApp`}
        className="ml-3 w-12 h-12 cursor-pointer rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] dark:focus:ring-[#A78BFA] focus:ring-offset-2 dark:focus:ring-offset-slate-800 flex-shrink-0"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onActionClick(); }}}
      />
    )}
  </div>
);

export default LandingPage;
