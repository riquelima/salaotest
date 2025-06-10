
import React, { useState, useMemo, useCallback } from 'react';
import { useData } from '../../contexts/DataContext';
import { Client } from '../../types';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Textarea from '../ui/Textarea';
import { ChatBubbleLeftRightIcon, SparklesIcon, CheckCircleIcon, InformationCircleIcon } from '../icons';
import { DAYS_FOR_FOLLOW_UP, LIGHT_THEME_CONFIG, DARK_THEME_CONFIG } from '../../constants';
import { generateFollowUpMessage } from '../../services/geminiService';

interface ClientFollowUp extends Client {
  daysSinceLastAppointment: number;
  generatedMessage?: string;
  isGenerating?: boolean;
  messageCopied?: boolean;
}

const FollowUpMessages: React.FC = () => {
  const { clients } = useData();
  const [followUpList, setFollowUpList] = useState<ClientFollowUp[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const identifyClientsForFollowUp = useCallback(() => {
    setIsLoadingList(true);
    const today = new Date();
    const list: ClientFollowUp[] = [];

    clients.forEach(client => {
      if (client.lastAppointmentDate) {
        const lastDate = new Date(client.lastAppointmentDate);
        const diffTime = Math.abs(today.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > DAYS_FOR_FOLLOW_UP) {
          list.push({ ...client, daysSinceLastAppointment: diffDays });
        }
      }
    });
    setFollowUpList(list.sort((a,b) => b.daysSinceLastAppointment - a.daysSinceLastAppointment));
    setIsLoadingList(false);
  }, [clients]);

  React.useEffect(() => {
    identifyClientsForFollowUp();
  }, [clients, identifyClientsForFollowUp]); 

  const handleGenerateMessage = async (clientId: string) => {
    setFollowUpList(prevList =>
      prevList.map(c => c.id === clientId ? { ...c, isGenerating: true, generatedMessage: undefined } : c)
    );

    const client = followUpList.find(c => c.id === clientId);
    if (client) {
      try {
        const message = await generateFollowUpMessage(client.name);
        setFollowUpList(prevList =>
          prevList.map(c => c.id === clientId ? { ...c, generatedMessage: message, isGenerating: false } : c)
        );
      } catch (error) {
        console.error("Failed to generate message:", error);
        setFollowUpList(prevList =>
          prevList.map(c => c.id === clientId ? { ...c, isGenerating: false, generatedMessage: "Erro ao gerar mensagem." } : c)
        );
      }
    }
  };

  const handleCopyToClipboard = (clientId: string, message?: string) => {
    if (!message) return;
    navigator.clipboard.writeText(message).then(() => {
        setFollowUpList(prevList =>
            prevList.map(c => c.id === clientId ? { ...c, messageCopied: true } : c)
        );
        setTimeout(() => {
            setFollowUpList(prevList =>
                prevList.map(c => c.id === clientId ? { ...c, messageCopied: false } : c)
            );
        }, 2000);
    }).catch(err => console.error('Failed to copy message: ', err));
  };
  
  const selectedClientCount = useMemo(() => {
    return followUpList.filter(c => c.generatedMessage).length;
  }, [followUpList]);

  const exportForWhatsapp = () => {
    let textToCopy = `Lista de clientes para contato (${selectedClientCount}):\n\n`;
    followUpList.forEach(client => {
        if(client.generatedMessage){
            textToCopy += `Cliente: ${client.name}\nTelefone: ${client.phone}\nMensagem Sugerida: ${client.generatedMessage}\n-----------------------------\n`;
        }
    });
    navigator.clipboard.writeText(textToCopy)
        .then(() => alert(`${selectedClientCount} mensagens copiadas para a área de transferência!`))
        .catch(err => alert('Erro ao copiar: ' + err));
  };


  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h2 className={`text-2xl font-semibold text-[${LIGHT_THEME_CONFIG.textPrimary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}] flex items-center`}>
            <ChatBubbleLeftRightIcon className={`w-7 h-7 mr-2 text-[${LIGHT_THEME_CONFIG.primary}] dark:text-[${DARK_THEME_CONFIG.iconColor}]`} />
            Mensagens de Retorno
          </h2>
          <Button onClick={identifyClientsForFollowUp} disabled={isLoadingList}>
            {isLoadingList ? 'Atualizando...' : 'Atualizar Lista'}
          </Button>
        </div>
        <p className={`text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}]`}>
          Clientes que realizaram o último corte há mais de {DAYS_FOR_FOLLOW_UP} dias.
        </p>
      </Card>
      
      {followUpList.length > 0 && (
        <Card>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-2 sm:mb-0">
                <h3 className={`text-lg font-semibold text-[${LIGHT_THEME_CONFIG.textPrimary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}] mb-2 sm:mb-0`}>Clientes para Contato ({followUpList.length})</h3>
                {selectedClientCount > 0 && (
                    <Button onClick={exportForWhatsapp} size="sm" variant="ghost">
                        Copiar {selectedClientCount} Mensagens Selecionadas
                    </Button>
                )}
            </div>
        </Card>
      )}


      {isLoadingList ? (
        <Card className="text-center py-8"><p className={`text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}]`}>Carregando lista de clientes...</p></Card>
      ) : followUpList.length === 0 ? (
        <Card className="text-center py-8">
          <p className={`text-lg text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}]`}>Nenhum cliente precisa de acompanhamento no momento.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {followUpList.map(client => (
            <Card key={client.id} className={`hover:border-[${LIGHT_THEME_CONFIG.primary}] dark:hover:border-[${DARK_THEME_CONFIG.focusRing}]`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                  <h3 className={`text-lg font-semibold text-[${LIGHT_THEME_CONFIG.textPrimary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}]`}>{client.name}</h3>
                  <p className={`text-sm text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}]`}>{client.phone}</p>
                  <p className={`text-xs text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}]`}>
                    Último corte há {client.daysSinceLastAppointment} dias 
                    ({client.lastAppointmentDate ? new Date(client.lastAppointmentDate).toLocaleDateString('pt-BR') : 'N/A'})
                  </p>
                </div>
                <Button 
                  onClick={() => handleGenerateMessage(client.id)} 
                  disabled={client.isGenerating}
                  leftIcon={<SparklesIcon className="w-4 h-4" />}
                  size="sm"
                  className="mt-3 sm:mt-0"
                  variant="primary" // Use primary button, it will be themed
                >
                  {client.isGenerating ? 'Gerando...' : (client.generatedMessage ? 'Gerar Novamente' : 'Sugerir Mensagem (IA)')}
                </Button>
              </div>
              {client.generatedMessage && (
                <div className={`mt-4 pt-4 border-t border-[${LIGHT_THEME_CONFIG.borderColor}] dark:border-[${DARK_THEME_CONFIG.borderColor}]`}>
                  <Textarea
                    label="Mensagem Sugerida:"
                    value={client.generatedMessage}
                    readOnly
                    rows={3}
                    className="mb-2"
                  />
                  <Button 
                    onClick={() => handleCopyToClipboard(client.id, client.generatedMessage)}
                    size="sm"
                    variant="secondary"
                    leftIcon={client.messageCopied ? <CheckCircleIcon className={`w-4 h-4 text-green-500 dark:text-green-400`}/> : undefined }
                  >
                    {client.messageCopied ? 'Copiado!' : 'Copiar Mensagem'}
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
       <Card className={`mt-6 bg-indigo-50 dark:bg-zinc-800/50 border-indigo-200 dark:border-zinc-700/50`}>
            <h3 className={`text-lg font-semibold text-[${LIGHT_THEME_CONFIG.primary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}] mb-2 flex items-center`}>
                <InformationCircleIcon className="w-5 h-5 mr-2"/>
                Como usar esta seção:
            </h3>
            <ol className={`list-decimal list-inside text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}] space-y-1 text-sm`}>
                <li>A lista acima mostra clientes que podem estar precisando de um novo corte.</li>
                <li>Clique em "Sugerir Mensagem (IA)" para que o Gemini crie uma mensagem amigável.</li>
                <li>Revise a mensagem gerada e, se gostar, clique em "Copiar Mensagem".</li>
                <li>Cole a mensagem no WhatsApp do cliente para lembrá-lo de agendar.</li>
                <li>Use o botão "Copiar X Mensagens Selecionadas" para copiar todas as mensagens geradas e os dados dos clientes de uma vez.</li>
            </ol>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Lembrete: O uso do gerador de mensagens por IA requer uma chave de API do Gemini configurada.
            </p>
        </Card>
    </div>
  );
};

export default FollowUpMessages;