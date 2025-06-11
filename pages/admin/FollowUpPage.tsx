import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Client, Appointment } from '../../types';
import { Button, Card, Textarea } from '../../components/ui';
import { WhatsAppIcon } from '../../components/icons';
import { formatDate, getWhatsAppLink, isClientOverdueForReturn } from '../../utils/helpers';
import { CLIENTS_KEY, APPOINTMENTS_KEY } from '../../constants';
import { useAppContext } from '../../contexts/AppContext';

const FollowUpPage: React.FC = () => {
  const { config, showNotification } = useAppContext();
  const [clients] = useLocalStorage<Client[]>(CLIENTS_KEY, []);
  const [appointments] = useLocalStorage<Appointment[]>(APPOINTMENTS_KEY, []);

  const [daysThreshold, setDaysThreshold] = useState(45);
  const [customMessageTemplate, setCustomMessageTemplate] = useState(
    `Olá {cliente}! 😊 Faz um tempinho que não nos vemos! Que tal agendar um novo corte para {pronome}? ${config.stylistName} está com saudades!`
  );

  const clientsForFollowUp = useMemo(() => {
    return clients
      .map(client => { // Ensure latest service date and count
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
      .sort((a,b) => new Date(a.lastServiceDate || 0).getTime() - new Date(b.lastServiceDate || 0).getTime()); // oldest first
  }, [clients, appointments, daysThreshold]);

  const generateMessage = (clientName: string) => {
    // Basic gender assumption from name ending (very naive)
    const isLikelyFemale = clientName.toLowerCase().endsWith('a') || clientName.toLowerCase().endsWith('e'); // simplistic
    const pronome = isLikelyFemale ? 'ela' : 'ele';
    return customMessageTemplate
      .replace('{cliente}', clientName)
      .replace('{pronome}', pronome);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => showNotification("Mensagem copiada!", "success"))
      .catch(() => showNotification("Erro ao copiar mensagem.", "error"));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Mensagens de Retorno</h1>

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-3 text-slate-700 dark:text-slate-200">Configurações de Lembrete</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
                <label htmlFor="daysThreshold" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Lembrar clientes que não retornam há mais de (dias):
                </label>
                <input
                    type="number"
                    id="daysThreshold"
                    value={daysThreshold}
                    onChange={(e) => setDaysThreshold(parseInt(e.target.value, 10) || 0)}
                    className="mt-1 block w-full p-2 border rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:ring-purple-500 focus:border-purple-500"
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
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Exemplo: Olá {`{cliente}`}! 😊 Que tal um novo corte para {`{pronome}`}?</p>
        </div>
      </Card>

      {clientsForFollowUp.length === 0 ? (
         <Card className="text-center p-8">
            <WhatsAppIcon className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Nenhum cliente precisa de lembrete no momento com os critérios atuais.</p>
        </Card>
      ) : (
        <Card>
          <h2 className="text-xl font-semibold mb-4 text-slate-700 dark:text-slate-200">
            Clientes para Enviar Lembrete ({clientsForFollowUp.length})
          </h2>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {clientsForFollowUp.map(client => {
              const message = generateMessage(client.name);
              return (
                <div key={client.id} className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg shadow">
                  <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-100">{client.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Telefone: {client.phone}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Último atendimento: {formatDate(client.lastServiceDate) || 'N/A'}</p>
                  <div className="mt-3 p-3 bg-slate-200 dark:bg-slate-700 rounded-md">
                    <p className="text-sm text-slate-700 dark:text-slate-200 whitespace-pre-wrap">{message}</p>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <Button size="sm" onClick={() => handleCopyToClipboard(message)}>
                      Copiar Mensagem
                    </Button>
                    <a
                      href={getWhatsAppLink(client.phone, message)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-semibold rounded-lg shadow-md bg-green-500 hover:bg-green-600 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 ease-in-out"
                    >
                      <WhatsAppIcon className="w-4 h-4 mr-1.5" /> Abrir no WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default FollowUpPage;