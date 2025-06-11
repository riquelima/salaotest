
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG as QRCode } from 'qrcode.react'; // Corrected import
import { useAppContext } from '../contexts/AppContext';
import { Button, Card, Modal } from '../components/ui';
import { ProfileIcon, SparklesIcon } from '../components/icons'; // Replaced LoginIcon with ProfileIcon, ShareIcon removed
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
  const { config, showNotification } = useAppContext();
  // Share button related states and functions removed
  
  const homeServiceDaysText = config.homeServiceDays.map(dayIndex => DAYS_OF_WEEK[dayIndex]).join(' e ');
  const whatsAppNumberClean = config.whatsAppNumber.replace(/\D/g, '');

  const [stylistMainName, stylistSubName] = config.stylistName.split(' | ');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-10 sm:p-6 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-indigo-500/10 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-indigo-900/30 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 dark:bg-purple-800 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-300 dark:bg-pink-800 rounded-full opacity-30 translate-x-1/2 translate-y-1/2 animate-pulse animation-delay-2000"></div>
      
      <Card className="w-full max-w-2xl z-10 backdrop-blur-md bg-white/70 dark:bg-slate-800/70 border-none shadow-2xl">
        <div className="text-center">
          <SparklesIcon className="mx-auto h-16 w-16 text-purple-500 dark:text-purple-400 mb-4" />
          <h1 className="text-4xl sm:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-1">
            {stylistMainName}
          </h1>
          {stylistSubName && (
            <h2 className="text-2xl sm:text-3xl font-medium text-pink-500 dark:text-pink-400 mb-3">
              {stylistSubName}
            </h2>
          )}
          <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
            {config.serviceDescription}
          </p>
        </div>

        <div className="space-y-6 my-8">
          <InfoItem 
            icon="📅" 
            title="Atendimento a Domicílio" 
            text={`Dias fixos: ${homeServiceDaysText}. Agende seu horário!`}
            onActionClick={() => window.open(getWhatsAppLink(whatsAppNumberClean, "Olá! Gostaria de agendar um atendimento a domicílio."), '_blank')}
            actionButtonLabel="Agendar atendimento a domicílio via WhatsApp"
          />
          <InfoItem 
            icon="🏠" 
            title="Atendimento no Salão" 
            text={`${config.salonAddress}. Por ordem de chegada.`}
            onActionClick={() => window.open(getWhatsAppLink(whatsAppNumberClean, "Olá! Gostaria de saber mais sobre o atendimento no salão e os horários de chegada."), '_blank')}
            actionButtonLabel="Consultar sobre atendimento no salão via WhatsApp"
          />
        </div>

        <ImageCarousel images={carouselImages} />
        
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          {/* Botão de Agendar via WhatsApp foi removido daqui */}
          {/* Botão "Compartilhar Página" foi removido conforme solicitado */}
        </div>

        {/* Modal de QR Code removido, pois o botão de compartilhar foi removido */}
      </Card>

      <Link
        to="/login"
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 z-50" // Increased z-index
        title="Área Administrativa"
      >
        <ProfileIcon className="w-6 h-6" /> {/* Changed to ProfileIcon */}
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
}> = ({ icon, title, text, onActionClick, actionButtonLabel }) => (
  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-100 dark:bg-slate-700/50 shadow hover:shadow-md transition-shadow">
    <div className="flex items-start flex-grow">
      <span className="text-3xl mr-4">{icon}</span>
      <div>
        <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">{text}</p>
      </div>
    </div>
    {onActionClick && (
      <img
        src="https://raw.githubusercontent.com/riquelima/salaotest/refs/heads/main/logoWhatsapp.png"
        alt={actionButtonLabel || `Contatar sobre ${title} via WhatsApp`}
        onClick={onActionClick}
        aria-label={actionButtonLabel || `Contatar sobre ${title} via WhatsApp`}
        className="ml-3 w-12 h-12 cursor-pointer rounded-full shadow-md transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800 flex-shrink-0"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onActionClick(); }}}
      />
    )}
  </div>
);

export default LandingPage;