
export interface Client {
  id: string;
  name: string;
  phone: string;
  lastAppointmentDate?: string; // ISO string
  notes?: string;
  appointmentCount: number;
}

export enum AppointmentLocation {
  DOMICILIO = "A Domicílio",
  SALAO = "Salão",
}

export interface Appointment {
  id:string;
  clientId: string;
  clientName: string; // Denormalized for easier display
  date: string; // ISO string for date and time
  location: AppointmentLocation;
  notes?: string;
  serviceValue?: number;
}

export interface FinancialRecord {
  id: string;
  appointmentId: string;
  date: string; // ISO string
  amount: number;
  description: string;
}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  retrievedContext?: {
    text?: string;
  };
}
