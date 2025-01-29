import { FC } from 'react';
import { useNotificationStore } from '@/stores/useNotificationStore';
import { NotificationToast } from './NotificationToast';

export const NotificationList: FC = () => {
  const { notifications, remove } = useNotificationStore();

  return (
    <div className="fixed top-4 right-4 z-50 w-96 space-y-2">
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