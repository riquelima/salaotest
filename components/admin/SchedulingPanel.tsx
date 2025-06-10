
import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { Appointment, AppointmentLocation, Client } from '../../types';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import Card from '../ui/Card';
import { PlusIcon, PencilIcon, TrashIcon, CalendarIcon, HomeIcon, BuildingStorefrontIcon, InformationCircleIcon } from '../icons';
import { HOME_SERVICE_DAYS, LIGHT_THEME_CONFIG, DARK_THEME_CONFIG } from '../../constants';

const AppointmentForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  clients: Client[];
  existingAppointment?: Appointment | null;
  onSave: (appointment: Omit<Appointment, 'id'> | Appointment) => void;
}> = ({ isOpen, onClose, clients, existingAppointment, onSave }) => {
  const [clientId, setClientId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState<AppointmentLocation>(AppointmentLocation.DOMICILIO);
  const [notes, setNotes] = useState('');
  const [serviceValue, setServiceValue] = useState<number | string>('');

  useEffect(() => {
    if (existingAppointment) {
      setClientId(existingAppointment.clientId);
      const dateTime = new Date(existingAppointment.date);
      setDate(dateTime.toISOString().split('T')[0]);
      setTime(dateTime.toTimeString().split(' ')[0].substring(0, 5));
      setLocation(existingAppointment.location);
      setNotes(existingAppointment.notes || '');
      setServiceValue(existingAppointment.serviceValue || '');
    } else {
      setClientId('');
      setDate(new Date().toISOString().split('T')[0]); 
      setTime('');
      setLocation(AppointmentLocation.DOMICILIO);
      setNotes('');
      setServiceValue('');
    }
  }, [existingAppointment, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !date || !time) {
      alert('Por favor, preencha cliente, data e hora.');
      return;
    }
    const selectedClient = clients.find(c => c.id === clientId);
    if (!selectedClient) {
        alert('Cliente não encontrado.');
        return;
    }

    const appointmentDateTime = new Date(`${date}T${time}`);

    const appointmentData = {
      clientId,
      clientName: selectedClient.name,
      date: appointmentDateTime.toISOString(),
      location,
      notes,
      serviceValue: Number(serviceValue) || undefined,
    };
    
    if (existingAppointment) {
        onSave({ ...appointmentData, id: existingAppointment.id });
    } else {
        onSave(appointmentData);
    }
    onClose();
  };

  const clientOptions = clients.map(c => ({ value: c.id, label: c.name }));
  const locationOptions = Object.values(AppointmentLocation).map(loc => ({ value: loc, label: loc }));
  
  const isHomeServiceDay = useMemo(() => {
    if(!date) return true; 
    const dayOfWeek = new Date(date + "T00:00:00").getDay(); 
    // Sunday is 0, Monday is 1, Tuesday is 2
    return HOME_SERVICE_DAYS.toLowerCase().includes("segunda") && dayOfWeek === 1 ||
           HOME_SERVICE_DAYS.toLowerCase().includes("terça") && dayOfWeek === 2;
  }, [date]);


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={existingAppointment ? "Editar Agendamento" : "Novo Agendamento"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select label="Cliente" options={[{value: '', label: 'Selecione um cliente'}, ...clientOptions]} value={clientId} onChange={e => setClientId(e.target.value)} required />
        <Input type="date" label="Data" value={date} onChange={e => setDate(e.target.value)} required />
        <Input type="time" label="Hora" value={time} onChange={e => setTime(e.target.value)} required />
        <Select label="Local" options={locationOptions} value={location} onChange={e => setLocation(e.target.value as AppointmentLocation)} required />
        {location === AppointmentLocation.DOMICILIO && !isHomeServiceDay && date && (
            <p className="text-xs text-orange-500 dark:text-orange-400 flex items-center">
                <InformationCircleIcon className="w-4 h-4 mr-1 inline-block" />
                Atenção: A data selecionada não é um dia de atendimento a domicílio ({HOME_SERVICE_DAYS}).
            </p>
        )}
        <Input type="number" label="Valor do Serviço (R$)" placeholder="Ex: 50.00" value={serviceValue} onChange={e => setServiceValue(e.target.value)} min="0" step="0.01" />
        <Textarea label="Observações" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Alergias, preferências, etc." />
        <div className="flex justify-end space-x-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit">{existingAppointment ? "Salvar Alterações" : "Agendar"}</Button>
        </div>
      </form>
    </Modal>
  );
};

const SchedulingPanel: React.FC = () => {
  const { appointments, addAppointment, updateAppointment, deleteAppointment, clients } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleSaveAppointment = (appointmentData: Omit<Appointment, 'id'> | Appointment) => {
    if ('id' in appointmentData) {
      updateAppointment(appointmentData);
    } else {
      addAppointment(appointmentData);
    }
  };

  const openEditModal = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };
  
  const openNewModal = () => {
    setEditingAppointment(null);
    setIsModalOpen(true);
  };

  const handleDeleteAppointment = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este agendamento?")) {
      deleteAppointment(id);
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter(app => {
        const appDate = new Date(app.date).toISOString().split('T')[0];
        const dateMatch = !filterDate || appDate === filterDate;
        const client = clients.find(c => c.id === app.clientId);
        const searchMatch = !searchTerm || 
                            (client && client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (app.notes && app.notes.toLowerCase().includes(searchTerm.toLowerCase()));
        return dateMatch && searchMatch;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [appointments, filterDate, searchTerm, clients]);
  
  const appointmentsByDay = useMemo(() => {
    return filteredAppointments.reduce((acc, curr) => {
        const day = new Date(curr.date).toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        if (!acc[day]) {
            acc[day] = [];
        }
        acc[day].push(curr);
        return acc;
    }, {} as Record<string, Appointment[]>);
  }, [filteredAppointments]);


  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
          <h2 className={`text-2xl font-semibold text-[${LIGHT_THEME_CONFIG.textPrimary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}] flex items-center`}>
            <CalendarIcon className={`w-7 h-7 mr-2 text-[${LIGHT_THEME_CONFIG.primary}] dark:text-[${DARK_THEME_CONFIG.iconColor}]`} />
            Gerenciar Agendamentos
          </h2>
          <Button onClick={openNewModal} leftIcon={<PlusIcon className="w-5 h-5" />}>
            Novo Agendamento
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input 
                type="date" 
                label="Filtrar por data:"
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
            />
            <Input 
                type="text"
                label="Buscar por cliente/observação:"
                placeholder="Digite para buscar..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
        </div>
      </Card>

      {Object.keys(appointmentsByDay).length === 0 && (
        <Card className="text-center py-8">
          <p className={`text-lg text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}]`}>Nenhum agendamento encontrado para os filtros selecionados.</p>
          {(!filterDate && !searchTerm) && <p className={`text-sm text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}] mt-2`}>Clique em "Novo Agendamento" para começar.</p>}
        </Card>
      )}

      {Object.entries(appointmentsByDay).map(([day, dayAppointments]) => (
        <div key={day}>
            <h3 className={`text-xl font-semibold my-4 text-[${LIGHT_THEME_CONFIG.primary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}] capitalize`}>{day}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dayAppointments.map(app => {
                const client = clients.find(c => c.id === app.clientId);
                const locationBgColor = app.location === AppointmentLocation.DOMICILIO 
                    ? `bg-[${LIGHT_THEME_CONFIG.lightBlue}] dark:bg-[${DARK_THEME_CONFIG.lightBlue}]`
                    : `bg-[${LIGHT_THEME_CONFIG.green}] dark:bg-[${DARK_THEME_CONFIG.green}]`;
                return (
                <Card key={app.id} className={`flex flex-col justify-between hover:border-[${LIGHT_THEME_CONFIG.primary}] dark:hover:border-[${DARK_THEME_CONFIG.focusRing}]`}>
                    <div>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className={`text-lg font-semibold text-[${LIGHT_THEME_CONFIG.textPrimary}] dark:text-[${DARK_THEME_CONFIG.textPrimary}]`}>{client?.name || 'Cliente Desconhecido'}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full text-white dark:text-white flex items-center ${locationBgColor}`}>
                        {app.location === AppointmentLocation.DOMICILIO ? <HomeIcon className="w-3 h-3 mr-1" /> : <BuildingStorefrontIcon className="w-3 h-3 mr-1" />}
                        {app.location}
                        </span>
                    </div>
                    <p className={`text-sm text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}]`}>
                        <CalendarIcon className="w-4 h-4 inline mr-1 text-current" />
                        {new Date(app.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {app.serviceValue && <p className={`text-sm text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}]`}>Valor: R$ {app.serviceValue.toFixed(2)}</p>}
                    {app.notes && <p className={`text-xs text-[${LIGHT_THEME_CONFIG.textSecondary}] dark:text-[${DARK_THEME_CONFIG.textSecondary}] mt-2 italic`}>Obs: {app.notes}</p>}
                    </div>
                    <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => openEditModal(app)} aria-label="Editar">
                        <PencilIcon className="w-4 h-4" />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDeleteAppointment(app.id)} aria-label="Excluir">
                        <TrashIcon className="w-4 h-4" />
                    </Button>
                    </div>
                </Card>
                );
            })}
            </div>
        </div>
      ))}

      <AppointmentForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        clients={clients}
        existingAppointment={editingAppointment}
        onSave={handleSaveAppointment}
      />
    </div>
  );
};

export default SchedulingPanel;