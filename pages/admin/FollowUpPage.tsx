
import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Client, Appointment } from '../../types';
import { Button, Card, Textarea, Input } from '../../components/ui';
import { WhatsAppIcon } from '../../components/icons';
import { formatDate, getWhatsAppLink, isClientOverdueForReturn } from '../../utils/helpers';
import { CLIENTS_KEY, APPOINTMENTS_KEY, FOLLOWUP_DAYS_KEY, FOLLOWUP_TEMPLATE_KEY, DEFAULT_FOLLOWUP_MESSAGE } from '../../constants';
import { useAppContext } from '../../contexts/AppContext';

const FollowUpPage: React.FC = () => {
  const { config, showNotification, theme } = useAppContext();
  const [clients] = useLocalStorage<Client[]>(CLIENTS_KEY, []);
  const [appointments] = useLocalStorage<Appointment[]>(APPOINTMENTS_KEY, []);

  const [daysThreshold, setDaysThreshold] = useLocalStorage<number>(FOLLOWUP_DAYS_KEY, 45);
  const [customMessageTemplate, setCustomMessageTemplate] = useLocalStorage<string>(
    FOLLOWUP_TEMPLATE_KEY,
    DEFAULT_FOLLOWUP_MESSAGE.replace('[Seu Nome/Salão]', config.stylistName)
  );

  const clientsForFollowUp = useMemo(() => {
    return clients
      .map(client => { 
        const clientApps = appointments.filter(app => app.clientName === client.name && app.status === 'completed');
        return {
          ...client,
          serviceCount: clientApps.length,
          lastServiceDate: clientApps.length > 0 
            ? clientApps.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
            : client.lastServiceDate,
        };
      })
      .filter(client => isClientOverdueForReturn(client.lastServiceDate, daysThreshold) && client.phone)
      .sort((a,b) => new Date(a.lastServiceDate || 0).getTime() - new Date(b.lastServiceDate || 0).getTime()); 
  }, [clients, appointments, daysThreshold]);

  const generateMessage = (clientName: string) => {
    const isLikelyFemale = clientName.toLowerCase().endsWith('a') || 
                           clientName.toLowerCase().endsWith('e') || 
                           clientName.toLowerCase().includes('maria') ||
                           clientName.toLowerCase().includes('ana'); 
    const pronome = isLikelyFemale ? 'ela' : 'ele';
    return customMessageTemplate
      .replace(/{cliente}/gi, clientName)
      .replace(/{pronome}/gi, pronome);
  };

  const handleSaveSettings = () => {
    // Settings are auto-saved by useLocalStorage hook
    showNotification("Configurações de lembrete salvas!", "success");
  };
  
  const mainTextColor = theme === 'dark' ? 'text-[#F4F4F5]' : 'text-[#111827]';
  const cardTitleColor = theme === 'dark' ? 'text-[#E5E7EB]' : 'text-[#1F2937]';
  const secondaryTextColor = theme === 'dark' ? 'text-[#D1D5DB]' : 'text-[#6B7280]'; // Corrected for light mode
  const mutedTextColor = theme === 'dark' ? 'text-[#9CA3AF]' : 'text-[#6B7280]';


  return (
    <div className="space-y-6">
      <h1 className={`text-3xl font-bold ${mainTextColor}`}>Mensagens de Retorno</h1>

      <Card className="p-4">
        <h2 className={`text-xl font-semibold mb-3 ${cardTitleColor}`}>Configurações de Lembrete</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
                <Input
                    label="Lembrar clientes que não retornam há mais de (dias):"
                    type="number"
                    id="daysThreshold"
                    value={daysThreshold}
                    onChange={(e) => setDaysThreshold(parseInt(e.target.value, 10) || 0)}
                    min="1"
                />
            </div>
        </div>
        <div className="mt-4">
            <Textarea
                label="Modelo da Mensagem (use {cliente} e {pronome})"
                value={customMessageTemplate}
                onChange={(e) => setCustomMessageTemplate(e.target.value)}
                rows={4}
            />
            <p className={`text-xs ${mutedTextColor} mt-1`}>Exemplo: Olá {`{cliente}`}! 😊 Que tal um novo corte para {`{pronome}`}?</p>
        </div>
        <div className="mt-4 flex justify-end">
            <Button onClick={handleSaveSettings}>Salvar Configurações</Button>
        </div>
      </Card>
      
      <Card>
        <div className="flex items-center mb-4">
            <h2 className={`text-xl font-semibold ${cardTitleColor}`}>
                Lembrar Clientes 
            </h2>
            <img 
              src="https://raw.githubusercontent.com/riquelima/salaotest/refs/heads/main/logoWhatsapp.png" 
              alt="WhatsApp Logo" 
              className="w-8 h-8 ml-3"
            />
             <span className={`ml-auto text-sm ${mutedTextColor}`}>({clientsForFollowUp.length} para lembrar)</span>
        </div>
        {clientsForFollowUp.length === 0 ? (
            <div className="text-center p-8">
                <WhatsAppIcon className={`w-16 h-16 mx-auto ${mutedTextColor} mb-4`} />
                <p className={`${mutedTextColor}`}>Nenhum cliente precisa de lembrete no momento com os critérios atuais.</p>
            </div>
        ) : (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {clientsForFollowUp.map(client => {
                const message = generateMessage(client.name);
                return (
                    <Card key={client.id} className="p-4 bg-[#F9FAFB] dark:bg-[#1E1E2F]/80 !shadow-md">
                        <h3 className={`font-semibold text-lg ${cardTitleColor}`}>{client.name}</h3>
                        <p className={`text-sm ${secondaryTextColor}`}>{client.phone}</p>
                        <p className={`text-sm ${mutedTextColor}`}>Último atendimento: {formatDate(client.lastServiceDate) || 'N/A'}</p>
                        <div className="mt-3 flex justify-end">
                            <Button
                            size="sm"
                            className='bg-[#4ADE80] hover:bg-[#22C55E] text-white' 
                            onClick={() => window.open(getWhatsAppLink(client.phone, message), '_blank')}
                            >
                            <WhatsAppIcon className="w-4 h-4 mr-1.5 text-white" /> Enviar WhatsApp
                            </Button>
                        </div>
                    </Card>
                );
                })}
            </div>
        )}
      </Card>
    </div>
  );
};

export default FollowUpPage;