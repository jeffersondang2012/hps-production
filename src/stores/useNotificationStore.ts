import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { NotificationState, UINotification, ConfirmOptions } from '@/types/notification.types';

const DEFAULT_DURATION = 5000; // 5 giây

export const useNotificationStore = create<NotificationState>()(
  devtools((set, get) => ({
    notifications: [],

    show: (notification) => {
      const id = Date.now().toString();
      const newNotification: UINotification = {
        id,
        isClosable: true,
        duration: DEFAULT_DURATION,
        ...notification
      };

      set((state) => ({
        notifications: [...state.notifications, newNotification]
      }));

      // Tự động xóa notification sau duration
      if (newNotification.duration) {
        setTimeout(() => {
          get().remove(id);
        }, newNotification.duration);
      }
    },

    showSuccess: (message, title = 'Thành công') => {
      get().show({
        type: 'success',
        title,
        message
      });
    },

    showError: (message, title = 'Lỗi') => {
      get().show({
        type: 'error',
        title,
        message,
        duration: 0, // Error không tự động ẩn
      });
    },

    showWarning: (message, title = 'Cảnh báo') => {
      get().show({
        type: 'warning',
        title,
        message
      });
    },

    showInfo: (message, title = 'Thông báo') => {
      get().show({
        type: 'info',
        title,
        message
      });
    },

    showConfirm: (options: ConfirmOptions) => {
      return new Promise<boolean>((resolve) => {
        const id = Date.now().toString();
        const notification: UINotification = {
          id,
          type: 'confirm',
          isClosable: false,
          duration: 0,
          title: options.title,
          message: options.message,
          onConfirm: () => {
            get().remove(id);
            resolve(true);
          },
          onCancel: () => {
            get().remove(id);
            resolve(false);
          },
          confirmText: options.confirmText || 'Xác nhận',
          cancelText: options.cancelText || 'Hủy'
        };

        set((state) => ({
          notifications: [...state.notifications, notification]
        }));
      });
    },

    remove: (id) => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id)
      }));
    },

    clear: () => {
      set({ notifications: [] });
    }
  }))
); 