import { useState, useCallback } from 'react';
import { useNotificationStore } from '@/stores/useNotificationStore';

interface UseAsyncOptions {
  errorMessage?: string;
  successMessage?: string;
  showNotification?: boolean;
}

export const useAsync = <T>(
  asyncFn: (...args: any[]) => Promise<T>,
  options: UseAsyncOptions = {}
) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { showSuccess, showError } = useNotificationStore();

  const execute = useCallback(async (...args: any[]) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await asyncFn(...args);
      
      if (options.showNotification && options.successMessage) {
        showSuccess(options.successMessage);
      }
      
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : options.errorMessage || 'Có lỗi xảy ra';
      setError(err as Error);
      
      if (options.showNotification) {
        showError(message);
      }
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [asyncFn, options, showSuccess, showError]);

  return {
    isLoading,
    error,
    execute
  };
}; 