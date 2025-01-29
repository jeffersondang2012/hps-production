export interface AppTheme {
  mode: 'light' | 'dark';
  primaryColor: string;
  fontSize: 'sm' | 'md' | 'lg';
}

export interface AppSettings {
  language: 'vi' | 'en';
  currency: 'VND' | 'USD';
  dateFormat: string;
  numberFormat: {
    decimal: string;
    thousand: string;
    precision: number;
  };
  theme: AppTheme;
}

export interface SettingsState extends AppSettings {
  // Actions
  updateSettings: (settings: Partial<AppSettings>) => void;
  updateTheme: (theme: Partial<AppTheme>) => void;
  resetSettings: () => void;
} 