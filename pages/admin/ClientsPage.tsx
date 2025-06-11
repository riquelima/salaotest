import React, { useState, FormEvent, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Client, Appointment } from '../../types';
import { Button, Input, Textarea, Modal, Card } from '../../components/ui';
import { PlusIcon, EditIcon, TrashIcon, WhatsAppIcon, SparklesIcon, UsersIcon } from '../../components/icons';
import { formatDate, generateId, getWhatsAppLink, isClientRecent, getMonthName } from '../../utils/helpers';
import { CLIENTS_KEY, APPOINTMENTS_KEY } from '../../constants';
import { useAppContext } from '../../contexts/AppContext';

const ClientsPage: React.FC = () => {
  const { showNotification } = useAppContext();
  const [clients, setClients] = useLocalStorage<Client[]>(CLIENTS_KEY, []);
  const [appointments] = useLocalStorage<Appointment[]>(APPOINTMENTS_KEY, []);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState<Partial<Client> | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState<string>(''); // 'YYYY-MM'

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
      // Also consider deleting associated appointments or anonymizing them. For now, just client.
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
    
    // Update serviceCount and lastServiceDate based on appointments
    const clientAppointments = appointments.filter(app => app.clientName === currentClient.name && app.status === 'completed');
    const serviceCount = clientAppointments.length;
    const lastServiceDate = clientAppointments.length > 0 
        ? clientAppointments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date
        : currentClient.lastServiceDate;


    const clientData: Client = {
      id: editingId || generateId(),
      name: currentClient.name!,
      phone: currentClient.phone || '',
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
      .map(client => { // Recalculate service count and last service date for display
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
          monthMatch = false; // If filtering by month, clients without service date don't match
        }
        
        return (nameMatch || phoneMatch) && monthMatch;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [clients, appointments, searchTerm, filterMonth]);

  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    clients.forEach(client => {
      if (client.lastServiceDate) {
        months.add(client.lastServiceDate.substring(0, 7)); // YYYY-MM
      }
    });
    return Array.from(months).sort().reverse().map(monthStr => ({
        value: monthStr,
        label: `${getMonthName(parseInt(monthStr.split('-')[1]) -1)}/${monthStr.split('-')[0]}`
    }));
  }, [clients]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="flex flex-col items-center mb-4">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-purple-200 dark:bg-purple-700 flex items-center justify-center mb-3 shadow-lg ring-2 ring-purple-500 dark:ring-purple-400 overflow-hidden">
                <img 
                    src="https://raw.githubusercontent.com/riquelima/salaotest/refs/heads/main/logo1.png" 
                    alt="Logo Salão" 
                    className="w-full h-full object-cover" 
                />
            </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 text-center sm:text-left w-full sm:w-auto">Cadastro de Clientes</h1>
            <Button onClick={handleAddNew} variant="primary" className="w-full sm:w-auto">
            <PlusIcon className="w-5 h-5 mr-2" /> Novo Cliente
            </Button>
        </div>
      </div>


      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="p-2 border rounded-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="">Filtrar por mês do último atendimento</option>
            {availableMonths.map(month => (
              <option key={month.value} value={month.value}>{month.label}</option>
            ))}
          </select>
        </div>
      </Card>

      {filteredClients.length === 0 ? (
        <Card className="text-center p-8">
            <UsersIcon className="w-16 h-16 mx-auto text-slate-400 dark:text-slate-500 mb-4" />
            <p className="text-slate-500 dark:text-slate-400">Nenhum cliente encontrado. Adicione um novo cliente ou ajuste os filtros.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map(client => (
            <Card key={client.id} className="flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{client.name}</h3>
                  <div className="flex items-center gap-2">
                    {isClientRecent(client.lastServiceDate) && 
                      <span title="Atendido na última semana" className="px-2 py-0.5 text-xs bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100 rounded-full">📍 Recente</span>
                    }
                    {client.serviceCount >= 3 && 
                      <span title="Cliente recorrente" className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 dark:bg-purple-700 dark:text-purple-100 rounded-full flex items-center gap-1">
                        <SparklesIcon className="w-3 h-3"/> VIP
                      </span>
                    }
                  </div>
                </div>
                {client.phone && (
                  <div className="flex items-center text-sm text-slate-600 dark:text-slate-300 mt-1">
                    <a href={getWhatsAppLink(client.phone)} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center group">
                      <WhatsAppIcon className="w-4 h-4 mr-1 text-green-500 group-hover:text-green-600" /> {client.phone}
                    </a>
                  </div>
                )}
                <p className="text-sm text-slate-500 dark:text-slate-400">Último atendimento: {formatDate(client.lastServiceDate) || 'N/A'}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total de atendimentos: {client.serviceCount}</p>
                {client.notes && <p className="mt-2 text-xs italic text-slate-500 dark:text-slate-400 border-l-2 border-purple-500 pl-2">Obs: {client.notes}</p>}
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button size="sm" variant="secondary" onClick={() => handleEdit(client)}>
                  <EditIcon className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(client.id)}>
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
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