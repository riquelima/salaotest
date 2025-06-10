

export const APP_NAME = "Salão Móvel Infantil";
export const HAIRDRESSER_NAME = "Tia Déa";

// New structured content for the main presentation card
export const HAIRDRESSER_ABOUT_TITLE = "🎀 Sobre a Profissional";
export const HAIRDRESSER_ABOUT_LINES = [
  { icon: "💇‍♀️", text: "Com mais de <strong>21 anos de experiência</strong> como cabeleireira." },
  { icon: "✨", text: "<strong>Especialista em corte infantil</strong>, com carinho e paciência." },
  { icon: "🧒👧", text: "Atendimento <strong>seguro, acolhedor e personalizado.</strong>" },
  { icon: "📞", text: "<strong>Agende agora mesmo seu horário!</strong>" }
];

export const CAROUSEL_IMAGES = [
  { src: 'https://raw.githubusercontent.com/riquelima/salaotest/refs/heads/main/corte1.png', alt: 'Criança com corte de cabelo moderno e estiloso' },
  { src: 'https://raw.githubusercontent.com/riquelima/salaotest/refs/heads/main/corte2.png', alt: 'Menino sorrindo após corte de cabelo no salão' },
  { src: 'https://raw.githubusercontent.com/riquelima/salaotest/refs/heads/main/corte3.png', alt: 'Menina com novo corte de cabelo infantil e franja' },
  { src: 'https://raw.githubusercontent.com/riquelima/salaotest/refs/heads/main/corte4.png', alt: 'Criança feliz com seu corte de cabelo temático' },
];

export const HAIRDRESSER_PHOTO_URL = 'https://picsum.photos/seed/tiadea/200/200';


export const WHATSAPP_NUMBER = "5511912345678"; // Replace with actual number
export const HOME_SERVICE_DAYS = "Segundas e Terças";
export const SALON_ADDRESS = "Rua das Tesourinhas Felizes, 123 - Bairro Alegria";
export const SALON_WALKIN_NOTICE = "Atendimento no salão por ordem de chegada.";

// Theme Configurations
export const LIGHT_THEME_CONFIG = {
  background: "#F9FAFB",
  cardBackground: "#FFFFFF",
  primary: "#6366F1", // Indigo
  primaryHover: "#4F46E5", // Darker Indigo
  secondary: "#A1A1AA", // Text secondary
  accent: "#F97316", // Orange for accents if needed
  textPrimary: "#111827",
  textSecondary: "#6B7280",
  textLight: "#F4F4F5", // For dark text on light primary buttons
  borderColor: "#E5E7EB",
  iconColor: "#6B7280",
  focusRing: "#6366F1",
  // Contextual colors for light theme
  green: "#10B981",
  orange: "#F97316",
  lightBlue: "#60A5FA",
  lightPink: "#F9A8D4",
  // Chart specific
  chartGrid: "#E5E7EB",
  chartText: "#6B7280",
};

export const DARK_THEME_CONFIG = {
  background: "#191919", // Notion-like very dark gray
  cardBackground: "#262626", // Notion-like slightly lighter card background
  primary: "#333333", // Notion-like button primary (medium gray)
  primaryHover: "#404040", // Notion-like button primary hover (lighter gray)
  secondary: "#555555", // For secondary elements or text
  accent: "#A0A0A0", // Light gray for accents or secondary text on dark
  textPrimary: "#E0E0E0", // Notion-like primary text (off-white)
  textSecondary: "#A0A0A0", // Notion-like secondary text (medium gray)
  textLight: "#E0E0E0", // Consistent for text on dark primary buttons
  borderColor: "#303030", // Notion-like subtle border
  iconColor: "#B0B0B0", // Light gray for icons
  focusRing: "#555555", // Visible gray for focus rings
  // Contextual colors for dark theme
  green: "#10B981", // Keep vibrant or adjust if needed for Notion style
  orange: "#F97316", // Keep vibrant
  lightBlue: "#60A5FA", // Keep vibrant
  lightPink: "#F9A8D4", // Keep vibrant
  // Chart specific
  chartGrid: "#303030",
  chartText: "#A0A0A0",
};


export const ADMIN_PASSWORD = "1234";

export const GEMINI_MODEL_TEXT = "gemini-2.5-flash-preview-04-17";

export const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export const DAYS_FOR_RECURRING_TAG = 3;
export const DAYS_FOR_FOLLOW_UP = 45;

// LEGACY THEME_COLORS - to be phased out. Updated to reflect new dark theme for any remaining direct usages.
export const THEME_COLORS = {
  background: DARK_THEME_CONFIG.background, 
  primary: DARK_THEME_CONFIG.primary, 
  primaryHover: DARK_THEME_CONFIG.primaryHover,
  secondary: LIGHT_THEME_CONFIG.secondary, 
  accent: LIGHT_THEME_CONFIG.accent, 
  textLight: DARK_THEME_CONFIG.textPrimary,
  textDark: LIGHT_THEME_CONFIG.textPrimary,
  cardBackground: DARK_THEME_CONFIG.cardBackground,
  borderColor: DARK_THEME_CONFIG.borderColor,
};