
import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { Client, Appointment, FinancialRecord, AppointmentLocation } from '../types';
import { DAYS_FOR_RECURRING_TAG } from '../constants';

interface DataContextType {
  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'appointmentCount'>) => void;
  updateClient: (client: Client) => void;
  deleteClient: (clientId: string) => void;
  getClientById: (clientId: string) => Client | undefined;
  
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (appointment: Appointment) => void;
  deleteAppointment: (appointmentId: string) => void;
  getAppointmentsByClientId: (clientId: string) => Appointment[];

  financialRecords: FinancialRecord[];
  addFinancialRecord: (record: Omit<FinancialRecord, 'id'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clients, setClients] = useLocalStorage<Client[]>('clients', []);
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('appointments', []);
  const [financialRecords, setFinancialRecords] = useLocalStorage<FinancialRecord[]>('financialRecords', []);

  const getClientById = useCallback((clientId: string) => clients.find(c => c.id === clientId), [clients]);

  const addClient = (clientData: Omit<Client, 'id' | 'appointmentCount'>) => {
    const newClient: Client = { ...clientData, id: Date.now().toString(), appointmentCount: 0 };
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
  };
  
  const deleteClient = (clientId: string) => {
    setClients(prev => prev.filter(c => c.id !== clientId));
    // Also delete associated appointments and financial records
    const clientAppointments = appointments.filter(app => app.clientId === clientId);
    clientAppointments.forEach(app => deleteAppointment(app.id));
  };

  const addAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = { ...appointmentData, id: Date.now().toString() };
    setAppointments(prev => [...prev, newAppointment].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    
    // Update client's last appointment date and count
    const client = getClientById(appointmentData.clientId);
    if (client) {
      const updatedClient = {
        ...client,
        lastAppointmentDate: newAppointment.date,
        appointmentCount: (client.appointmentCount || 0) + 1,
      };
      updateClient(updatedClient);
    }

    // Add financial record if serviceValue is present
    if (appointmentData.serviceValue && appointmentData.serviceValue > 0) {
      addFinancialRecord({
        appointmentId: newAppointment.id,
        date: newAppointment.date,
        amount: appointmentData.serviceValue,
        description: `Serviço para ${appointmentData.clientName}`
      });
    }
  };

  const updateAppointment = (updatedAppointment: Appointment) => {
    setAppointments(prev => prev.map(a => a.id === updatedAppointment.id ? updatedAppointment : a).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
     // Potentially update financial record if serviceValue changed
    const existingRecord = financialRecords.find(fr => fr.appointmentId === updatedAppointment.id);
    if (updatedAppointment.serviceValue && updatedAppointment.serviceValue > 0) {
      if (existingRecord) {
        setFinancialRecords(prev => prev.map(fr => fr.id === existingRecord.id ? {...fr, amount: updatedAppointment.serviceValue!, date: updatedAppointment.date} : fr));
      } else {
         addFinancialRecord({
            appointmentId: updatedAppointment.id,
            date: updatedAppointment.date,
            amount: updatedAppointment.serviceValue,
            description: `Serviço para ${updatedAppointment.clientName}`
         });
      }
    } else if (existingRecord) {
        // Remove financial record if service value becomes 0 or undefined
        setFinancialRecords(prev => prev.filter(fr => fr.id !== existingRecord.id));
    }
  };

  const deleteAppointment = (appointmentId: string) => {
    const appointmentToDelete = appointments.find(a => a.id === appointmentId);
    setAppointments(prev => prev.filter(a => a.id !== appointmentId));
    // Also delete associated financial record
    setFinancialRecords(prev => prev.filter(fr => fr.appointmentId !== appointmentId));

    if (appointmentToDelete) {
        const client = getClientById(appointmentToDelete.clientId);
        if (client) {
            const clientAppointments = appointments.filter(app => app.clientId === client.id && app.id !== appointmentId);
            const lastAppointment = clientAppointments.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
            updateClient({
                ...client,
                appointmentCount: Math.max(0, (client.appointmentCount || 1) - 1),
                lastAppointmentDate: lastAppointment ? lastAppointment.date : undefined,
            });
        }
    }
  };
  
  const getAppointmentsByClientId = useCallback((clientId: string) => {
    return appointments.filter(app => app.clientId === clientId).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [appointments]);

  const addFinancialRecord = (recordData: Omit<FinancialRecord, 'id'>) => {
    const newRecord: FinancialRecord = { ...recordData, id: Date.now().toString() };
    setFinancialRecords(prev => [...prev, newRecord].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  return (
    <DataContext.Provider value={{ 
      clients, addClient, updateClient, deleteClient, getClientById,
      appointments, addAppointment, updateAppointment, deleteAppointment, getAppointmentsByClientId,
      financialRecords, addFinancialRecord 
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
