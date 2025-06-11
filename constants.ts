
import { AppConfig, Client } from './types';

export const APP_NAME = "Salão Infantil Encantado";
export const DEFAULT_STYLIST_NAME = "Tia Déa | Salão Móvel Infantil";
export const DEFAULT_SERVICE_DESCRIPTION = "Cortes divertidos e estilosos para a criançada, no conforto do seu lar ou em nosso espaço!";
export const DEFAULT_HOME_SERVICE_DAYS = [1, 2]; // Monday, Tuesday
export const DEFAULT_SALON_ADDRESS = "Rua da Alegria, 123 - Bairro Feliz (Consulte sobre atendimento móvel)";
export const DEFAULT_WHATSAPP_NUMBER = "5511912345678";
export const ADMIN_DEFAULT_PASSWORD = "1234"; // Simple default password

export const INITIAL_APP_CONFIG: AppConfig = {
  stylistName: DEFAULT_STYLIST_NAME,
  serviceDescription: DEFAULT_SERVICE_DESCRIPTION,
  homeServiceDays: DEFAULT_HOME_SERVICE_DAYS,
  salonAddress: DEFAULT_SALON_ADDRESS,
  whatsAppNumber: DEFAULT_WHATSAPP_NUMBER,
  adminPassword: ADMIN_DEFAULT_PASSWORD,
};

export const PREDEFINED_CLIENTS: Client[] = [
  {
    id: 'default-client-henrique-lima', // Static ID for the predefined client
    name: 'Henrique Lima',
    phone: '71985431158',
    email: 'henrique@test.com',
    notes: 'Alérgico a gilete.',
    lastServiceDate: undefined, 
    serviceCount: 0,
  }
];

export const THEME_KEY = 'salonAppTheme';
export const AUTH_KEY = 'salonAppAuth';
export const CONFIG_KEY = 'salonAppConfig';
export const CLIENTS_KEY = 'salonAppClients';
export const APPOINTMENTS_KEY = 'salonAppAppointments';
export const FINANCIALS_KEY = 'salonAppFinancials'; 

export const DAYS_OF_WEEK = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export const FOLLOWUP_DAYS_KEY = 'salonAppFollowupDays';
export const FOLLOWUP_TEMPLATE_KEY = 'salonAppFollowupTemplate';
export const DEFAULT_FOLLOWUP_MESSAGE = `Olá {cliente}! 😊 Faz um tempinho que não nos vemos! Que tal agendar um novo corte para {pronome}? [Seu Nome/Salão] está com saudades!`;
