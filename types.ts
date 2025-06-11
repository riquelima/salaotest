
export interface Client {
  id: string;
  name: string;
  phone: string;
  lastServiceDate?: string; // ISO date string
  notes?: string;
  serviceCount: number;
}

export enum AppointmentLocation {
  HOME = 'Domicílio',
  SALON = 'Salão',
}

export interface Appointment {
  id: string;
  clientName: string; 
  date: string; // ISO date string with time
  location: AppointmentLocation;
  notes?: string;
  serviceValue?: number;
  completed: boolean;
}

export interface FinancialRecord {
  id: string; 
  appointmentId: string;
  date: string; // ISO date string
  amount: number;
  description: string;
}

export interface AppConfig {
  stylistName: string;
  serviceDescription: string;
  homeServiceDays: number[]; // 0 for Sunday, 1 for Monday, etc.
  salonAddress: string;
  whatsAppNumber: string;
  adminPassword: string; // Plain text for simplicity, as per "simple password"
}

export type Theme = 'light' | 'dark';

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  retrievedContext?: {
    uri: string;
    title: string;
  };
}
