import React from 'react';
import { NotificationToast } from '../molecules/NotificationToast';
import { useNotificationStore } from '@/stores/useNotificationStore';

export const NotificationContainer = () => {
  const { notifications, remove } = useNotificationStore();

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-sm space-y-2">
      {notifications.map((notification) => (
        <NotificationToast
          key={notification.id}
          {...notification}
          onClose={() => remove(notification.id)}
        />
      ))}
    </div>
  );
}; 