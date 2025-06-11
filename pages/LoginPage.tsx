
import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Button, Input, Card } from '../components/ui';
import { EyeIcon, EyeSlashIcon, LoginIcon } from '../components/icons'; 

const LoginPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, config, theme } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (login(password)) {
      navigate('/admin');
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  };

  // Card background is handled by ui.tsx Card component now
  const titleColor = theme === 'dark' ? 'text-[#F4F4F5]' : 'text-[#111827]';
  const subtitleColor = theme === 'dark' ? 'text-[#9CA3AF]' : 'text-[#6B7280]';
  const iconColor = theme === 'dark' ? 'text-purple-400' : 'text-[#8B5CF6]'; // Use new purple
  const passwordToggleColor = theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-[#6B7280] hover:text-[#111827]';


  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-indigo-500/10 dark:from-purple-900/40 dark:via-pink-900/40 dark:to-indigo-900/40">
      <Card className={`w-full max-w-sm shadow-2xl backdrop-blur-md bg-white/80 dark:bg-slate-800/80 border-none !p-6 sm:!p-8`}>
        <div className="text-center mb-8">
          <LoginIcon className={`mx-auto h-16 w-16 ${iconColor} mb-4`} />
          <h2 className={`text-3xl font-bold ${titleColor}`}>Acesso Restrito</h2>
          <p className={`text-sm ${subtitleColor}`}>Área da Administradora</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              label="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-10" // Make space for the icon
              error={error} // Pass error to Input for styling
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5 ${passwordToggleColor}`}
              aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </div>
          
          <Button type="submit" variant="primary" size="lg" className="w-full transform hover:scale-105">
            Entrar
          </Button>
        </form>
        { (config.adminPassword === "admin" || config.adminPassword === "admin123" || config.adminPassword === "1234") && 
          <p className="mt-4 text-xs text-center text-orange-500 dark:text-orange-400">
            Senha padrão em uso. Altere em Configurações para maior segurança.
          </p>
        }
      </Card>
    </div>
  );
};

export default LoginPage;