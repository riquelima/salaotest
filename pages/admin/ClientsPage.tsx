
import React, { useState, FormEvent, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Client, Appointment } from '../../types';
import { Button, Input, Textarea, Modal, Card, Select } from '../../components/ui';
import { PlusIcon, EditIcon, TrashIcon, WhatsAppIcon, SparklesIcon, UsersIcon, GridIcon, ListIcon } from '../../components/icons';
import { formatDate, generateId, getWhatsAppLink, isClientRecent, getMonthName } from '../../utils/helpers';
import { CLIENTS_KEY, APPOINTMENTS_KEY, PREDEFINED_CLIENTS } from '../../constants';
import { useAppContext } from '../../contexts/AppContext';

type ViewMode = 'grid' | 'list';

const ClientsPage: React.FC = () => {
  const { showNotification, theme } = useAppContext();
  const [clients, setClients] = useLocalStorage<Client[]>(CLIENTS_KEY, PREDEFINED_CLIENTS);
  const [appointments] = useLocalStorage<Appointment[]>(APPOINTMENTS_KEY, []);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Partial<Client> | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState<string>(''); 
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const location = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'add') {
      handleAddNew();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const handleAddNew = () => {
    setCurrentClient({ name: '', phone: '', notes: '', serviceCount: 0 });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (client: Client) => {
    setCurrentClient(client);
    setEditingId(client.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente e todo o seu histórico?")) {
      setClients(prev => prev.filter(c => c.id !== id));
      showNotification("Cliente excluído.", "info");
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!currentClient || !currentClient.name) {
      showNotification("O nome do cliente é obrigatório.", "error");
      return;
    }
    
    const clientAppointments = appointments.filter(app => app.clientName === currentClient.name && app.status === 'completed');
    const serviceCount = clientAppointments.length;
    const lastServiceDate = clientAppointments.length > 0 
        ? clientAppointments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
        : currentClient.lastServiceDate;

    const clientData: Client = {
      id: editingId || generateId(),
      name: currentClient.name!,
      phone: currentClient.phone || '',
      email: currentClient.email,
      notes: currentClient.notes,
      lastServiceDate: lastServiceDate,
      serviceCount: serviceCount,
    };

    if (editingId) {
      setClients(prev => prev.map(c => c.id === editingId ? clientData : c));
      showNotification("Cliente atualizado!", "success");
    } else {
      setClients(prev => [...prev, clientData]);
      showNotification("Cliente adicionado!", "success");
    }
    setIsModalOpen(false);
    setCurrentClient(null);
    setEditingId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentClient(prev => ({ ...prev, [name]: value }));
  };

  const filteredClients = useMemo(() => {
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
      .filter(client => {
        const nameMatch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
        const phoneMatch = client.phone.includes(searchTerm);
        
        let monthMatch = true;
        if (filterMonth && client.lastServiceDate) {
          const serviceYearMonth = client.lastServiceDate.substring(0, 7);
          monthMatch = serviceYearMonth === filterMonth;
        } else if (filterMonth && !client.lastServiceDate) {
          monthMatch = false;
        }
        
        return (nameMatch || phoneMatch) && monthMatch;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [clients, appointments, searchTerm, filterMonth]);

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    clients.forEach(client => {
      if (client.lastServiceDate) {
        months.add(client.lastServiceDate.substring(0, 7));
      }
    });
    return Array.from(months).sort().reverse().map(monthStr => ({
        value: monthStr,
        label: `${getMonthName(parseInt(monthStr.split('-')[1]) -1)}/${monthStr.split('-')[0]}`
    }));
  }, [clients]);

  const mainTextColor = theme === 'dark' ? 'text-[#F4F4F5]' : 'text-[#111827]';
  const cardTitleColor = theme === 'dark' ? 'text-[#E5E7EB]' : 'text-[#1F2937]';
  const secondaryTextColor = theme === 'dark' ? 'text-[#D1D5DB]' : 'text-[#6B7280]'; // Corrected secondary for light
  const mutedTextColor = theme === 'dark' ? 'text-[#9CA3AF]' : 'text-[#6B7280]';
  const tableHeaderColor = theme === 'dark' ? 'text-[#9CA3AF]' : 'text-[#6B7280]';
  const tableRowHover = theme === 'dark' ? 'dark:hover:bg-[#374151]/50' : 'hover:bg-[#F3F4F6]';
  const tableBorder = theme === 'dark' ? 'dark:divide-[#4B5563]' : 'divide-[#E5E7EB]';
  const tableHeaderBg = theme === 'dark' ? 'dark:bg-[#1F2937]' : 'bg-[#F9FAFB]';


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className={`text-3xl font-bold ${mainTextColor} text-center sm:text-left w-full sm:w-auto`}>Cadastro de Clientes</h1>
          <Button onClick={handleAddNew} variant="primary" className="w-full sm:w-auto">
          <PlusIcon className="w-5 h-5 mr-2" /> Novo Cliente
          </Button>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            options={[{value: '', label: "Filtrar por mês do último atendimento"}, ...availableMonths]}
            className="h-full"
          />
        </div>
        <div className="flex justify-end items-center gap-2">
            <span className={`text-sm ${mutedTextColor}`}>Visualizar como:</span>
            <Button 
                variant={viewMode === 'grid' ? 'primary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('grid')}
                aria-pressed={viewMode === 'grid'}
                title="Visualização em Grade"
            >
                <GridIcon className="w-5 h-5" />
            </Button>
            <Button 
                variant={viewMode === 'list' ? 'primary' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('list')}
                aria-pressed={viewMode === 'list'}
                title="Visualização em Lista"
            >
                <ListIcon className="w-5 h-5" />
            </Button>
        </div>
      </Card>

      {filteredClients.length === 0 ? (
        <Card className="text-center p-8">
            <UsersIcon className={`w-16 h-16 mx-auto ${mutedTextColor} mb-4`} />
            <p className={`${mutedTextColor}`}>Nenhum cliente encontrado. Adicione um novo cliente ou ajuste os filtros.</p>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map(client => (
            <Card key={client.id} className="flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className={`text-xl font-semibold ${cardTitleColor}`}>{client.name}</h3>
                  <div className="flex items-center gap-2">
                    {isClientRecent(client.lastServiceDate) && 
                      <span title="Atendido na última semana" className="px-2 py-0.5 text-xs bg-[#4ADE80]/20 text-[#16A34A] dark:bg-[#4ADE80]/30 dark:text-[#A7F3D0] rounded-full">📍 Recente</span>
                    }
                    {client.serviceCount >= 3 && 
                      <span title="Cliente recorrente" className="px-2 py-0.5 text-xs bg-[#8B5CF6]/20 text-[#7C3AED] dark:bg-[#8B5CF6]/30 dark:text-[#C4B5FD] rounded-full flex items-center gap-1">
                        <SparklesIcon className="w-3 h-3"/> VIP
                      </span>
                    }
                  </div>
                </div>
                {client.phone && (
                  <div className={`flex items-center text-sm ${secondaryTextColor} mt-1`}>
                    <a href={getWhatsAppLink(client.phone)} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center group">
                      <WhatsAppIcon className="w-4 h-4 mr-1 text-[#4ADE80] group-hover:text-[#22C55E]" /> {client.phone}
                    </a>
                  </div>
                )}
                <p className={`text-sm ${mutedTextColor}`}>Último atendimento: {formatDate(client.lastServiceDate) || 'N/A'}</p>
                <p className={`text-sm ${mutedTextColor}`}>Total de atendimentos: {client.serviceCount}</p>
                {client.notes && <p className={`mt-2 text-xs italic ${mutedTextColor} border-l-2 border-[#8B5CF6] dark:border-[#A78BFA] pl-2`}>Obs: {client.notes}</p>}
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button size="sm" variant="secondary" onClick={() => handleEdit(client)} title="Editar Cliente">
                  <EditIcon className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(client.id)} title="Excluir Cliente">
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : ( 
        <Card className="overflow-x-auto">
            <table className={`min-w-full divide-y ${tableBorder}`}>
                <thead className={tableHeaderBg}>
                    <tr>
                        <th scope="col" className={`px-4 py-3 text-left text-xs font-medium ${tableHeaderColor} uppercase tracking-wider`}>Nome</th>
                        <th scope="col" className={`px-4 py-3 text-left text-xs font-medium ${tableHeaderColor} uppercase tracking-wider`}>Contato</th>
                        <th scope="col" className={`px-4 py-3 text-left text-xs font-medium ${tableHeaderColor} uppercase tracking-wider`}>Últ. Atend.</th>
                        <th scope="col" className={`px-4 py-3 text-left text-xs font-medium ${tableHeaderColor} uppercase tracking-wider`}>Total Atend.</th>
                        <th scope="col" className={`px-4 py-3 text-left text-xs font-medium ${tableHeaderColor} uppercase tracking-wider`}>Status</th>
                        <th scope="col" className={`px-4 py-3 text-right text-xs font-medium ${tableHeaderColor} uppercase tracking-wider`}>Ações</th>
                    </tr>
                </thead>
                <tbody className={`bg-white dark:bg-[#2C2C3B]/80 divide-y ${tableBorder}`}>
                    {filteredClients.map(client => (
                        <tr key={client.id} className={tableRowHover}>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <div className={`text-sm font-medium ${mainTextColor}`}>{client.name}</div>
                                {client.notes && <div className={`text-xs ${mutedTextColor} truncate max-w-xs`} title={client.notes}>Obs: {client.notes}</div>}
                            </td>
                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${secondaryTextColor}`}>
                                {client.phone && (
                                    <a href={getWhatsAppLink(client.phone)} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center group">
                                    <WhatsAppIcon className="w-4 h-4 mr-1 text-[#4ADE80] group-hover:text-[#22C55E] flex-shrink-0" />
                                    {client.phone}
                                    </a>
                                )}
                            </td>
                            <td className={`px-4 py-3 whitespace-nowrap text-sm ${mutedTextColor}`}>{formatDate(client.lastServiceDate) || 'N/A'}</td>
                            <td className={`px-4 py-3 whitespace-nowrap text-sm text-center ${mutedTextColor}`}>{client.serviceCount}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-xs">
                                {isClientRecent(client.lastServiceDate) && 
                                <span title="Atendido na última semana" className="block my-0.5 px-2 py-0.5 bg-[#4ADE80]/20 text-[#16A34A] dark:bg-[#4ADE80]/30 dark:text-[#A7F3D0] rounded-full text-center">Recente</span>
                                }
                                {client.serviceCount >= 3 && 
                                <span title="Cliente recorrente" className="block my-0.5 px-2 py-0.5 bg-[#8B5CF6]/20 text-[#7C3AED] dark:bg-[#8B5CF6]/30 dark:text-[#C4B5FD] rounded-full flex items-center justify-center gap-1">
                                    <SparklesIcon className="w-3 h-3"/> VIP
                                </span>
                                }
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <Button size="sm" variant="secondary" onClick={() => handleEdit(client)} title="Editar Cliente">
                                    <EditIcon className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="danger" onClick={() => handleDelete(client.id)} title="Excluir Cliente">
                                    <TrashIcon className="w-4 h-4" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Card>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Editar Cliente" : "Novo Cliente"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome Completo*"
            name="name"
            value={currentClient?.name || ''}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Telefone (com DDD)"
            name="phone"
            type="tel"
            value={currentClient?.phone || ''}
            onChange={handleInputChange}
            placeholder="Ex: (11) 91234-5678"
          />
           <Input
            label="Email (Opcional)"
            name="email"
            type="email"
            value={currentClient?.email || ''}
            onChange={handleInputChange}
            placeholder="Ex: cliente@email.com"
          />
          <Textarea
            label="Observações"
            name="notes"
            value={currentClient?.notes || ''}
            onChange={handleInputChange}
            placeholder="Preferências, alergias, etc."
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">{editingId ? "Salvar Alterações" : "Adicionar Cliente"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClientsPage;