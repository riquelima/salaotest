
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG as QRCode } from 'qrcode.react'; // Corrected import
import { useAppContext } from '../contexts/AppContext';
import { Button, Card, Modal } from '../components/ui';
import { LoginIcon, WhatsAppIcon, ShareIcon, SparklesIcon } from '../components/icons';
import { DAYS_OF_WEEK } from '../constants';

const LandingPage: React.FC = () => {
  const { config, showNotification } = useAppContext();
  const [showQrCode, setShowQrCode] = useState(false);
  const appUrl = window.location.href;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: config.stylistName + " - Salão Infantil",
          text: `Conheça os serviços de ${config.stylistName}! ${config.serviceDescription}`,
          url: appUrl,
        });
        showNotification("Link compartilhado!", "success");
      } catch (error) {
        showNotification("Erro ao compartilhar.", "error");
        console.error('Error sharing:', error);
        setShowQrCode(true); // Fallback to QR code
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      setShowQrCode(true);
    }
  };
  
  const homeServiceDaysText = config.homeServiceDays.map(dayIndex => DAYS_OF_WEEK[dayIndex]).join(' e ');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-10 sm:p-6 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-indigo-500/10 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-indigo-900/30 relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 dark:bg-purple-800 rounded-full opacity-30 -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-300 dark:bg-pink-800 rounded-full opacity-30 translate-x-1/2 translate-y-1/2 animate-pulse animation-delay-2000"></div>
      
      <Card className="w-full max-w-2xl z-10 backdrop-blur-md bg-white/70 dark:bg-slate-800/70 border-none shadow-2xl">
        <div className="text-center">
          <SparklesIcon className="mx-auto h-16 w-16 text-purple-500 dark:text-purple-400 mb-4" />
          <h1 className="text-4xl sm:text-5xl font-bold text-purple-600 dark:text-purple-400 mb-3">
            {config.stylistName}
          </h1>
          <p className="text-lg text-slate-700 dark:text-slate-300 mb-6">
            {config.serviceDescription}
          </p>
        </div>

        <div className="space-y-6 my-8">
          <InfoItem icon="📅" title="Atendimento a Domicílio" text={`Dias fixos: ${homeServiceDaysText}. Agende seu horário!`} />
          <InfoItem icon="🏠" title="Atendimento no Salão" text={`${config.salonAddress}. Por ordem de chegada.`} />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button 
            variant="primary" 
            size="lg" 
            onClick={() => window.open(`https://wa.me/${config.whatsAppNumber.replace(/\D/g, '')}?text=${encodeURIComponent("Olá! Gostaria de agendar um corte infantil.")}`, '_blank')}
            className="w-full sm:w-auto transform hover:scale-105"
          >
            <WhatsAppIcon className="w-5 h-5 mr-2" /> Agendar via WhatsApp
          </Button>
          <Button 
            variant="secondary" 
            size="lg" 
            onClick={handleShare}
            className="w-full sm:w-auto transform hover:scale-105"
          >
            <ShareIcon className="w-5 h-5 mr-2" /> Compartilhar Página
          </Button>
        </div>

        {showQrCode && (
          <Modal isOpen={showQrCode} onClose={() => setShowQrCode(false)} title="Compartilhe esta Página">
            <div className="flex flex-col items-center space-y-4">
              <p className="text-slate-700 dark:text-slate-300">Escaneie o QR Code ou copie o link abaixo:</p>
              <div className="p-2 bg-white inline-block rounded-lg">
                <QRCode value={appUrl} size={160} level="H" />
              </div>
              <input
                type="text"
                value={appUrl}
                readOnly
                className="w-full p-2 border rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm"
                onFocus={(e) => e.target.select()}
              />
              <Button onClick={() => { navigator.clipboard.writeText(appUrl); showNotification("Link copiado!", "success"); }}>
                Copiar Link
              </Button>
            </div>
          </Modal>
        )}
      </Card>

      <Link
        to="/login"
        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg transition-transform duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        title="Área Administrativa"
      >
        <LoginIcon className="w-6 h-6" />
      </Link>
    </div>
  );
};

const InfoItem: React.FC<{icon: string; title: string; text: string}> = ({ icon, title, text }) => (
  <div className="flex items-start p-4 rounded-lg bg-slate-100 dark:bg-slate-700/50 shadow">
    <span className="text-3xl mr-4">{icon}</span>
    <div>
      <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">{text}</p>
    </div>
  </div>
);

export default LandingPage;
