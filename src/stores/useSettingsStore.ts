import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { SettingsState } from '@/types/settings.types';
import { DEFAULT_SETTINGS } from '@/constants/settings';

export const useSettingsStore = create<SettingsState>()(
  devtools(
    persist(
      (set) => ({
        ...DEFAULT_SETTINGS,

        updateSettings: (newSettings) => {
          set((state) => ({
            ...state,
            ...newSettings
          }));
        },

        updateTheme: (newTheme) => {
          set((state) => ({
            ...state,
            theme: {
              ...state.theme,
              ...newTheme
            }
          }));

          // Cập nhật CSS variables
          const root = document.documentElement;
          if (newTheme.primaryColor) {
            root.style.setProperty('--primary-color', newTheme.primaryColor);
          }
          if (newTheme.mode) {
            document.body.classList.toggle('dark', newTheme.mode === 'dark');
          }
          if (newTheme.fontSize) {
            root.style.setProperty('--base-font-size', {
              sm: '14px',
              md: '16px',
              lg: '18px'
            }[newTheme.fontSize]);
          }
        },

        resetSettings: () => {
          set(DEFAULT_SETTINGS);
        }
      }),
      {
        name: 'settings-storage'
      }
    )
  )
);

// Khởi tạo theme khi load app
const initializeTheme = () => {
  const { theme } = useSettingsStore.getState();
  const root = document.documentElement;

  root.style.setProperty('--primary-color', theme.primaryColor);
  document.body.classList.toggle('dark', theme.mode === 'dark');
  root.style.setProperty('--base-font-size', {
    sm: '14px',
    md: '16px',
    lg: '18px'
  }[theme.fontSize]);
};

// Gọi hàm khởi tạo
if (typeof window !== 'undefined') {
  initializeTheme();
} 