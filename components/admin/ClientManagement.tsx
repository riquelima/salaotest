
import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Client } from '../../types';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Card from '../ui/Card';
import { PlusIcon, PencilIcon, TrashIcon, UserGroupIcon } from '../icons';
import { DAYS_FOR_RECURRING_TAG, LIGHT_THEME_CONFIG, DARK_THEME_CONFIG } from '../../constants';

const ClientForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  existingClient?: Client | null;
  onSave: (client: Omit<Client, 'id' | 'appointmentCount'> | Client) => void;
}> = ({ isOpen, onClose, existingClient, onSave }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (existingClient) {
      setName(existingClient.name);
      setPhone(existingClient.phone);
      setNotes(existingClient.notes || '');
    } else {
      setName('');
      setPhone('');
      setNotes('');
    }
  }, [existingClient, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Nome e telefone são obrigatórios.');
      return;
    }
    const clientData = { name, phone, notes };
    if (existingClient) {
      onSave({ ...clientData, id: existingClient.id, appointmentCount: existingClient.appointmentCount });
    } else {
      onSave(clientData);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existingClient ? "Editar Cliente" : "Novo Cliente"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Nome Completo" value={name} onChange={e => setName(e.target.value)} required />
        <Input type="tel" label="Telefone/WhatsApp" value={phone} onChange={e => setPhone(e.target.value)} placeholder="(XX) XXXXX-XXXX" required />
        <Textarea label="Observações" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Preferências, alergias, etc." />
        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit">{existingClient ? "Salvar Alterações" : "Cadastrar Cliente"}</Button>
        </div>
      </form>
    </Modal>
  );
};

const ClientManagement: React.FC = () => {
  const { clients, addClient, updateClient, deleteClient } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState(''); // YYYY-MM format

  const handleSaveClient = (clientData: Omit<Client, 'id' | 'appointmentCount'> | Client) => {
    if ('id' in clientData) {
      updateClient(clientData);
    } else {
      addClient(clientData);
    }
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };
  
  const openNewModal = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleDeleteClient = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este cliente e todos os seus agendamentos? Esta ação não pode ser desfeita.")) {
      deleteClient(id);
    }
  };

  const filteredClients = useMemo(() => {
    return clients.filter(client => {
      const nameMatch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
      const phoneMatch = client.phone.includes(searchTerm);
      
      let monthMatch = true;
      if (filterMonth && client.lastAppointmentDate) {
        const lastAppMonth = client.lastAppointmentDate.substring(0, 7); // YYYY-MM
        monthMatch = lastAppMonth === filterMonth;
      } else if (filterMonth && !client.lastAppointmentDate) {
        monthMatch = false; 
      }

      return (nameMatch || phoneMatch) && monthMatch;
    }).sort((a,b) => a.name.localeCompare(b.name));
  }, [clients, searchTerm, filterMonth]);
  
  const getClientBadge = (client: Client) => {
    const baseClasses = "ml-2 px-2 py-0.5 text-xs rounded-full text-white dark:text-white";
    if (client.appointmentCount >= DAYS_FOR_RECURRING_TAG) {
      return <span className={`${baseClasses} bg-[${LIGHT_THEME_CONFIG.green}] dark:bg-[${DARK_THEME_CONFIG.green}]`}>Recorrente</span>;
    }
    if (client.lastAppointmentDate) {
        const lastDate = new Date(client.lastAppointmentDate);
        const today = new Date();
        const diffTime = Math.abs(today.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 7) {
             return <span className={`${baseClasses} bg-[${LIGHT_THEME_CONFIG.lightBlue}] dark:bg-[${DARK_THEME_CONFIG.lightBlue}]`}>Recente</span>;
        }
    }
    return null;
  };


  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h2 className={`text-2xl font-semibold text-[${LIGHT_THEME_CONFIG.textPrimary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}] flex items-center`}>
            <UserGroupIcon className={`w-7 h-7 mr-2 text-[${LIGHT_THEME_CONFIG.primary}] dark:text-[${DARK_THEME_CONFIG.iconColor}]`} />
            Gestão de Clientes
          </h2>
          <Button onClick={openNewModal} leftIcon={<PlusIcon className="w-5 h-5" />}>
            Novo Cliente
          </Button>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input 
                type="search" 
                label="Buscar por nome ou telefone:"
                placeholder="Digite para buscar..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <Input 
                type="month"
                label="Filtrar por mês do último atendimento:"
                value={filterMonth}
                onChange={e => setFilterMonth(e.target.value)}
            />
        </div>
      </Card>

      {filteredClients.length === 0 ? (
        <Card className="text-center py-8">
          <p className={`text-lg text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}]`}>Nenhum cliente encontrado.</p>
           {searchTerm === '' && filterMonth === '' && <p className={`text-sm text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}] mt-2`}>Clique em "Novo Cliente" para começar.</p>}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map(client => (
            <Card key={client.id} className={`flex flex-col justify-between hover:border-[${LIGHT_THEME_CONFIG.primary}] dark:hover:border-[${DARK_THEME_CONFIG.focusRing}]`}>
              <div>
                <div className="flex justify-between items-start">
                    <h3 className={`text-lg font-semibold text-[${LIGHT_THEME_CONFIG.textPrimary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}]`}>{client.name} {getClientBadge(client)}</h3>
                </div>
                <p className={`text-sm text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}]`}>{client.phone}</p>
                {client.lastAppointmentDate && (
                  <p className={`text-xs text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}] mt-1`}>
                    Último atendimento: {new Date(client.lastAppointmentDate).toLocaleDateString('pt-BR')}
                  </p>
                )}
                <p className={`text-xs text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}]`}>Total de atendimentos: {client.appointmentCount}</p>
                {client.notes && <p className={`text-xs text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}] mt-2 italic`}>Obs: {client.notes}</p>}
              </div>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="ghost" size="sm" onClick={() => openEditModal(client)} aria-label="Editar">
                  <PencilIcon className="w-4 h-4" />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteClient(client.id)} aria-label="Excluir">
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ClientForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        existingClient={editingClient}
        onSave={handleSaveClient}
      />
    </div>
  );
};

export default ClientManagement;