import { useAuthStore } from '@/stores/useAuthStore';

export const useAuth = () => {
  const { user, isLoading: loading, error, signIn, signOut } = useAuthStore();

  return {
    user,
    loading,
    error,
    signIn,
    signOut
  };
}; 