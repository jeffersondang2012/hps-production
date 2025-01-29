import React, { useEffect } from 'react';
import { Icon } from '../atoms/Icon';
import { UINotification } from '@/types/notification.types';
import { Button } from '../atoms/Button';
import clsx from 'clsx';

interface NotificationToastProps extends UINotification {
  onClose: () => void;
}

export const NotificationToast = ({
  type,
  title,
  message,
  isClosable,
  onClose,
  onConfirm,
  onCancel,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy'
}: NotificationToastProps) => {
  useEffect(() => {
    return () => {
      // Cleanup nếu cần
    };
  }, []);

  const icons = {
    success: 'CheckCircleIcon' as const,
    error: 'XCircleIcon' as const,
    warning: 'ExclamationTriangleIcon' as const,
    info: 'InformationCircleIcon' as const,
    confirm: 'QuestionMarkCircleIcon' as const
  };

  const colors = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    confirm: 'bg-blue-50 text-blue-800 border-blue-200'
  };

  return (
    <div
      className={clsx(
        'flex items-start p-4 mb-2 rounded-lg border shadow-sm',
        colors[type]
      )}
      role="alert"
    >
      <Icon
        name={icons[type]}
        className="w-5 h-5 mt-0.5 mr-3"
      />
      
      <div className="flex-1 min-w-0">
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm opacity-90">{message}</p>
        
        {type === 'confirm' && (
          <div className="mt-4 flex space-x-2">
            <Button
              variant="primary"
              className="text-xs px-3 py-1"
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
            <Button
              variant="outline"
              className="text-xs px-3 py-1"
              onClick={onCancel}
            >
              {cancelText}
            </Button>
          </div>
        )}
      </div>

      {isClosable && (
        <button
          type="button"
          className="ml-3 -mt-1 -mr-1 rounded-md p-1.5 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
          onClick={onClose}
        >
          <span className="sr-only">Đóng</span>
          <Icon name="XMarkIcon" className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}; 