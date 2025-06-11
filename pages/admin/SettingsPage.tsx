import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { AppConfig, Client, Appointment, FinancialRecord, Theme } from '../../types';
import { Button, Input, Card, Textarea } from '../../components/ui';
import { DAYS_OF_WEEK, INITIAL_APP_CONFIG } from '../../constants';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CLIENTS_KEY, APPOINTMENTS_KEY, FINANCIALS_KEY, CONFIG_KEY, AUTH_KEY, THEME_KEY } from '../../constants';
import { LogoutIcon, SunIcon, MoonIcon } from '../../components/icons'; // ProfileIcon removido
import { ThemeToggleButton } from '../../components/ui';


const SettingsPage: React.FC = () => {
  const { config, updateConfig, showNotification, logout, theme, toggleTheme } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AppConfig>(config);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [, setStoredClients] = useLocalStorage<Client[]>(CLIENTS_KEY, []);
  const [, setStoredAppointments] = useLocalStorage<Appointment[]>(APPOINTMENTS_KEY, []);
  const [, setStoredFinancials] = useLocalStorage<FinancialRecord[]>(FINANCIALS_KEY, []); // Not directly used but good for completeness in reset
  const [, setStoredConfig] = useLocalStorage<AppConfig>(CONFIG_KEY, INITIAL_APP_CONFIG);
  const [, setStoredAuth] = useLocalStorage<boolean>(AUTH_KEY, false);
  const [, setStoredTheme] = useLocalStorage<Theme>(THEME_KEY, 'light');

  useEffect(() => {
    setFormData(config); 
  }, [config]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHomeServiceDaysChange = (dayIndex: number) => {
    setFormData(prev => {
      const currentDays = prev.homeServiceDays || [];
      if (currentDays.includes(dayIndex)) {
        return { ...prev, homeServiceDays: currentDays.filter(d => d !== dayIndex) };
      } else {
        return { ...prev, homeServiceDays: [...currentDays, dayIndex].sort((a,b)=>a-b) };
      }
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    let configToUpdate = { ...formData };

    if (newPassword) {
      if (newPassword === confirmPassword) {
        if (newPassword.length < 4) {
          showNotification("A nova senha deve ter pelo menos 4 caracteres.", "error");
          return;
        }
        configToUpdate.adminPassword = newPassword;
      } else {
        showNotification("As novas senhas não coincidem.", "error");
        return;
      }
    }
    
    updateConfig(configToUpdate);
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleExportData = () => {
    const allData = {
        clients: localStorage.getItem(CLIENTS_KEY),
        appointments: localStorage.getItem(APPOINTMENTS_KEY),
        // financials are derived from appointments now, so not storing them separately
        config: localStorage.getItem(CONFIG_KEY),
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(allData, null, 2))}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `salao_infantil_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    showNotification("Backup dos dados exportado!", "success");
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          if (imported.clients) localStorage.setItem(CLIENTS_KEY, imported.clients);
          if (imported.appointments) localStorage.setItem(APPOINTMENTS_KEY, imported.appointments);
          // financials are derived, no direct import needed for FINANCIALS_KEY
          if (imported.config) localStorage.setItem(CONFIG_KEY, imported.config);
          
          showNotification("Dados importados com sucesso! As alterações serão aplicadas.", "success");
          // Force reload or state update to reflect changes from imported config
           setTimeout(() => window.location.reload(), 1500);
        } catch (err) {
          showNotification("Erro ao importar arquivo. Verifique o formato.", "error");
          console.error("Import error:", err);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetApp = () => {
    if (window.confirm("TEM CERTEZA? Isso apagará TODOS os dados (clientes, agendamentos) e redefinirá as configurações para o padrão. Esta ação é IRREVERSÍVEL.")) {
        if (window.confirm("CONFIRMAÇÃO FINAL: Apagar todos os dados e redefinir o aplicativo?")) {
            setStoredClients([]);
            setStoredAppointments([]);
            // setStoredFinancials([]); // Not needed as it's derived
            setStoredConfig(INITIAL_APP_CONFIG);
            setStoredAuth(false);
            setStoredTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            
            showNotification("Aplicativo resetado para as configurações padrão. Todos os dados foram apagados.", "success");
            setTimeout(() => {
              logout(); // Ensure auth state is cleared in context
              window.location.href = '#/login'; // Redirect to login
            }, 1500); 
        }
    }
  };


  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full bg-purple-200 dark:bg-purple-700 flex items-center justify-center mb-4 shadow-lg ring-2 ring-purple-500 dark:ring-purple-400 overflow-hidden">
          {/* Substituído ProfileIcon por img tag com a logo */}
          <img 
            src="https://raw.githubusercontent.com/riquelima/salaotest/refs/heads/main/logo1.png" 
            alt="Logo Salão" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="flex justify-between items-center w-full">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 text-center flex-grow">Configurações Gerais</h1>
            <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">Informações do Salão</h2>
          <Input label="Nome da Cabeleireira" name="stylistName" value={formData.stylistName} onChange={handleInputChange} />
          <Textarea label="Descrição dos Serviços" name="serviceDescription" value={formData.serviceDescription} onChange={handleInputChange} rows={3}/>
          <Input label="Endereço do Salão Físico" name="salonAddress" value={formData.salonAddress} onChange={handleInputChange} />
          <Input label="Número do WhatsApp (com código do país, ex: 55119...)" name="whatsAppNumber" value={formData.whatsAppNumber} onChange={handleInputChange} placeholder="5511912345678" />
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">Dias de Atendimento a Domicílio</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {DAYS_OF_WEEK.map((day, index) => (
              <label key={index} className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={formData.homeServiceDays.includes(index)}
                  onChange={() => handleHomeServiceDaysChange(index)}
                  className="form-checkbox h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-slate-700 dark:text-slate-200">{day}</span>
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">Segurança</h2>
          <Input label="Nova Senha (mín. 4 caracteres)" type="password" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Deixe em branco para não alterar" />
          <Input label="Confirmar Nova Senha" type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </Card>

        <div className="mt-6 flex justify-end">
          <Button type="submit" variant="primary" size="lg">Salvar Configurações</Button>
        </div>
      </form>

      <Card>
        <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">Gerenciamento de Dados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button onClick={handleExportData} variant="secondary">
                Exportar Dados (Backup)
            </Button>
            <div>
                <label htmlFor="importFile" className="block w-full text-center px-4 py-2 font-semibold rounded-lg shadow-md bg-slate-200 hover:bg-slate-300 text-slate-800 focus:ring-slate-400 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-100 dark:focus:ring-slate-500 cursor-pointer transition-colors">
                    Importar Dados (Restaurar)
                </label>
                <input type="file" id="importFile" accept=".json" onChange={handleImportData} className="hidden" />
            </div>
        </div>
      </Card>

      <Card className="border-red-500/50 dark:border-red-400/50">
        <h2 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">Zona de Perigo</h2>
        <Button onClick={handleResetApp} variant="danger" className="w-full">
          Resetar Aplicativo (Apagar Todos os Dados)
        </Button>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Esta ação é irreversível e apagará todos os clientes, agendamentos e redefinirá as configurações.
        </p>
      </Card>

      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-center">
        <Button onClick={handleLogout} variant="ghost" size="lg">
          <LogoutIcon className="w-5 h-5 mr-2" /> Sair da Área Administrativa
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;