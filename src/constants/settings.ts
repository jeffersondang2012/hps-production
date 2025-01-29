export const DEFAULT_SETTINGS: AppSettings = {
  language: 'vi',
  currency: 'VND',
  dateFormat: 'dd/MM/yyyy',
  numberFormat: {
    decimal: ',',
    thousand: '.',
    precision: 0
  },
  theme: {
    mode: 'light',
    primaryColor: '#2563eb', // blue-600
    fontSize: 'md'
  }
};

export const SUPPORTED_LANGUAGES = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' }
];

export const SUPPORTED_CURRENCIES = [
  { value: 'VND', label: 'VND', symbol: '₫' },
  { value: 'USD', label: 'USD', symbol: '$' }
];

export const DATE_FORMAT_OPTIONS = [
  { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY' },
  { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY' },
  { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD' }
]; 