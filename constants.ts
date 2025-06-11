
import { AppConfig } from './types';

export const APP_NAME = "Salão Infantil Encantado";
export const DEFAULT_STYLIST_NAME = "Tia Cuca";
export const DEFAULT_SERVICE_DESCRIPTION = "Cortes divertidos e estilosos para a criançada!";
export const DEFAULT_HOME_SERVICE_DAYS = [1, 2]; // Monday, Tuesday
export const DEFAULT_SALON_ADDRESS = "Rua da Alegria, 123 - Bairro Feliz";
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

export const THEME_KEY = 'salonAppTheme';
export const AUTH_KEY = 'salonAppAuth';
export const CONFIG_KEY = 'salonAppConfig';
export const CLIENTS_KEY = 'salonAppClients';
export const APPOINTMENTS_KEY = 'salonAppAppointments';
export const FINANCIALS_KEY = 'salonAppFinancials';

export const DAYS_OF_WEEK = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];