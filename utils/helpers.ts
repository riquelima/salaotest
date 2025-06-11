
import { Appointment, Client, FinancialRecord, AppointmentLocation, AppointmentStatus } from '../types';
import { DAYS_OF_WEEK } from '../constants';

export const formatDate = (dateString?: string, includeTime: boolean = false): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Data inválida';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    if (includeTime) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${formattedDate} ${hours}:${minutes}`;
    }
    return formattedDate;
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return 'Data inválida';
  }
};

export const formatCurrency = (value?: number): string => {
  if (value === undefined || value === null) return 'R$ 0,00';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Adjusted exportToCSV to handle generic data structure, specific mapping happens at call site.
export const exportToCSV = <T extends object,>(data: T[], filename: string, columns: { key: keyof T, label: string }[]): void => {
  if (data.length === 0) {
    alert("Não há dados para exportar.");
    return;
  }

  const header = columns.map(col => col.label).join(',') + '\n';
  
  const rows = data.map(item => {
    return columns.map(col => {
      const cellItemValue = item[col.key]; 
      let processedValue: string;

      if (typeof cellItemValue === 'string') {
        processedValue = `"${cellItemValue.replace(/"/g, '""')}"`;
      } else if (typeof cellItemValue === 'number') {
        processedValue = String(cellItemValue);
      } else if (cellItemValue instanceof Date) { 
        processedValue = formatDate(cellItemValue.toISOString());
      } else if (cellItemValue === null || cellItemValue === undefined) {
        processedValue = "";
      } else {
        processedValue = String(cellItemValue); 
      }
      return processedValue;
    }).join(',');
  }).join('\n');

  const csvContent = header + rows;
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};


export const getDayOfWeek = (dateString: string): string => {
  const date = new Date(dateString);
  return DAYS_OF_WEEK[date.getDay()];
};

export const isFutureDate = (dateString: string): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Compare dates only
  return new Date(dateString) >= today;
};

export const filterAppointmentsByPeriod = (appointments: Appointment[], period: 'day' | 'week' | 'month', currentDate: Date = new Date()): Appointment[] => {
  const startOfCurrentDate = new Date(currentDate);
  startOfCurrentDate.setHours(0,0,0,0);

  if (period === 'day') {
    const endOfCurrentDate = new Date(startOfCurrentDate);
    endOfCurrentDate.setHours(23,59,59,999);
    return appointments.filter(app => {
      const appDate = new Date(app.date);
      return appDate >= startOfCurrentDate && appDate <= endOfCurrentDate;
    });
  } else if (period === 'week') {
    const dayOfWeek = startOfCurrentDate.getDay(); // 0 (Sun) - 6 (Sat)
    const startDate = new Date(startOfCurrentDate);
    // Adjust to start week on Monday
    startDate.setDate(startOfCurrentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); 
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6); // End of Sunday
    endDate.setHours(23,59,59,999);

    return appointments.filter(app => {
      const appDate = new Date(app.date);
      return appDate >= startDate && appDate <= endDate;
    });
  } else if (period === 'month') {
    const firstDayOfMonth = new Date(startOfCurrentDate.getFullYear(), startOfCurrentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(startOfCurrentDate.getFullYear(), startOfCurrentDate.getMonth() + 1, 0);
    lastDayOfMonth.setHours(23,59,59,999);
    
    return appointments.filter(app => {
      const appDate = new Date(app.date);
      return appDate >= firstDayOfMonth && appDate <= lastDayOfMonth;
    });
  }
  return appointments;
};

export const getMonthName = (monthIndex: number): string => {
  const date = new Date();
  date.setMonth(monthIndex);
  return date.toLocaleString('pt-BR', { month: 'long' });
};

export const getWhatsAppLink = (phone: string, message?: string): string => {
  const cleanPhone = phone.replace(/\D/g, '');
  let url = `https://wa.me/${cleanPhone}`;
  if (message) {
    url += `?text=${encodeURIComponent(message)}`;
  }
  return url;
};

export const isClientRecent = (lastServiceDate?: string): boolean => {
  if (!lastServiceDate) return false;
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return new Date(lastServiceDate) > sevenDaysAgo;
};

export const isClientOverdueForReturn = (lastServiceDate?: string, daysThreshold: number = 45): boolean => {
  if (!lastServiceDate) return true; 
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - daysThreshold);
  return new Date(lastServiceDate) < thresholdDate;
};

export const getStatusLabel = (status: AppointmentStatus): string => {
  switch (status) {
    case 'pending': return 'Pendente';
    case 'confirmed': return 'Confirmado';
    case 'completed': return 'Concluído';
    case 'cancelled': return 'Cancelado';
    case 'missed': return 'Faltou';
    default: return 'Desconhecido';
  }
};