import { createContext, useContext, useState, useEffect, FC, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { User, UserRole } from '@/types/auth.types';
import { getDoc, doc, setDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser({
              id: userDoc.id,
              email: userData.email,
              displayName: userData.displayName,
              role: userData.role as UserRole,
              permissions: userData.permissions || [],
              isActive: userData.isActive,
              lastLogin: userData.lastLogin,
              createdAt: userData.createdAt,
              updatedAt: userData.updatedAt
            });
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err instanceof Error ? err.message : 'Đã có lỗi xảy ra');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  const login = async (email: string, password: string) => {
    try {
      clearError();
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Fetch additional user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        throw new Error('User data not found');
      }

      const userData = userDoc.data();
      setUser({
        id: userDoc.id,
        email: userData.email,
        displayName: userData.displayName,
        role: userData.role as UserRole,
        permissions: userData.permissions || [],
        isActive: userData.isActive,
        lastLogin: userData.lastLogin,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt
      });

      // Update lastLogin
      await setDoc(doc(db, 'users', result.user.uid), {
        lastLogin: serverTimestamp(),
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      handleAuthError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    try {
      clearError();
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      const now = Timestamp.now();
      // Create user document in Firestore
      const userData = {
        email,
        displayName: email.split('@')[0],
        role: 'STAFF' as UserRole,
        permissions: [],
        isActive: true,
        lastLogin: null,
        createdAt: now,
        updatedAt: now
      };

      await setDoc(doc(db, 'users', result.user.uid), {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setUser({ id: result.user.uid, ...userData });
    } catch (err) {
      handleAuthError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    try {
      clearError();
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      handleAuthError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = (err: unknown) => {
    if (err instanceof FirebaseError) {
      switch (err.code) {
        case 'auth/user-not-found':
          setError('Tài khoản không tồn tại');
          break;
        case 'auth/wrong-password':
          setError('Mật khẩu không đúng');
          break;
        case 'auth/email-already-in-use':
          setError('Email đã được sử dụng');
          break;
        case 'auth/weak-password':
          setError('Mật khẩu quá yếu');
          break;
        default:
          console.error('Auth error:', err);
          setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    } else {
      console.error('Unknown error:', err);
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    resetPassword,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 