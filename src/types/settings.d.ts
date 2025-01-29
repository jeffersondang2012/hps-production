export interface AppSettings {
  theme: 'light' | 'dark';
  language: 'vi' | 'en';
  currency: 'VND' | 'USD';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY';
  numberFormat: {
    decimal: string;
    thousand: string;
    precision: number;
  };
} 