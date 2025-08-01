
import React, { useState, useEffect, FormEvent } from 'react';
import { useLocation } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Appointment, AppointmentLocation, Client, AppointmentStatus } from '../../types';
import { Button, Input, Select, Textarea, Modal, Card } from '../../components/ui';
import { PlusIcon, EditIcon, TrashIcon, CheckCircleIcon, XCircleIcon, HomeIcon, StoreIcon, CalendarIcon, BanIcon } from '../../components/icons';
import { formatDate, generateId, filterAppointmentsByPeriod, getDayOfWeek, getStatusLabel, formatCurrency } from '../../utils/helpers';
import { APPOINTMENTS_KEY, CLIENTS_KEY } from '../../constants';
import { useAppContext } from '../../contexts/AppContext';

const SchedulingPage: React.FC = () => {
  const { config, showNotification, theme } = useAppContext();
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>(APPOINTMENTS_KEY, []);
  const [clients] = useLocalStorage<Client[]>(CLIENTS_KEY, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<Partial<Appointment> | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('week');
  const [currentDisplayDate, setCurrentDisplayDate] = useState(new Date());

  const locationHook = useLocation(); 
  useEffect(() => {
    const params = new URLSearchParams(locationHook.search);
    if (params.get('action') === 'add') {
      handleAddNew();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationHook.search]);


  const getRoundedDefaultDateTime = (): string => {
    const now = new Date();
    const minutes = now.getMinutes();

    if (minutes <= 7) { 
        now.setMinutes(0,0,0);
    } else if (minutes <= 22) { 
        now.setMinutes(15,0,0);
    } else if (minutes <= 37) { 
        now.setMinutes(30,0,0);
    } else if (minutes <= 52) { 
        now.setMinutes(45,0,0);
    } else { 
        now.setMinutes(0,0,0);
        now.setHours(now.getHours() + 1);
    }
    return now.toISOString().substring(0, 16);
  };

  const handleAddNew = () => {
    setCurrentAppointment({
      clientName: '',
      date: getRoundedDefaultDateTime(), 
      location: AppointmentLocation.SALON,
      status: 'pending',
      notes: '',
      serviceValue: undefined,
    });
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (appointment: Appointment) => {
    const editableDate = new Date(appointment.date).toISOString().substring(0,16);
    setCurrentAppointment({ ...appointment, date: editableDate });
    setEditingId(appointment.id);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este agendamento?")) {
      setAppointments(prev => prev.filter(app => app.id !== id));
      showNotification("Agendamento excluído.", "info");
    }
  };

  const handleSetStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
    showNotification(`Status do agendamento alterado para: ${getStatusLabel(newStatus)}`, "success");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!currentAppointment || !currentAppointment.clientName || !currentAppointment.date || !currentAppointment.status) {
        showNotification("Preencha os campos obrigatórios: Nome do Cliente, Data/Hora e Status.", "error");
        return;
    }

    const appointmentData: Appointment = {
      id: editingId || generateId(),
      clientName: currentAppointment.clientName!,
      date: new Date(currentAppointment.date!).toISOString(), 
      location: currentAppointment.location || AppointmentLocation.SALON,
      status: currentAppointment.status!,
      notes: currentAppointment.notes,
      serviceValue: currentAppointment.serviceValue ? Number(currentAppointment.serviceValue) : undefined,
    };

    if (editingId) {
      setAppointments(prev => prev.map(app => app.id === editingId ? appointmentData : app));
      showNotification("Agendamento atualizado!", "success");
    } else {
      setAppointments(prev => [...prev, appointmentData]);
      showNotification("Agendamento criado!", "success");
    }
    setIsModalOpen(false);
    setCurrentAppointment(null);
    setEditingId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let val: string | number | AppointmentStatus = value;
    if (type === 'number') val = parseFloat(value);
    
    setCurrentAppointment(prev => ({ ...prev, [name]: val }));
  };

  const filteredAppointments = filterAppointmentsByPeriod(appointments, viewMode, currentDisplayDate)
    .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const changeDateDisplay = (amount: number) => {
    const newDate = new Date(currentDisplayDate);
    if (viewMode === 'day') {
      newDate.setDate(currentDisplayDate.getDate() + amount);
    } else if (viewMode === 'week') {
      newDate.setDate(currentDisplayDate.getDate() + (amount * 7));
    } else {
      newDate.setMonth(currentDisplayDate.getMonth() + amount);
    }
    setCurrentDisplayDate(newDate);
  };
  
  const getDisplayDateRange = () => {
    if (viewMode === 'day') {
      return formatDate(currentDisplayDate.toISOString());
    } else if (viewMode === 'week') {
      const startOfWeek = new Date(currentDisplayDate);
      startOfWeek.setDate(currentDisplayDate.getDate() - currentDisplayDate.getDay() + (currentDisplayDate.getDay() === 0 ? -6 : 1) ); 
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6); 
      return `${formatDate(startOfWeek.toISOString())} - ${formatDate(endOfWeek.toISOString())}`;
    } else {
      return `${new Date(currentDisplayDate.getFullYear(), currentDisplayDate.getMonth(), 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}`;
    }
  };
  
  const getStatusStyle = (status: AppointmentStatus): { borderColor: string, textColor: string, iconColorClass: string } => {
    switch(status) {
      case 'pending': return { borderColor: 'border-[#FBBF24]', textColor: 'text-[#FBBF24]', iconColorClass: 'text-[#FBBF24]' }; // Amarelo
      case 'confirmed': return { borderColor: 'border-[#60A5FA]', textColor: 'text-[#60A5FA]', iconColorClass: 'text-[#60A5FA]' }; // Azul
      case 'completed': return { borderColor: 'border-[#4ADE80]', textColor: 'text-[#4ADE80]', iconColorClass: 'text-[#4ADE80]' }; // Verde
      case 'cancelled': return { borderColor: 'border-[#F87171]', textColor: 'text-[#F87171]', iconColorClass: 'text-[#F87171]' }; // Vermelho
      case 'missed': return { borderColor: 'border-[#F87171]', textColor: 'text-[#F87171]', iconColorClass: 'text-[#F87171]' }; // Vermelho
      default: return { borderColor: 'border-[#E5E7EB] dark:border-[#4B5563]', textColor: 'text-[#6B7280] dark:text-[#9CA3AF]', iconColorClass: 'text-[#6B7280] dark:text-[#9CA3AF]' };
    }
  };


  const isToday = (dateString: string) => {
    const appDate = new Date(dateString);
    const today = new Date();
    return appDate.getFullYear() === today.getFullYear() &&
           appDate.getMonth() === today.getMonth() &&
           appDate.getDate() === today.getDate();
  };
  
  const mainTextColor = theme === 'dark' ? 'text-[#F4F4F5]' : 'text-[#111827]';
  const cardTitleColor = theme === 'dark' ? 'text-[#E5E7EB]' : 'text-[#1F2937]';
  const secondaryTextColor = theme === 'dark' ? 'text-[#D1D5DB]' : 'text-[#374151]';
  const mutedTextColor = theme === 'dark' ? 'text-[#9CA3AF]' : 'text-[#6B7280]';


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className={`text-3xl font-bold ${mainTextColor}`}>Agenda de Atendimentos</h1>
        <Button onClick={handleAddNew} variant="primary">
          <PlusIcon className="w-5 h-5 mr-2" /> Novo Agendamento
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setViewMode('day')} variant={viewMode === 'day' ? 'primary' : 'secondary'}>Dia</Button>
            <Button size="sm" onClick={() => setViewMode('week')} variant={viewMode === 'week' ? 'primary' : 'secondary'}>Semana</Button>
            <Button size="sm" onClick={() => setViewMode('month')} variant={viewMode === 'month' ? 'primary' : 'secondary'}>Mês</Button>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => changeDateDisplay(-1)} variant="ghost">Anterior</Button>
            <span className={`font-semibold ${secondaryTextColor} text-center w-40 sm:w-48`}>{getDisplayDateRange()}</span>
            <Button size="sm" onClick={() => changeDateDisplay(1)} variant="ghost">Próximo</Button>
          </div>
        </div>
      </Card>
      
      {filteredAppointments.length === 0 ? (
        <Card className="text-center p-8">
            <CalendarIcon className={`w-16 h-16 mx-auto ${mutedTextColor} mb-4`} />
            <p className={`${mutedTextColor}`}>Nenhum agendamento para este período.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.map(app => {
            const statusStyle = getStatusStyle(app.status);
            return (
              <Card key={app.id} className={`relative transition-all duration-300 border-l-4 ${statusStyle.borderColor} ${isToday(app.date) && (app.status === 'pending' || app.status === 'confirmed') ? 'ring-2 ring-[#8B5CF6] shadow-lg' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-xl font-semibold ${app.status === 'cancelled' || app.status === 'completed' ? `line-through ${mutedTextColor}` : cardTitleColor}`}>{app.clientName}</h3>
                  {app.location === AppointmentLocation.HOME ? <HomeIcon className="w-6 h-6 text-[#60A5FA]" title="Domicílio"/> : <StoreIcon className="w-6 h-6 text-[#4ADE80]" title="Salão"/>}
                </div>
                <p className={`text-sm ${secondaryTextColor}`}>
                  {formatDate(app.date, true)} ({getDayOfWeek(app.date)}) 
                </p>
                <p className={`text-sm ${mutedTextColor}`}>Local: {app.location}</p>
                <p className={`text-sm font-medium ${statusStyle.textColor}`}>Status: <span className={`font-bold`}>{getStatusLabel(app.status)}</span></p>
                {app.serviceValue && <p className={`text-sm ${mutedTextColor}`}>Valor: {formatCurrency(app.serviceValue)}</p>}
                {app.notes && <p className={`mt-2 text-xs italic ${mutedTextColor} border-l-2 border-[#8B5CF6] dark:border-[#A78BFA] pl-2`}>Obs: {app.notes}</p>}
                
                <div className="mt-4 flex flex-wrap gap-2 justify-end">
                  {app.status !== 'completed' && app.status !== 'cancelled' && (
                      <Button size="sm" variant="ghost" onClick={() => handleSetStatus(app.id, 'completed')} title="Marcar como concluído">
                          <CheckCircleIcon className={`w-5 h-5 ${getStatusStyle('completed').iconColorClass}`}/>
                      </Button>
                  )}
                  {app.status === 'completed' && (
                      <Button size="sm" variant="ghost" onClick={() => handleSetStatus(app.id, 'pending')} title="Reverter para pendente">
                          <XCircleIcon className={`w-5 h-5 ${getStatusStyle('pending').iconColorClass}`}/>
                      </Button>
                  )}
                  {app.status !== 'cancelled' && app.status !== 'completed' && (
                      <Button size="sm" variant="ghost" onClick={() => handleSetStatus(app.id, 'cancelled')} title="Cancelar agendamento">
                           <BanIcon className={`w-5 h-5 ${getStatusStyle('cancelled').iconColorClass}`} />
                      </Button>
                  )}
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(app)} title="Editar">
                    <EditIcon className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => handleDelete(app.id)} title="Excluir">
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Editar Agendamento" : "Novo Agendamento"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome do Cliente*"
            name="clientName"
            value={currentAppointment?.clientName || ''}
            onChange={handleInputChange}
            list="client-suggestions"
            required
          />
          <datalist id="client-suggestions">
            {clients.map(client => <option key={client.id} value={client.name} />)}
          </datalist>

          <Input
            label="Data e Hora*"
            type="datetime-local"
            name="date"
            value={currentAppointment?.date || ''}
            onChange={handleInputChange}
            step="900" 
            required
            className="dark:[color-scheme:dark]" 
          />
          <Select
            label="Local*"
            name="location"
            value={currentAppointment?.location || AppointmentLocation.SALON}
            onChange={handleInputChange}
            options={[
              { value: AppointmentLocation.SALON, label: "Salão" },
              { value: AppointmentLocation.HOME, label: "Domicílio" }
            ]}
            required
          />
           <Select
            label="Status*"
            name="status"
            value={currentAppointment?.status || 'pending'}
            onChange={handleInputChange}
            options={[
              { value: 'pending', label: getStatusLabel('pending') },
              { value: 'confirmed', label: getStatusLabel('confirmed') },
              { value: 'completed', label: getStatusLabel('completed') },
              { value: 'missed', label: getStatusLabel('missed') },
              { value: 'cancelled', label: getStatusLabel('cancelled') },
            ]}
            required
          />
          <Input
            label="Valor do Atendimento (R$)"
            type="number"
            name="serviceValue"
            value={currentAppointment?.serviceValue || ''}
            onChange={handleInputChange}
            step="0.01"
            placeholder="Ex: 50.00"
          />
          <Textarea
            label="Observações"
            name="notes"
            value={currentAppointment?.notes || ''}
            onChange={handleInputChange}
            placeholder="Alguma preferência ou detalhe importante?"
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="primary">{editingId ? "Salvar Alterações" : "Adicionar Agendamento"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SchedulingPage;
