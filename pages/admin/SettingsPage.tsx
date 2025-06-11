
import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { AppConfig, Client, Appointment, FinancialRecord, Theme } from '../../types';
import { Button, Input, Card, Textarea, ThemeToggleButton } from '../../components/ui';
import { DAYS_OF_WEEK, INITIAL_APP_CONFIG } from '../../constants';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { CLIENTS_KEY, APPOINTMENTS_KEY, FINANCIALS_KEY, CONFIG_KEY, AUTH_KEY, THEME_KEY } from '../../constants';
import { LogoutIcon, SunIcon, MoonIcon } from '../../components/icons'; 


const SettingsPage: React.FC = () => {
  const { config, updateConfig, showNotification, logout, theme, toggleTheme } = useAppContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AppConfig>(config);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [, setStoredClients] = useLocalStorage<Client[]>(CLIENTS_KEY, []);
  const [, setStoredAppointments] = useLocalStorage<Appointment[]>(APPOINTMENTS_KEY, []);
  const [, setStoredFinancials] = useLocalStorage<FinancialRecord[]>(FINANCIALS_KEY, []); 
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
        financials: localStorage.getItem(FINANCIALS_KEY), 
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
          if (imported.financials) localStorage.setItem(FINANCIALS_KEY, imported.financials); 
          if (imported.config) localStorage.setItem(CONFIG_KEY, imported.config);
          
          showNotification("Dados importados com sucesso! As alterações serão aplicadas.", "success");
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
    if (window.confirm("TEM CERTEZA? Isso apagará TODOS os dados (clientes, agendamentos, financeiros) e redefinirá as configurações para o padrão. Esta ação é IRREVERSÍVEL.")) {
        if (window.confirm("CONFIRMAÇÃO FINAL: Apagar todos os dados e redefinir o aplicativo?")) {
            setStoredClients([]);
            setStoredAppointments([]);
            setStoredFinancials([]); 
            setStoredConfig(INITIAL_APP_CONFIG);
            setStoredAuth(false);
            setStoredTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
            
            showNotification("Aplicativo resetado para as configurações padrão. Todos os dados foram apagados.", "success");
            setTimeout(() => {
              logout(); 
              window.location.href = '#/login'; 
            }, 1500); 
        }
    }
  };
  
  const mainTextColor = "text-[#111827] dark:text-[#F4F4F5]";
  const cardTitleColor = "text-[#1F2937] dark:text-[#E5E7EB]";
  const secondaryTextColor = "text-[#6B7280] dark:text-[#9CA3AF]";
  const checkboxLabelColor = "text-[#374151] dark:text-[#D1D5DB]"; // For checkbox text
  const dangerTitleColor = "text-[#EF4444] dark:text-[#FCA5A5]";
  const dangerBorderColor = "border-[#F87171]/50 dark:border-[#F87171]/70";


  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full bg-[#8B5CF6]/20 dark:bg-[#8B5CF6]/30 flex items-center justify-center mb-4 shadow-lg ring-2 ring-[#8B5CF6]/70 dark:ring-[#A78BFA]/70 overflow-hidden">
          <img 
            src="https://raw.githubusercontent.com/riquelima/salaotest/refs/heads/main/logo1.png" 
            alt="Logo Salão" 
            className="w-full h-full object-cover" 
          />
        </div>
        <div className="flex justify-between items-center w-full">
            <h1 className={`text-3xl font-bold ${mainTextColor} text-center flex-grow`}>Configurações Gerais</h1>
            <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <h2 className={`text-xl font-semibold mb-4 ${cardTitleColor}`}>Informações do Salão</h2>
          <Input label="Nome da Cabeleireira" name="stylistName" value={formData.stylistName} onChange={handleInputChange} />
          <Textarea label="Descrição dos Serviços" name="serviceDescription" value={formData.serviceDescription} onChange={handleInputChange} rows={3}/>
          <Input label="Endereço do Salão Físico" name="salonAddress" value={formData.salonAddress} onChange={handleInputChange} />
          <Input label="Número do WhatsApp (com código do país, ex: 55119...)" name="whatsAppNumber" value={formData.whatsAppNumber} onChange={handleInputChange} placeholder="5511912345678" />
        </Card>

        <Card>
          <h2 className={`text-xl font-semibold mb-4 ${cardTitleColor}`}>Dias de Atendimento a Domicílio</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {DAYS_OF_WEEK.map((day, index) => (
              <label key={index} className={`flex items-center space-x-2 p-2 rounded-md hover:bg-[#8B5CF6]/10 dark:hover:bg-[#8B5CF6]/20 cursor-pointer transition-colors`}>
                <input
                  type="checkbox"
                  checked={formData.homeServiceDays.includes(index)}
                  onChange={() => handleHomeServiceDaysChange(index)}
                  className="form-checkbox h-5 w-5 accent-[#8B5CF6] rounded focus:ring-[#7C3AED] border-[#E5E7EB] dark:border-[#4B5563] bg-white dark:bg-[#374151]"
                />
                <span className={checkboxLabelColor}>{day}</span>
              </label>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className={`text-xl font-semibold mb-4 ${cardTitleColor}`}>Segurança</h2>
          <Input label="Nova Senha (mín. 4 caracteres)" type="password" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Deixe em branco para não alterar" />
          <Input label="Confirmar Nova Senha" type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </Card>

        <div className="mt-6 flex justify-end">
          <Button type="submit" variant="primary" size="lg">Salvar Configurações</Button>
        </div>
      </form>

      <Card>
        <h2 className={`text-xl font-semibold mb-4 ${cardTitleColor}`}>Gerenciamento de Dados</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button onClick={handleExportData} variant="secondary">
                Exportar Dados (Backup)
            </Button>
            <div>
                <label htmlFor="importFile" className={`block w-full text-center px-4 py-2 font-semibold rounded-lg shadow-sm cursor-pointer transition-colors bg-[#E5E7EB] hover:bg-[#D1D5DB] text-[#1F2937] dark:bg-[#374151] dark:hover:bg-[#4B5563] dark:text-[#F4F4F5]`}>
                    Importar Dados (Restaurar)
                </label>
                <input type="file" id="importFile" accept=".json" onChange={handleImportData} className="hidden" />
            </div>
        </div>
      </Card>

      <Card className={`border ${dangerBorderColor}`}>
        <h2 className={`text-xl font-semibold mb-4 ${dangerTitleColor}`}>Zona de Perigo</h2>
        <Button onClick={handleResetApp} variant="danger" className="w-full">
          Resetar Aplicativo (Apagar Todos os Dados)
        </Button>
        <p className={`text-xs ${secondaryTextColor} mt-2`}>
            Esta ação é irreversível e apagará todos os clientes, agendamentos e redefinirá as configurações.
        </p>
      </Card>

      <div className={`mt-8 pt-6 border-t border-[#E5E7EB] dark:border-[#374151] flex justify-center`}>
        <Button onClick={handleLogout} variant="ghost" size="lg">
          <LogoutIcon className="w-5 h-5 mr-2" /> Sair da Área Administrativa
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
