

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  APP_NAME, 
  HAIRDRESSER_NAME, 
  HAIRDRESSER_ABOUT_TITLE, 
  HAIRDRESSER_ABOUT_LINES, 
  HAIRDRESSER_PHOTO_URL,
  CAROUSEL_IMAGES, 
  WHATSAPP_NUMBER, 
  HOME_SERVICE_DAYS, 
  SALON_ADDRESS, 
  SALON_WALKIN_NOTICE,
  LIGHT_THEME_CONFIG,
  DARK_THEME_CONFIG
} from '../constants';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Carousel from '../components/ui/Carousel'; 
import { 
  LoginIcon, 
  ShareIcon, 
  QrCodeIcon, 
  CheckCircleIcon, 
  InformationCircleIcon,
  CalendarIcon,
  BuildingStorefrontIcon,
  PhoneIcon
} from '../components/icons';
import { useTheme } from '../contexts/ThemeContext';

const LandingPage: React.FC = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme, colors: themeColors } = useTheme(); 

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(password)) {
      setIsLoginModalOpen(false);
      setPassword('');
      setLoginError('');
      navigate('/admin');
    } else {
      setLoginError('Senha incorreta. Tente novamente.');
    }
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        setShareLinkCopied(true);
        setTimeout(() => setShareLinkCopied(false), 2000);
      })
      .catch(err => console.error('Failed to copy link: ', err));
  };
  
  const qrCardBg = theme === 'dark' ? DARK_THEME_CONFIG.cardBackground : LIGHT_THEME_CONFIG.cardBackground;
  const qrCodeBgHex = qrCardBg.substring(1); 
  const qrCodeFgHex = theme === 'dark' ? DARK_THEME_CONFIG.textPrimary.substring(1) : LIGHT_THEME_CONFIG.textPrimary.substring(1);
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(window.location.href)}&bgcolor=${qrCodeBgHex}&color=${qrCodeFgHex}&qzone=1`;


  const openWhatsApp = (message: string) => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };

  const carouselSlides = [
    <Card key="info-slide" className="w-full h-full flex flex-col justify-center relative">
      <div 
        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 shadow-lg"
        style={{zIndex: 1}} 
      >
        <img 
          src={HAIRDRESSER_PHOTO_URL} 
          alt={`Foto de ${HAIRDRESSER_NAME}`} 
          className="w-full h-full object-cover" 
        />
      </div>
      <div className="flex flex-col gap-2 text-left md:text-center pt-6 sm:pt-0"> 
        <h2 className={`uppercase text-xs font-semibold text-violet-500 dark:text-violet-400 mb-1 tracking-wide`}>
          {HAIRDRESSER_ABOUT_TITLE}
        </h2>
        <div className="space-y-2">
          {HAIRDRESSER_ABOUT_LINES.map((line, index) => (
            <p 
              key={index} 
              className={`flex items-center text-left md:justify-center gap-x-2 text-sm sm:text-base font-medium leading-relaxed text-[${LIGHT_THEME_CONFIG.textPrimary}] dark:text-white dark:text-opacity-90 whitespace-normal break-words`}
            >
              <span>{line.icon}</span>
              <span dangerouslySetInnerHTML={{ __html: line.text }} />
            </p>
          ))}
        </div>
      </div>
    </Card>,
    ...CAROUSEL_IMAGES.map((img, index) => (
      <Card key={`img-slide-${index}`} className="p-0 overflow-hidden w-full h-full"> 
        <img 
          src={img.src} 
          alt={img.alt} 
          className="w-full h-full object-cover" 
        />
      </Card>
    ))
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-10 sm:pt-12"> {/* Adjusted top padding */}
      <header className="text-center mb-8 sm:mb-12 w-full">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <img 
            src="https://raw.githubusercontent.com/riquelima/salaotest/refs/heads/main/logo1.png" 
            alt="Salão Móvel Infantil Logo" 
            className="w-32 h-32 md:w-40 md:h-40 object-contain"
          />
          <h1 className={`text-4xl sm:text-5xl font-extrabold text-[${LIGHT_THEME_CONFIG.primary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}] drop-shadow-lg transition-colors duration-300`}>
            {APP_NAME}
          </h1>
        </div>
        <p className={`text-xl sm:text-2xl text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}] mt-2 transition-colors duration-300`}>com {HAIRDRESSER_NAME}</p>
      </header>

      <main className="w-full max-w-2xl space-y-8">
        <Carousel 
          items={carouselSlides} 
          className="w-full max-w-md mx-auto" 
          slideHeightClass="h-80 sm:h-96" 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="flex flex-col justify-between">
            <div className="flex flex-col gap-1 text-left md:text-center">
              <h2 className={`text-xl font-semibold text-[${LIGHT_THEME_CONFIG.primary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}] mb-1 transition-colors duration-300`}>Atendimento a Domicílio</h2>
              <p className={`text-[${LIGHT_THEME_CONFIG.textPrimary}] dark:text-white dark:text-opacity-90 transition-colors duration-300 flex items-center md:justify-center gap-1`}><CalendarIcon className={`w-5 h-5 inline text-[${LIGHT_THEME_CONFIG.iconColor}] dark:text-white dark:text-opacity-80 transition-colors duration-300`} />Dias: {HOME_SERVICE_DAYS}</p>
              <p className={`text-sm text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-white/70 mt-1 transition-colors duration-300`}>Consulte áreas de atendimento.</p>
            </div>
            <Button 
              variant="success" 
              size="sm" 
              className="mt-4 w-full"
              leftIcon={<PhoneIcon className="w-4 h-4" />}
              onClick={() => openWhatsApp("Olá! Gostaria de mais informações sobre o atendimento a domicílio.")}
            >
              Agendar via WhatsApp
            </Button>
          </Card>
          <Card className="flex flex-col justify-between">
            <div className="flex flex-col gap-1 text-left md:text-center">
              <h2 className={`text-xl font-semibold text-[${LIGHT_THEME_CONFIG.primary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}] mb-1 transition-colors duration-300`}>Atendimento no Salão</h2>
              <p className={`text-[${LIGHT_THEME_CONFIG.textPrimary}] dark:text-white dark:text-opacity-90 transition-colors duration-300 flex items-center md:justify-center gap-1`}><BuildingStorefrontIcon className={`w-5 h-5 inline text-[${LIGHT_THEME_CONFIG.iconColor}] dark:text-white dark:text-opacity-80 transition-colors duration-300`} />Local: {SALON_ADDRESS}</p>
              <p className={`text-sm text-yellow-600 dark:text-yellow-400/90 mt-1 transition-colors duration-300 flex items-center md:justify-center gap-1`}><InformationCircleIcon className="w-4 h-4 inline" />{SALON_WALKIN_NOTICE}</p>
            </div>
            <Button 
              variant="success" 
              size="sm" 
              className="mt-4 w-full"
              leftIcon={<PhoneIcon className="w-4 h-4" />}
              onClick={() => openWhatsApp("Olá! Gostaria de mais informações sobre o atendimento no salão.")}
            >
              Agendar via WhatsApp
            </Button>
          </Card>
        </div>
        
        <Card className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button onClick={() => setShowQrModal(true)} variant="ghost" leftIcon={<QrCodeIcon className="w-5 h-5" />}>
                Mostrar QR Code
            </Button>
            <Button onClick={handleShareLink} variant="ghost" leftIcon={shareLinkCopied ? <CheckCircleIcon className={`w-5 h-5 text-green-500 dark:text-green-400`}/> : <ShareIcon className="w-5 h-5" />}>
                {shareLinkCopied ? 'Link Copiado!' : 'Copiar Link do App'}
            </Button>
        </Card>
      </main>

       <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6">
        <Button 
            variant="secondary"
            size="sm"
            onClick={() => setIsLoginModalOpen(true)}
            aria-label="Admin Login"
            className="rounded-full p-3 shadow-lg"
        >
          <LoginIcon className="w-6 h-6" />
        </Button>
      </div>

      <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} title="Acesso Administrativo">
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="password"
            label="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
          />
          {loginError && <p className="text-red-500 dark:text-red-400 text-sm">{loginError}</p>}
          <Button type="submit" className="w-full">Entrar</Button>
        </form>
      </Modal>

      <Modal isOpen={showQrModal} onClose={() => setShowQrModal(false)} title="Compartilhe o App" size="sm">
         <div className="flex flex-col items-center text-center">
            <div className={`p-2 rounded-md bg-[${LIGHT_THEME_CONFIG.cardBackground}] dark:bg-[${DARK_THEME_CONFIG.cardBackground}] border border-[${LIGHT_THEME_CONFIG.borderColor}] dark:border-[${DARK_THEME_CONFIG.borderColor}] inline-block`}>
              <img src={qrCodeUrl} alt="QR Code para compartilhar o app" className="block" />
            </div>
            <p className={`mt-4 text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-white/80`}>Escaneie este QR Code para abrir o app em outro dispositivo.</p>
        </div>
      </Modal>
      
      <footer className={`mt-12 text-center text-sm text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}] transition-colors duration-300`}>
        <p>&copy; 2025 {APP_NAME}. Todos os direitos reservados.</p>
        <p className="mt-1">Design por Intelektus <span className={`text-violet-500 dark:text-violet-400`}>💜</span></p>
      </footer>
    </div>
  );
};

export default LandingPage;